"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

type Movie = {
  movie_id: string;
  movie_name: string;
  release_date?: string;
  lifetime_cr?: number | string | null;
  rank?: number;
};

export default function Home() {
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    loadTopMovies();
  }, []);

  function loadTopMovies() {
    setMoviesLoading(true);
    setMoviesError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/movies/top-lifetime`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch movies");
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setMoviesError(true);
        setMovies([]);
      })
      .finally(() => setMoviesLoading(false));
  }

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(false);

    const timer = setTimeout(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/movies/search?name=${encodeURIComponent(
          trimmedSearch
        )}`
      )
        .then((response) => {
          if (!response.ok) throw new Error("Search failed");
          return response.json();
        })
        .then((data) => setSearchResults(data))
        .catch((error) => {
          console.error("Search error:", error);
          setSearchResults([]);
          setSearchError(true);
        })
        .finally(() => setSearchLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const visibleCollection = movies.reduce(
    (sum, movie) => sum + Number(movie.lifetime_cr || 0),
    0
  );

  function openMovie(movieId: string) {
    setSearch("");
    setSearchResults([]);
    router.push(`/movies/${movieId}`);
  }

  return (
    <main className="cinema-page cinema-home min-h-screen overflow-x-hidden">
      <Navbar />

      {/* THE AUDITORIUM */}
      <section className="theatre-entrance">
        <div className="theatre-grain" />
        <div className="theatre-curtain theatre-curtain-left" />
        <div className="theatre-curtain theatre-curtain-right" />

        <div className="theatre-top-sign">
          <span className="sign-line" />
          <span className="sign-text">THE GRAND CINEMA EXPERIENCE</span>
          <span className="sign-line" />
        </div>

        <div className="auditorium-content">
          <div className="auditorium-copy">
            <div className="screening-label">
              <span className="screening-dot" />
              THE CINEMA LEDGER · EST. 1950
            </div>

            <h1>
              Every film
              <br />
              has a story.
              <br />
              <em>Some make history.</em>
            </h1>

            <p className="auditorium-description">
              Step inside the numbers behind Indian cinema.
              Explore the biggest openings, legendary runs and
              all-time box office champions.
            </p>

            <div className="auditorium-actions">
              <button
                onClick={() =>
                  document
                    .getElementById("box-office-search")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="gold-ticket-button"
              >
                EXPLORE THE COLLECTION
                <span>↗</span>
              </button>

              <button
                onClick={() => router.push("/rankings")}
                className="text-link-button"
              >
                VIEW RANKINGS <span>→</span>
              </button>
            </div>
          </div>

          {/* THE MAIN CINEMA SCREEN */}
          <div className="cinema-screen-scene">
            <div className="projector-beam" />
            <div className="screen-frame">
              <div className="screen-light">
                <div className="screen-topline">
                  <span>NOW SCREENING</span>
                  <span>NO. 001</span>
                </div>

                <div className="screen-main-title">
                  THE
                  <br />
                  BIG
                  <br />
                  HITS
                </div>

                <div className="screen-bottomline">
                  <span>INDIAN CINEMA</span>
                  <span>1950 — 2023</span>
                </div>
              </div>
            </div>

            <div className="screen-stage">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="auditorium-seats">
              <div className="seat-row seat-row-back">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
              <div className="seat-row seat-row-front">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>

            <div className="aisle-lights">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="theatre-bottom-strip">
          <span>PLEASE TAKE YOUR SEAT</span>
          <span className="strip-stars">✦ ✦ ✦</span>
          <span>THE SHOW IS ABOUT TO BEGIN</span>
        </div>
      </section>

      {/* BOX OFFICE SEARCH */}
      <section
        id="box-office-search"
        className="box-office-counter-section"
      >
        <div className="section-overline">
          <span>01</span>
          <span className="overline-rule" />
          <span>THE BOX OFFICE</span>
        </div>

        <div className="counter-heading">
          <div>
            <h2>Looking for a film?</h2>
            <p>Find its story in the numbers.</p>
          </div>

          <div className="counter-open">
            <span />
            BOX OFFICE OPEN
          </div>
        </div>

        <div className="ticket-counter">
          <div className="counter-side">
            <span className="counter-side-top">B.O.</span>
            <span className="counter-side-bottom">SEARCH</span>
          </div>

          <div className="counter-search-area">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="counter-search-icon"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" strokeLinecap="round" />
            </svg>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter a movie name..."
              aria-label="Search movies"
            />

            <span className="counter-search-hint">SEARCH FILMS</span>
          </div>
        </div>

        {search.trim() !== "" && (
          <div className="theatre-search-results">
            {searchLoading ? (
              <div className="search-message">Searching the archives...</div>
            ) : searchError ? (
              <div className="search-message search-error">
                Unable to search movies. Please try again.
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((movie, index) => (
                <button
                  key={movie.movie_id}
                  onClick={() => openMovie(movie.movie_id)}
                  className="theatre-result"
                >
                  <span className="result-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="result-name">
                    <strong>{movie.movie_name}</strong>
                    <small>
                      {movie.release_date || "Release date unavailable"}
                    </small>
                  </span>

                  <span className="result-collection">
                    ₹{Number(movie.lifetime_cr || 0).toLocaleString()} Cr
                  </span>

                  <span className="result-arrow">↗</span>
                </button>
              ))
            ) : (
              <div className="search-message">
                No movies found for "{search.trim()}"
              </div>
            )}
          </div>
        )}
      </section>

      {/* THE NUMBERS */}
      <section className="theatre-numbers-section">
        <div className="section-overline">
          <span>02</span>
          <span className="overline-rule" />
          <span>THE BIG PICTURE</span>
        </div>

        <div className="numbers-heading">
          <h2>Beyond the silver screen.</h2>
          <p>
            A look at the scale of Indian theatrical success.
          </p>
        </div>

        <div className="illuminated-signs">
          <div className="illuminated-sign">
            <span className="sign-index">01 / RANKING</span>
            <strong>TOP 20</strong>
            <span className="sign-description">ALL-TIME GROSSERS</span>
          </div>

          <div className="illuminated-sign sign-featured">
            <span className="sign-index">02 / COLLECTION</span>
            <strong>
              ₹{visibleCollection.toLocaleString("en-IN")}
              <small> Cr</small>
            </strong>
            <span className="sign-description">TOP 20 COMBINED</span>
          </div>

          <div className="illuminated-sign">
            <span className="sign-index">03 / ARCHIVE</span>
            <strong>74 YEARS</strong>
            <span className="sign-description">1950 — 2023</span>
          </div>
        </div>
      </section>

      {/* SCREENING PROGRAMME */}
      <section className="screening-programme-section">
        <div className="programme-header">
          <div>
            <div className="section-overline">
              <span>03</span>
              <span className="overline-rule" />
              <span>THE SCREENING PROGRAMME</span>
            </div>

            <h2>Legends of the box office.</h2>
            <p>
              The films that brought audiences to theatres.
            </p>
          </div>

          <button
            onClick={() => router.push("/rankings")}
            className="programme-all-link"
          >
            FULL RANKINGS <span>↗</span>
          </button>
        </div>

        <div className="programme-board">
          <div className="programme-board-heading">
            <span>RANK</span>
            <span>FEATURE PRESENTATION</span>
            <span>LIFETIME COLLECTION</span>
            <span>POSITION</span>
          </div>

          {moviesLoading ? (
            <div className="programme-state">
              <span className="programme-loader" />
              Preparing the screening programme...
            </div>
          ) : moviesError ? (
            <div className="programme-state programme-error">
              <p>We couldn't load the box office records.</p>
              <button onClick={loadTopMovies}>TRY AGAIN ↻</button>
            </div>
          ) : movies.length === 0 ? (
            <div className="programme-state">
              No box office records available.
            </div>
          ) : (
            movies.map((movie, index) => (
              <button
                key={movie.movie_id}
                onClick={() => openMovie(movie.movie_id)}
                className={`programme-row ${
                  index === 0 ? "programme-row-first" : ""
                }`}
              >
                <span className="programme-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="programme-movie">
  <span className="programme-film-icon">▶</span>

  <span className="movie-curtain-title">
    <span className="curtain-label">NOW SHOWING</span>
    <strong>{movie.movie_name}</strong>
    <small>INDIAN CINEMA · FEATURE PRESENTATION</small>
  </span>
</span>

                <span className="programme-amount">
                  ₹{Number(movie.lifetime_cr || 0).toLocaleString("en-IN")} Cr
                </span>

                <span className="programme-position">
                  #{movie.rank ?? index + 1}
                  <span>↗</span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="programme-footnote">
          <span>BOX OFFICE ARCHIVES</span>
          <span>FIGURES IN ₹ CRORES</span>
          <span>END OF TRANSMISSION · 2023</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="theatre-footer">
        <div className="footer-curtain-line" />
        <div className="footer-content">
          <div>
            <span className="footer-kicker">THE CINEMA LEDGER</span>
            <h2>Every number tells a story.</h2>
          </div>

          <div className="footer-navigation">
            <button onClick={() => router.push("/")}>MOVIES</button>
            <button onClick={() => router.push("/rankings")}>
              RANKINGS
            </button>
            <button onClick={() => router.push("/years")}>YEARS</button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>BOX OFFICE © 2026</span>
          <span>MADE FOR THE LOVE OF CINEMA</span>
        </div>
      </footer>
    </main>
  );
}