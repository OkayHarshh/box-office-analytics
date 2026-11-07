import logging
import os
from contextlib import asynccontextmanager
from copy import deepcopy
from threading import RLock
from time import monotonic
from typing import Any, Callable, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg_pool import ConnectionPool

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

DATABASE_URL = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("box-office-api")

db_pool: Optional[ConnectionPool] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool

    if not DATABASE_URL:
        logger.warning("Supabase database URL is not configured")
    else:
        db_pool = ConnectionPool(
            conninfo=DATABASE_URL,
            min_size=1,
            max_size=int(os.getenv("DB_POOL_MAX_SIZE", "5")),
            timeout=10,
            open=False,
            kwargs={"prepare_threshold": None},
        )
        db_pool.open()
        logger.info("Supabase connection pool opened")

    yield

    if db_pool is not None:
        db_pool.close()
        db_pool = None


app = FastAPI(title="Box Office API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CACHE
_CACHE = {}
_CACHE_LOCK = RLock()

TTL_TOP_RANKINGS = 15 * 60
TTL_OPENING_RANKINGS = 15 * 60
TTL_YEARLY = 60 * 60
TTL_MOVIE_DETAIL = 30 * 60
TTL_SEARCH = 90


def cached_result(key: str, ttl_seconds: int, loader: Callable):
    with _CACHE_LOCK:
        entry = _CACHE.get(key)

        if entry is not None and monotonic() < entry[0]:
            return deepcopy(entry[1])

        stale_value = entry[1] if entry is not None else None

    try:
        value = loader()

    except Exception:
        if stale_value is not None:
            logger.exception("Serving stale cache for %s", key)
            return deepcopy(stale_value)
        raise

    with _CACHE_LOCK:
        _CACHE[key] = (
            monotonic() + ttl_seconds,
            deepcopy(value)
        )

    return value


# DATABASE CONNECTION

def fetch_all(query: str, parameters=None):

    if db_pool is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase database is not configured or connected"
        )

    try:
        with db_pool.connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(query, parameters or ())
                return cursor.fetchall()

    except Exception as exc:
        logger.exception("Supabase query failed")

        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve data from analytics database"
        ) from exc


# HEALTH CHECK

@app.get("/")
def home():
    return {"message": "Box Office API is running"}


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


# TOP LIFETIME MOVIES

def _load_top_lifetime_movies():

    rows = fetch_all("""
        SELECT movie_id, movie_name, lifetime, lifetime_rank
        FROM public.gold_movie_rankings
        WHERE lifetime IS NOT NULL
        ORDER BY lifetime_rank
        LIMIT 20
    """)

    return [
        {
            "movie_id": r[0],
            "movie_name": r[1],
            "lifetime_cr": r[2],
            "rank": r[3]
        }
        for r in rows
    ]


def get_top_lifetime_cached():
    return cached_result(
        "top_lifetime",
        TTL_TOP_RANKINGS,
        _load_top_lifetime_movies
    )


@app.get("/api/movies/top-lifetime")
def top_lifetime_movies():
    return get_top_lifetime_cached()


@app.get("/api/rankings/lifetime")
def lifetime_rankings():
    return get_top_lifetime_cached()


# OPENING DAY RANKINGS

def _load_opening_day_rankings():

    rows = fetch_all("""
        SELECT movie_id, movie_name, opening_day
        FROM public.gold_movie_performance
        WHERE opening_day IS NOT NULL
        ORDER BY opening_day DESC
        LIMIT 20
    """)

    return [
        {
            "movie_id": r[0],
            "movie_name": r[1],
            "value": r[2],
            "rank": i + 1
        }
        for i, r in enumerate(rows)
    ]


@app.get("/api/rankings/opening-day")
def opening_day_rankings():

    return cached_result(
        "opening_day_rankings",
        TTL_OPENING_RANKINGS,
        _load_opening_day_rankings
    )


# OPENING WEEKEND RANKINGS

def _load_opening_weekend_rankings():

    rows = fetch_all("""
        SELECT movie_id, movie_name, opening_weekend
        FROM public.gold_movie_performance
        WHERE opening_weekend IS NOT NULL
        ORDER BY opening_weekend DESC
        LIMIT 20
    """)

    return [
        {
            "movie_id": r[0],
            "movie_name": r[1],
            "value": r[2],
            "rank": i + 1
        }
        for i, r in enumerate(rows)
    ]


@app.get("/api/rankings/opening-weekend")
def opening_weekend_rankings():

    return cached_result(
        "opening_weekend_rankings",
        TTL_OPENING_RANKINGS,
        _load_opening_weekend_rankings
    )


# MOVIE SEARCH

def _load_movie_search(name: str):

    rows = fetch_all("""
        SELECT movie_id, movie_name, release_date, lifetime
        FROM public.gold_movie_performance
        WHERE LOWER(movie_name) LIKE LOWER(%s)
        ORDER BY lifetime DESC NULLS LAST
        LIMIT 20
    """, (f"%{name}%",))

    return [
        {
            "movie_id": r[0],
            "movie_name": r[1],
            "release_date": str(r[2]) if r[2] else None,
            "lifetime_cr": r[3]
        }
        for r in rows
    ]


@app.get("/api/movies/search")
def search_movies(name: str):

    normalized = name.strip()

    if not normalized:
        return []

    return cached_result(
        f"movie_search:{normalized.casefold()}",
        TTL_SEARCH,
        lambda: _load_movie_search(normalized)
    )


# MOVIE DETAILS

def _load_movie(movie_id: str):

    rows = fetch_all("""
        SELECT
            movie_id,
            movie_name,
            release_date,
            opening_day,
            opening_weekend,
            week_1,
            lifetime
        FROM public.gold_movie_performance
        WHERE movie_id = %s
        LIMIT 1
    """, (movie_id,))

    if not rows:
        return {"error": "Movie not found"}

    r = rows[0]

    return {
        "movie_id": r[0],
        "movie_name": r[1],
        "release_date": str(r[2]) if r[2] else None,
        "opening_day_cr": r[3],
        "opening_weekend_cr": r[4],
        "week_1_cr": r[5],
        "lifetime_cr": r[6]
    }


@app.get("/api/movies/{movie_id}")
def get_movie(movie_id: str):

    return cached_result(
        f"movie_detail:{movie_id}",
        TTL_MOVIE_DETAIL,
        lambda: _load_movie(movie_id)
    )


# YEARLY PERFORMANCE

def _load_yearly_box_office():

    rows = fetch_all("""
        SELECT
            release_year,
            movie_count,
            total_lifetime_cr,
            avg_lifetime_cr,
            highest_lifetime_cr
        FROM public.gold_yearly_performance
        ORDER BY release_year
    """)

    return [
        {
            "year": r[0],
            "movie_count": r[1],
            "total_lifetime_cr": r[2],
            "avg_lifetime_cr": r[3],
            "highest_lifetime_cr": r[4]
        }
        for r in rows
    ]


@app.get("/api/years")
def yearly_box_office():

    return cached_result(
        "yearly_box_office",
        TTL_YEARLY,
        _load_yearly_box_office
    )