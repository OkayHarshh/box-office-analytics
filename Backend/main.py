import logging
import os
from copy import deepcopy
from threading import RLock
from time import monotonic
from typing import Any, Callable, Optional

from databricks import sql
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SERVER_HOSTNAME = os.getenv("DATABRICKS_SERVER_HOSTNAME")
HTTP_PATH = os.getenv("DATABRICKS_HTTP_PATH")
TOKEN = os.getenv("DATABRICKS_TOKEN")

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("box-office-api")

app = FastAPI(title="Box Office API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Per-process cache. Values are copied on read/write to prevent accidental mutation.
_CACHE: dict[str, tuple[float, Any]] = {}
_CACHE_LOCK = RLock()

TTL_TOP_RANKINGS = 15 * 60
TTL_OPENING_RANKINGS = 15 * 60
TTL_YEARLY = 60 * 60
TTL_MOVIE_DETAIL = 30 * 60
TTL_SEARCH = 90


def cached_result(key: str, ttl_seconds: int, loader: Callable[[], Any]) -> Any:
    with _CACHE_LOCK:
        entry = _CACHE.get(key)
        if entry is not None and monotonic() < entry[0]:
            logger.debug("Cache hit: %s", key)
            return deepcopy(entry[1])
        stale_value = entry[1] if entry is not None else None

    # Never hold the global cache lock during a network/database call.
    try:
        value = loader()
    except Exception:
        if stale_value is not None:
            logger.exception("Databricks failed; serving stale cache for %s", key)
            return deepcopy(stale_value)
        raise

    with _CACHE_LOCK:
        _CACHE[key] = (monotonic() + ttl_seconds, deepcopy(value))
    return value


def get_db_connection():
    if not all((SERVER_HOSTNAME, HTTP_PATH, TOKEN)):
        raise HTTPException(status_code=503, detail="Databricks connection is not configured")
    return sql.connect(
        server_hostname=SERVER_HOSTNAME,
        http_path=HTTP_PATH,
        access_token=TOKEN,
    )


def fetch_all(query: str, parameters: Optional[tuple] = None) -> list:
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                if parameters is None:
                    cursor.execute(query)
                else:
                    cursor.execute(query, parameters)
                return cursor.fetchall()
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Databricks query failed")
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve data from the analytics database",
        ) from exc


@app.get("/")
def home():
    # Lightweight health response: intentionally does not call Databricks.
    return {"message": "Box Office API is running"}


@app.get("/healthz")
def health_check():
    return {"status": "ok"}


def _load_top_lifetime_movies() -> list:
    rows = fetch_all("""
        SELECT movie_id, movie_name, lifetime, lifetime_rank
        FROM movie.gold.gold_movie_rankings
        WHERE lifetime IS NOT NULL
        ORDER BY lifetime_rank
        LIMIT 20
    """)
    return [
        {"movie_id": r[0], "movie_name": r[1], "lifetime_cr": r[2], "rank": r[3]}
        for r in rows
    ]


def get_top_lifetime_cached() -> list:
    return cached_result("top_lifetime", TTL_TOP_RANKINGS, _load_top_lifetime_movies)


@app.get("/api/movies/top-lifetime")
def top_lifetime_movies():
    return get_top_lifetime_cached()


@app.get("/api/rankings/lifetime")
def lifetime_rankings():
    # Reuses the homepage cache rather than running the same SQL again.
    return get_top_lifetime_cached()


def _load_opening_day_rankings() -> list:
    rows = fetch_all("""
        SELECT movie_id, movie_name, opening_day
        FROM movie.gold.gold_movie_performance
        WHERE opening_day IS NOT NULL
        ORDER BY opening_day DESC
        LIMIT 20
    """)
    return [
        {"movie_id": r[0], "movie_name": r[1], "value": r[2], "rank": i + 1}
        for i, r in enumerate(rows)
    ]


@app.get("/api/rankings/opening-day")
def opening_day_rankings():
    return cached_result("opening_day_rankings", TTL_OPENING_RANKINGS, _load_opening_day_rankings)


def _load_opening_weekend_rankings() -> list:
    rows = fetch_all("""
        SELECT movie_id, movie_name, opening_weekend
        FROM movie.gold.gold_movie_performance
        WHERE opening_weekend IS NOT NULL
        ORDER BY opening_weekend DESC
        LIMIT 20
    """)
    return [
        {"movie_id": r[0], "movie_name": r[1], "value": r[2], "rank": i + 1}
        for i, r in enumerate(rows)
    ]


@app.get("/api/rankings/opening-weekend")
def opening_weekend_rankings():
    return cached_result(
        "opening_weekend_rankings", TTL_OPENING_RANKINGS, _load_opening_weekend_rankings
    )


def _load_movie_search(name: str) -> list:
    rows = fetch_all("""
        SELECT movie_id, movie_name, release_date, lifetime
        FROM movie.gold.gold_movie_performance
        WHERE LOWER(movie_name) LIKE LOWER(?)
        ORDER BY lifetime DESC
        LIMIT 20
    """, (f"%{name}%",))
    return [
        {
            "movie_id": r[0],
            "movie_name": r[1],
            "release_date": str(r[2]) if r[2] else None,
            "lifetime_cr": r[3],
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
        lambda: _load_movie_search(normalized),
    )


def _load_movie(movie_id: str) -> dict:
    rows = fetch_all("""
        SELECT movie_id, movie_name, release_date, opening_day,
               opening_weekend, week_1, lifetime
        FROM movie.gold.gold_movie_performance
        WHERE movie_id = ?
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
        "lifetime_cr": r[6],
    }


@app.get("/api/movies/{movie_id}")
def get_movie(movie_id: str):
    return cached_result(
        f"movie_detail:{movie_id}", TTL_MOVIE_DETAIL, lambda: _load_movie(movie_id)
    )


def _load_yearly_box_office() -> list:
    rows = fetch_all("""
        SELECT release_year, movie_count, total_lifetime_cr,
               avg_lifetime_cr, highest_lifetime_cr
        FROM movie.gold.gold_yearly_performance
        ORDER BY release_year
    """)
    return [
        {
            "year": r[0],
            "movie_count": r[1],
            "total_lifetime_cr": r[2],
            "avg_lifetime_cr": r[3],
            "highest_lifetime_cr": r[4],
        }
        for r in rows
    ]


@app.get("/api/years")
def yearly_box_office():
    return cached_result("yearly_box_office", TTL_YEARLY, _load_yearly_box_office)
