
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type RankingType = "lifetime" | "opening-day" | "opening-weekend";

export default function RankingsPage() {
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeRanking, setActiveRanking] =
    useState<RankingType>("lifetime");

  useEffect(() => {
    loadRankings(activeRanking);
  }, [activeRanking]);

  function loadRankings(type: RankingType) {
    setLoading(true);
    setError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rankings/${type}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch rankings");
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((err) => {
        console.error("Error fetching rankings:", err);
        setMovies([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }

  function getRankingLabel() {
    if (activeRanking === "opening-day") return "Opening Day";
    if (activeRanking === "opening-weekend") return "Opening Weekend";
    return "Lifetime";
  }

  function getMovieValue(movie: any) {
    return activeRanking === "lifetime" ? movie.lifetime_cr : movie.value;
  }

  const podium = [
    { movie: movies[1], place: 2 },
    { movie: movies[0], place: 1 },
    { movie: movies[2], place: 3 },
  ];

  return (
    <main className="cinema-page rankings-page min-h-screen overflow-x-hidden">
      <Navbar />

      {/* CINEMATIC HERO */}
      <section className="hall-hero">
        <div className="hall-grain" />
        <div className="hall-curtain hall-curtain-left" />
        <div className="hall-curtain hall-curtain-right" />

        <div className="hall-hero-inner">
          <div className="hall-copy">
            <div className="hall-eyebrow">
              <span />
              THE INDIAN CINEMA HALL OF FAME
            </div>

            <p className="hall-edition">THE BOX OFFICE ARCHIVES · EST. 1950</p>

            <h1>
              Legends
              <br />
              <span>of the</span>
              <br />
              Box Office<span className="hall-period">.</span>
            </h1>

            <p className="hall-description">
              Some films entertain. Some films make history.
              Explore the biggest theatrical milestones in Indian cinema.
            </p>

            <div className="hall-hero-meta">
              <span>1950 — 2023</span>
              <i />
              <span>THE DEFINITIVE LEDGER</span>
            </div>
          </div>

          <div className="bachchan-frame">
            <div className="bachchan-frame-top">
              <span>THE LEGENDS COLLECTION</span>
              <span>NO. 001</span>
            </div>

            <div className="bachchan-photo-wrap">
              <img
                src="/amitabh-bachchan.jpg"
                alt="Amitabh Bachchan in a vintage film still"
                className="bachchan-photo"
              />
              <div className="bachchan-photo-shade" />
              <div className="bachchan-caption">
                <span>THE ANGRY YOUNG MAN</span>
                <strong>AMITABH BACHCHAN</strong>
                <small>A LEGACY THAT FILLED THEATRES</small>
              </div>
            </div>

            <div className="bachchan-frame-bottom">
              <span>INDIAN CINEMA</span>
              <span>FOREVER ON SCREEN</span>
            </div>
          </div>
        </div>

        <div className="hall-bottom-line">
          <span>LIGHTS</span>
          <span>CAMERA</span>
          <span>BOX OFFICE</span>
          <span>ACTION</span>
        </div>
      </section>

      {/* TOP THREE */}
      <section className="hall-podium-section">
        <div className="hall-section-heading">
          <div>
            <span className="hall-section-kicker">THE FRONT ROW</span>
            <h2>The biggest crowd-pullers.</h2>
            <p>Three films. Three places in cinema history.</p>
          </div>
          <span className="hall-section-number">01 / THE PODIUM</span>
        </div>

        <div className="hall-podium">
          {podium.map(({ movie, place }) => (
            <button
              key={place}
              disabled={!movie}
              onClick={() =>
                movie && router.push(`/movies/${movie.movie_id}`)
              }
              className={`hall-podium-card hall-podium-${place}`}
            >
              <span className="podium-label">
                {place === 1 ? "THE CHAMPION" : `POSITION 0${place}`}
              </span>

              <span className="podium-medal">
                {place === 1 ? "I" : place === 2 ? "II" : "III"}
              </span>

              <strong className="podium-movie-name">
                {movie?.movie_name ||
                  (loading ? "Awaiting the screening" : "No film available")}
              </strong>

              <span className="podium-collection">
                {movie
                  ? `₹${Number(getMovieValue(movie) || 0).toLocaleString()} Cr`
                  : "—"}
              </span>

              <span className="podium-bottom-label">
                {getRankingLabel().toUpperCase()} COLLECTION
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* RANKING FILTERS */}
      <section className="hall-ranking-section">
        <div className="hall-section-heading hall-ledger-heading">
          <div>
            <span className="hall-section-kicker">THE OFFICIAL LEDGER</span>
            <h2>Every crore tells a story.</h2>
            <p>Explore the records that defined theatrical success.</p>
          </div>
          <span className="hall-section-number">02 / THE ARCHIVE</span>
        </div>

        <div className="hall-filter-bar">
          {[
            { value: "lifetime", label: "Lifetime" },
            { value: "opening-day", label: "Opening Day" },
            { value: "opening-weekend", label: "Opening Weekend" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveRanking(tab.value as RankingType)}
              className={
                activeRanking === tab.value ? "hall-filter-active" : ""
              }
            >
              {tab.label}
            </button>
          ))}

          <span className="hall-filter-note">
            SHOWING · {getRankingLabel().toUpperCase()}
          </span>
        </div>

        <div className="hall-table">
          <div className="hall-table-header">
            <span>RANK</span>
            <span>FEATURE PRESENTATION</span>
            <span>COLLECTION</span>
            <span>POSITION</span>
          </div>

          {loading ? (
            <div className="hall-loading">
              <div className="hall-loading-light" />
              <p>THE PROJECTIONIST IS PREPARING THE SHOW</p>
              {[1, 2, 3, 4, 5].map((item) => (
                <div className="hall-skeleton" key={item} />
              ))}
            </div>
          ) : error ? (
            <div className="hall-empty">
              <span className="hall-error-icon">!</span>
              <h3>The screening was interrupted.</h3>
              <p>We couldn't retrieve the box office records.</p>
              <button onClick={() => loadRankings(activeRanking)}>
                TRY AGAIN ↻
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="hall-empty">
              <h3>No records in this screening.</h3>
              <p>There is no ranking data available for this category.</p>
            </div>
          ) : (
            movies.map((movie, index) => (
              <button
                key={movie.movie_id}
                onClick={() => router.push(`/movies/${movie.movie_id}`)}
                className={`hall-movie-row ${
                  index === 0 ? "hall-row-first" : ""
                }`}
              >
                <span className="hall-row-rank">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="hall-row-movie">
                  <span className="hall-film-reel">▶</span>
                  <span className="hall-row-title">
                    <strong>{movie.movie_name}</strong>
                    <small>INDIAN CINEMA · FEATURE PRESENTATION</small>
                  </span>
                </span>

                <span className="hall-row-value">
                  ₹{Number(getMovieValue(movie) || 0).toLocaleString()} Cr
                </span>

                <span className="hall-row-position">
                  #{movie.rank}
                  <span>↗</span>
                </span>
              </button>
            ))
          )}
        </div>

        <div className="hall-table-footer">
          <span>BOX OFFICE ARCHIVES</span>
          <span>FIGURES IN ₹ CRORES</span>
          <span>END OF TRANSMISSION · 2023</span>
        </div>
      </section>

      <footer className="hall-footer">
        <div>
          <strong>BOX OFFICE</strong>
          <span>THE CINEMA LEDGER</span>
        </div>
        <p>CELEBRATING THE FILMS THAT FILLED OUR THEATRES.</p>
        <span>1950 — 2023</span>
      </footer>
    </main>
  );
}
