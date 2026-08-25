"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type RankingType =
  | "lifetime"
  | "opening-day"
  | "opening-weekend";

export default function RankingsPage() {
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeRanking, setActiveRanking] =
    useState<RankingType>("lifetime");

  // ============================================================
  // LOAD RANKINGS
  // ============================================================

  useEffect(() => {
    loadRankings(activeRanking);
  }, [activeRanking]);

  function loadRankings(type: RankingType) {
    setLoading(true);
    setError(false);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/rankings/${type}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rankings");
        }

        return response.json();
      })
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching rankings:", error);
        setMovies([]);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // ============================================================
  // RANKING LABEL
  // ============================================================

  function getRankingLabel() {
    if (activeRanking === "opening-day") {
      return "Opening Day";
    }

    if (activeRanking === "opening-weekend") {
      return "Opening Weekend";
    }

    return "Lifetime";
  }

  // ============================================================
  // VALUE
  // ============================================================

  function getMovieValue(movie: any) {
    if (activeRanking === "lifetime") {
      return movie.lifetime_cr;
    }

    return movie.value;
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative border-b border-zinc-900">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-white/[0.025] blur-3xl" />

          <div className="absolute left-[-150px] top-40 h-[350px] w-[350px] rounded-full bg-zinc-500/[0.02] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-32">

          <div className="mb-7 flex items-center gap-3">

            <span className="h-px w-8 bg-zinc-600" />

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Indian Box Office Analytics
            </p>

          </div>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">

            The
            <br />

            <span className="text-zinc-500">
              Rankings.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
            Explore India's biggest box office performers,
            ranked across lifetime collections, opening days
            and opening weekends.
          </p>

        </div>

      </section>

      {/* ======================================================
          FILTERS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">

        <div className="flex flex-wrap gap-2">

          <button
            onClick={() =>
              setActiveRanking("lifetime")
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              activeRanking === "lifetime"
                ? "bg-white text-black"
                : "border border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600 hover:text-white"
            }`}
          >
            Lifetime
          </button>

          <button
            onClick={() =>
              setActiveRanking("opening-day")
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              activeRanking === "opening-day"
                ? "bg-white text-black"
                : "border border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600 hover:text-white"
            }`}
          >
            Opening Day
          </button>

          <button
            onClick={() =>
              setActiveRanking("opening-weekend")
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              activeRanking === "opening-weekend"
                ? "bg-white text-black"
                : "border border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600 hover:text-white"
            }`}
          >
            Opening Weekend
          </button>

        </div>

      </section>

      {/* ======================================================
          RANKING CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">

        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="h-px w-6 bg-zinc-700" />

              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                Current Ranking
              </p>

            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {getRankingLabel()}
            </h2>

          </div>

          <p className="text-sm text-zinc-600">
            Top 20 • 1950 — 2023
          </p>

        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">

          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <div className="hidden grid-cols-[90px_1fr_220px_100px] border-b border-zinc-900 bg-zinc-950 px-6 py-4 text-xs uppercase tracking-wider text-zinc-600 sm:grid">

            <span>#</span>

            <span>Movie</span>

            <span>
              {getRankingLabel()}
            </span>

            <span>Rank</span>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="space-y-px">

              {[1, 2, 3, 4, 5, 6].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-5 border-b border-zinc-900 px-6 py-6 last:border-b-0"
                >

                  <div className="h-4 w-8 animate-pulse rounded bg-zinc-900" />

                  <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-900" />

                  <div className="ml-auto h-4 w-28 animate-pulse rounded bg-zinc-900" />

                </div>

              ))}

            </div>

          ) : error ? (

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 text-zinc-600">
                !
              </div>

              <p className="text-zinc-300">
                Unable to load rankings.
              </p>

              <p className="mt-2 max-w-sm text-sm text-zinc-600">
                Check that the backend is running and try again.
              </p>

              <button
                onClick={() =>
                  loadRankings(activeRanking)
                }
                className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                Try Again
              </button>

            </div>

          ) : movies.length === 0 ? (

            <div className="px-6 py-16 text-center text-zinc-500">
              No ranking data available.
            </div>

          ) : (

            movies.map((movie, index) => {

              const value = getMovieValue(movie);

              return (

                <div
                  key={movie.movie_id}
                  onClick={() =>
                    router.push(
                      `/movies/${movie.movie_id}`
                    )
                  }
                  className={`group cursor-pointer border-b border-zinc-900 px-5 py-5 transition-all duration-200 last:border-b-0 hover:bg-zinc-900/70 sm:grid sm:grid-cols-[90px_1fr_220px_100px] sm:items-center sm:px-6 ${
                    index === 0
                      ? "bg-zinc-900/30"
                      : ""
                  }`}
                >

                  {/* POSITION */}

                  <div className="mb-3 flex items-center justify-between sm:mb-0">

                    <span
                      className={`text-lg font-medium ${
                        index === 0
                          ? "text-white"
                          : index < 3
                          ? "text-zinc-400"
                          : "text-zinc-600"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-xs text-zinc-700 sm:hidden">
                      #{movie.rank}
                    </span>

                  </div>

                  {/* MOVIE */}

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xs transition ${
                        index === 0
                          ? "border-zinc-600 bg-zinc-800 text-white"
                          : index === 1
                          ? "border-zinc-700 bg-zinc-900 text-zinc-300"
                          : index === 2
                          ? "border-zinc-800 bg-zinc-900 text-zinc-400"
                          : "border-zinc-900 bg-black text-zinc-700"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate font-medium text-zinc-200 transition group-hover:text-white">
                        {movie.movie_name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-600">
                        Indian cinema
                      </p>

                    </div>

                  </div>

                  {/* VALUE */}

                  <div className="mt-4 flex items-center justify-between sm:mt-0 sm:block">

                    <span className="text-xs uppercase tracking-wider text-zinc-700 sm:hidden">
                      {getRankingLabel()}
                    </span>

                    <span className="font-medium">

                      ₹
                      {Number(
                        value || 0
                      ).toLocaleString()}{" "}
                      Cr

                    </span>

                  </div>

                  {/* RANK */}

                  <span className="hidden text-zinc-600 sm:block">
                    #{movie.rank}
                  </span>

                </div>

              );

            })

          )}

        </div>

      </section>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-zinc-900">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">

          <div>

            <p className="text-sm font-medium tracking-wide">
              BOX OFFICE
            </p>

            <p className="mt-1 text-xs text-zinc-700">
              Indian cinema analytics
            </p>

          </div>

          <p className="text-xs text-zinc-700">
            Data through 2023
          </p>

        </div>

      </footer>

    </main>
  );
}