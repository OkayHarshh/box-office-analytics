"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(false);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const router = useRouter();

  // ============================================================
  // GET TOP LIFETIME MOVIES
  // ============================================================

  useEffect(() => {
    loadTopMovies();
  }, []);

  function loadTopMovies() {
    setMoviesLoading(true);
    setMoviesError(false);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/movies/top-lifetime`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        return response.json();
      })
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setMoviesError(true);
        setMovies([]);
      })
      .finally(() => {
        setMoviesLoading(false);
      });
  }

  // ============================================================
  // SEARCH MOVIES WITH DEBOUNCE
  // ============================================================

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (trimmedSearch === "") {
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
          if (!response.ok) {
            throw new Error("Search request failed");
          }

          return response.json();
        })
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          console.error("Error searching movies:", error);
          setSearchResults([]);
          setSearchError(true);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ============================================================
  // TOTAL COLLECTION OF DISPLAYED MOVIES
  // ============================================================

  const visibleCollection = movies.reduce(
    (sum, movie) => sum + Number(movie.lifetime_cr || 0),
    0
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative border-b border-zinc-900">

        {/* Background glow */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-white/[0.025] blur-3xl" />

          <div className="absolute right-[-120px] top-[-100px] h-[500px] w-[500px] rounded-full bg-zinc-500/[0.035] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-32">

          {/* Eyebrow */}

          <div className="mb-7 flex items-center gap-3">

            <span className="h-px w-8 bg-zinc-600" />

            <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
              Indian Box Office Analytics
            </p>

          </div>

          {/* Heading */}

          <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">

            The numbers
            <br />

            <span className="text-zinc-500">
              behind Indian cinema.
            </span>

          </h1>

          <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">

            <p className="max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
              Explore lifetime collections, rankings and
              box office trends across Indian cinema from
              1950 to 2023.
            </p>

            {/* Small stat */}

            <div className="hidden border-l border-zinc-800 pl-6 md:block">

              <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                Coverage
              </p>

              <p className="mt-2 text-2xl font-medium">
                1950 — 2023
              </p>

            </div>

          </div>

          {/* ==================================================
              SEARCH
          ================================================== */}

          <div className="relative mt-12 max-w-2xl">

            <div
              className={`group flex items-center rounded-2xl border bg-zinc-950/80 px-5 py-4 shadow-2xl shadow-black transition-all duration-300 ${
                search.trim() !== ""
                  ? "border-zinc-500"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >

              {/* Search icon */}

              <svg
                className="mr-4 h-5 w-5 shrink-0 text-zinc-500 transition-colors group-focus-within:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path
                  d="m20 20-4-4"
                  strokeLinecap="round"
                />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-base text-white outline-none placeholder:text-zinc-600"
                placeholder="Search for a movie..."
              />

              {searchLoading && (
                <div className="ml-4 flex items-center gap-2 text-xs text-zinc-500">

                  <span className="h-3 w-3 animate-spin rounded-full border border-zinc-700 border-t-white" />

                  Searching

                </div>
              )}

            </div>

            {/* ==================================================
                SEARCH RESULTS
            ================================================== */}

            {search.trim() !== "" && (

              <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black">

                {searchLoading ? (

                  <div className="px-5 py-6 text-sm text-zinc-500">
                    Searching movies...
                  </div>

                ) : searchError ? (

                  <div className="px-5 py-6 text-sm text-red-400">
                    Unable to search movies. Please try again.
                  </div>

                ) : searchResults.length > 0 ? (

                  searchResults.map((movie, index) => (

                    <div
                      key={movie.movie_id}
                      onClick={() => {
                        router.push(
                          `/movies/${movie.movie_id}`
                        );

                        setSearch("");
                        setSearchResults([]);
                      }}
                      className="group cursor-pointer border-b border-zinc-900 px-5 py-4 transition last:border-b-0 hover:bg-zinc-900"
                    >

                      <div className="flex items-center justify-between gap-5">

                        <div className="flex min-w-0 items-center gap-4">

                          <span className="text-xs text-zinc-700">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="min-w-0">

                            <p className="truncate font-medium text-zinc-200 group-hover:text-white">
                              {movie.movie_name}
                            </p>

                            <p className="mt-1 text-xs text-zinc-600">
                              {movie.release_date || "Release date unavailable"}
                            </p>

                          </div>

                        </div>

                        <p className="shrink-0 text-sm text-zinc-400">
                          ₹
                          {Number(
                            movie.lifetime_cr || 0
                          ).toLocaleString()}{" "}
                          Cr
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <div className="px-5 py-6 text-sm text-zinc-500">
                    No movies found for "{search.trim()}"
                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </section>

      {/* ======================================================
          QUICK STATS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-12 sm:px-8">

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 sm:grid-cols-3">

          <div className="border-b border-zinc-900 p-6 sm:border-b-0 sm:border-r">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Ranking
            </p>

            <p className="mt-3 text-3xl font-semibold">
              Top 20
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Lifetime grossers
            </p>

          </div>

          <div className="border-b border-zinc-900 p-6 sm:border-b-0 sm:border-r">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Collection
            </p>

            <p className="mt-3 text-3xl font-semibold">
              ₹
              {visibleCollection.toLocaleString()}
              <span className="ml-1 text-lg text-zinc-500">
                Cr
              </span>
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              Top 20 combined
            </p>

          </div>

          <div className="p-6">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Data
            </p>

            <p className="mt-3 text-3xl font-semibold">
              74 Years
            </p>

            <p className="mt-1 text-sm text-zinc-600">
              1950 — 2023
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          TOP MOVIES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="h-px w-6 bg-zinc-700" />

              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                The Numbers
              </p>

            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Top Lifetime Grossers
            </h2>

          </div>

          <button
            onClick={() => router.push("/rankings")}
            className="w-fit text-sm text-zinc-500 transition hover:text-white"
          >
            View full rankings
            <span className="ml-2">→</span>
          </button>

        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[80px_1fr_180px_100px] border-b border-zinc-900 bg-zinc-950 px-6 py-4 text-xs uppercase tracking-wider text-zinc-600 sm:grid">

            <span>Rank</span>

            <span>Movie</span>

            <span>Lifetime</span>

            <span>Position</span>

          </div>

          {/* LOADING */}

          {moviesLoading ? (

            <div className="space-y-px">

              {[1, 2, 3, 4, 5].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-5 border-b border-zinc-900 px-6 py-6 last:border-b-0"
                >

                  <div className="h-4 w-8 animate-pulse rounded bg-zinc-900" />

                  <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-900" />

                  <div className="ml-auto h-4 w-24 animate-pulse rounded bg-zinc-900" />

                </div>

              ))}

            </div>

          ) : moviesError ? (

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 text-zinc-600">
                !
              </div>

              <p className="text-zinc-300">
                Unable to load box office data.
              </p>

              <p className="mt-2 max-w-sm text-sm text-zinc-600">
                Check that the backend is running and try again.
              </p>

              <button
                onClick={loadTopMovies}
                className="mt-6 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
              >
                Try Again
              </button>

            </div>

          ) : movies.length === 0 ? (

            <div className="px-6 py-16 text-center text-zinc-500">
              No box office data available.
            </div>

          ) : (

            movies.map((movie, index) => (

              <div
                key={movie.movie_id}
                onClick={() =>
                  router.push(
                    `/movies/${movie.movie_id}`
                  )
                }
                className={`group cursor-pointer border-b border-zinc-900 px-5 py-5 transition-all duration-200 last:border-b-0 hover:bg-zinc-900/70 sm:grid sm:grid-cols-[80px_1fr_180px_100px] sm:items-center sm:px-6 ${
                  index === 0
                    ? "bg-zinc-900/30"
                    : ""
                }`}
              >

                {/* RANK */}

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
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-xs ${
                      index === 0
                        ? "border-zinc-600 bg-zinc-800 text-white"
                        : "border-zinc-800 bg-zinc-900 text-zinc-600"
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

                {/* LIFETIME */}

                <div className="mt-4 flex items-center justify-between sm:mt-0 sm:block">

                  <span className="text-xs uppercase tracking-wider text-zinc-700 sm:hidden">
                    Lifetime
                  </span>

                  <span className="font-medium">
                    ₹
                    {Number(
                      movie.lifetime_cr || 0
                    ).toLocaleString()}{" "}
                    Cr
                  </span>

                </div>

                {/* POSITION */}

                <span className="hidden text-zinc-600 sm:block">
                  #{movie.rank}
                </span>

              </div>

            ))

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