from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from databricks import sql
from dotenv import load_dotenv
import os


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_FILE)


# ============================================================
# DATABRICKS CONFIG
# ============================================================

SERVER_HOSTNAME = os.getenv("DATABRICKS_SERVER_HOSTNAME")
HTTP_PATH = os.getenv("DATABRICKS_HTTP_PATH")
TOKEN = os.getenv("DATABRICKS_TOKEN")


# ============================================================
# APP
# ============================================================

app = FastAPI(title="Box Office API")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_db_connection():
    return sql.connect(
        server_hostname=SERVER_HOSTNAME,
        http_path=HTTP_PATH,
        access_token=TOKEN,
    )


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Box Office API is running"
    }


# ============================================================
# TOP LIFETIME MOVIES
# ============================================================

@app.get("/api/movies/top-lifetime")
def top_lifetime_movies():

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    movie_id,
                    movie_name,
                    lifetime,
                    lifetime_rank
                FROM movie.gold.gold_movie_rankings
                WHERE lifetime IS NOT NULL
                ORDER BY lifetime_rank
                LIMIT 20
            """)

            rows = cursor.fetchall()

            return [
                {
                    "movie_id": row[0],
                    "movie_name": row[1],
                    "lifetime_cr": row[2],
                    "rank": row[3],
                }
                for row in rows
            ]
@app.get("/api/rankings/lifetime")
def lifetime_rankings():
    return top_lifetime_movies()

# ============================================================
# OPENING DAY RANKINGS
# ============================================================

@app.get("/api/rankings/opening-day")
def opening_day_rankings():

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    movie_id,
                    movie_name,
                    opening_day
                FROM movie.gold.gold_movie_performance
                WHERE opening_day IS NOT NULL
                ORDER BY opening_day DESC
                LIMIT 20
            """)

            rows = cursor.fetchall()

            return [
                {
                    "movie_id": row[0],
                    "movie_name": row[1],
                    "value": row[2],
                    "rank": index + 1,
                }
                for index, row in enumerate(rows)
            ]


# ============================================================
# OPENING WEEKEND RANKINGS
# ============================================================

@app.get("/api/rankings/opening-weekend")
def opening_weekend_rankings():

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    movie_id,
                    movie_name,
                    opening_weekend
                FROM movie.gold.gold_movie_performance
                WHERE opening_weekend IS NOT NULL
                ORDER BY opening_weekend DESC
                LIMIT 20
            """)

            rows = cursor.fetchall()

            return [
                {
                    "movie_id": row[0],
                    "movie_name": row[1],
                    "value": row[2],
                    "rank": index + 1,
                }
                for index, row in enumerate(rows)
            ]


# ============================================================
# SEARCH MOVIES
# ============================================================

@app.get("/api/movies/search")
def search_movies(name: str):

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    movie_id,
                    movie_name,
                    release_date,
                    lifetime
                FROM movie.gold.gold_movie_performance
                WHERE LOWER(movie_name) LIKE LOWER(?)
                ORDER BY lifetime DESC
                LIMIT 20
            """, (f"%{name}%",))

            rows = cursor.fetchall()

            return [
                {
                    "movie_id": row[0],
                    "movie_name": row[1],
                    "release_date": (
                        str(row[2])
                        if row[2]
                        else None
                    ),
                    "lifetime_cr": row[3],
                }
                for row in rows
            ]


# ============================================================
# MOVIE DETAIL
# ============================================================

@app.get("/api/movies/{movie_id}")
def get_movie(movie_id: str):

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    movie_id,
                    movie_name,
                    release_date,
                    opening_day,
                    opening_weekend,
                    week_1,
                    lifetime
                FROM movie.gold.gold_movie_performance
                WHERE movie_id = ?
            """, (movie_id,))

            row = cursor.fetchone()

            if row is None:
                return {
                    "error": "Movie not found"
                }

            return {
                "movie_id": row[0],
                "movie_name": row[1],
                "release_date": (
                    str(row[2])
                    if row[2]
                    else None
                ),
                "opening_day_cr": row[3],
                "opening_weekend_cr": row[4],
                "week_1_cr": row[5],
                "lifetime_cr": row[6],
            }


# ============================================================
# YEARLY BOX OFFICE
# ============================================================

@app.get("/api/years")
def yearly_box_office():

    with get_db_connection() as connection:

        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT
                    release_year,
                    movie_count,
                    total_lifetime_cr,
                    avg_lifetime_cr,
                    highest_lifetime_cr
                FROM movie.gold.gold_yearly_performance
                ORDER BY release_year
            """)

            rows = cursor.fetchall()

            return [
                {
                    "year": row[0],
                    "movie_count": row[1],
                    "total_lifetime_cr": row[2],
                    "avg_lifetime_cr": row[3],
                    "highest_lifetime_cr": row[4],
                }
                for row in rows
            ]