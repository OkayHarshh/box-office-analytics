"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();

  const movieId = params.movie_id;

  const [movie, setMovie] = useState<any>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD MOVIE
  // ============================================================

  useEffect(() => {
    if (!movieId) return;

    async function loadMovie() {
      try {
        const movieResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/movies/${movieId}`
        );

        if (!movieResponse.ok) {
          throw new Error("Movie API failed");
        }

        const movieData = await movieResponse.json();

        setMovie(movieData);

        // ======================================================
        // WIKIPEDIA POSTER
        // ======================================================

        const searchUrl =
          "https://en.wikipedia.org/w/api.php" +
          "?action=query" +
          "&generator=search" +
          `&gsrsearch=${encodeURIComponent(
            movieData.movie_name + " film"
          )}` +
          "&gsrlimit=1" +
          "&format=json" +
          "&origin=*";

        const searchResponse = await fetch(searchUrl);

        if (!searchResponse.ok) {
          return;
        }

        const searchData = await searchResponse.json();

        const pages = searchData?.query?.pages;

        if (!pages) {
          return;
        }

        const firstPage = Object.values(pages)[0] as any;

        const wikipediaTitle = firstPage?.title;

        if (!wikipediaTitle) {
          return;
        }

        const summaryUrl =
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            wikipediaTitle
          )}`;

        const summaryResponse = await fetch(summaryUrl);

        if (!summaryResponse.ok) {
          return;
        }

        const summaryData = await summaryResponse.json();

        const posterUrl =
          summaryData?.thumbnail?.source;

        if (posterUrl) {
          setPoster(posterUrl);
        }

      } catch (error) {
        console.error(
          "Error loading movie:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [movieId]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="cinema-page min-h-screen">

        <Navbar />

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 md:py-24">

          <div className="h-4 w-40 animate-pulse rounded bg-zinc-900" />

          <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr]">

            <div className="h-[420px] animate-pulse rounded-2xl bg-zinc-900" />

            <div className="flex flex-col justify-end">

              <div className="h-20 max-w-2xl animate-pulse rounded bg-zinc-900" />

              <div className="mt-6 h-5 w-48 animate-pulse rounded bg-zinc-900" />

              <div className="mt-12 h-20 w-64 animate-pulse rounded bg-zinc-900" />

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ============================================================
  // MOVIE NOT FOUND
  // ============================================================

  if (!movie) {
    return (
      <main className="cinema-page min-h-screen">

        <Navbar />

        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 sm:px-8">

          <div>

            <button
              onClick={() => router.back()}
              className="mb-8 text-sm text-zinc-500 transition hover:text-white"
            >
              ← Back
            </button>

            <h1 className="text-4xl font-semibold">
              Movie not found
            </h1>

            <p className="mt-3 text-zinc-600">
              This movie could not be found in the box office database.
            </p>

          </div>

        </section>

      </main>
    );
  }

  // ============================================================
  // NUMBERS
  // ============================================================

  const openingDay =
    Number(movie.opening_day_cr) || 0;

  const openingWeekend =
    Number(movie.opening_weekend_cr) || 0;

  const weekOne =
    Number(movie.week_1_cr) || 0;

  const lifetime =
    Number(movie.lifetime_cr) || 0;

  const openingDayWidth =
    lifetime > 0
      ? Math.min(
          (openingDay / lifetime) * 100,
          100
        )
      : 0;

  const openingWeekendWidth =
    lifetime > 0
      ? Math.min(
          (openingWeekend / lifetime) * 100,
          100
        )
      : 0;

  const weekOneWidth =
    lifetime > 0
      ? Math.min(
          (weekOne / lifetime) * 100,
          100
        )
      : 0;

  return (
    <main className="cinema-page min-h-screen overflow-x-hidden">

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="cinema-hero relative border-b border-zinc-900">

        {/* Background */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute right-[-150px] top-[-100px] h-[550px] w-[550px] rounded-full bg-white/[0.025] blur-3xl" />

          <div className="absolute left-[-200px] top-80 h-[400px] w-[400px] rounded-full bg-zinc-500/[0.02] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 md:py-16">

          {/* BACK */}

          <button
            onClick={() => router.back()}
            className="mb-12 flex items-center gap-2 text-sm text-zinc-600 transition hover:text-white"
          >
            <span>←</span>
            Back
          </button>

          {/* EYEBROW */}

          <div className="mb-8 flex items-center gap-3">

            <span className="h-px w-8 bg-zinc-600" />

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Movie Performance
            </p>

          </div>

          {/* MOVIE */}

          <div className="grid gap-10 md:grid-cols-[280px_1fr] md:gap-14">

            {/* POSTER */}

            <div className="relative">

              {poster ? (

                <img
                  src={poster}
                  alt={`${movie.movie_name} poster`}
                  className="h-[420px] w-full rounded-2xl border border-zinc-800 object-cover shadow-2xl shadow-black transition duration-500 hover:scale-[1.01]"
                />

              ) : (

                <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950">

                  <div className="text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 text-zinc-700">
                      ?
                    </div>

                    <p className="mt-4 text-xs text-zinc-700">
                      Poster unavailable
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* INFO */}

            <div className="flex flex-col justify-end">

              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">

                {movie.movie_name}

              </h1>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-zinc-500">

                <span>
                  Released {movie.release_date || "Unknown"}
                </span>

                <span className="text-zinc-800">
                  •
                </span>

                <span>
                  Indian cinema
                </span>

              </div>

              {/* LIFETIME */}

              <div className="mt-12">

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                  Lifetime Collection
                </p>

                <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">

                  ₹
                  {lifetime
                    ? lifetime.toLocaleString()
                    : "—"}

                  <span className="ml-2 text-xl font-normal text-zinc-500">
                    Cr
                  </span>

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          STATS
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-10 sm:px-8">

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 sm:grid-cols-2 lg:grid-cols-4">

          {/* OPENING DAY */}

          <div className="border-b border-zinc-900 p-7 transition hover:bg-zinc-900/50 sm:border-r lg:border-b-0">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Opening Day
            </p>

            <p className="mt-4 text-3xl font-semibold">
              ₹
              {openingDay
                ? openingDay.toLocaleString()
                : "—"}

              <span className="ml-1 text-sm font-normal text-zinc-600">
                Cr
              </span>
            </p>

          </div>

          {/* OPENING WEEKEND */}

          <div className="border-b border-zinc-900 p-7 transition hover:bg-zinc-900/50 lg:border-b-0 lg:border-r">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Opening Weekend
            </p>

            <p className="mt-4 text-3xl font-semibold">
              ₹
              {openingWeekend
                ? openingWeekend.toLocaleString()
                : "—"}

              <span className="ml-1 text-sm font-normal text-zinc-600">
                Cr
              </span>
            </p>

          </div>

          {/* WEEK 1 */}

          <div className="border-b border-zinc-900 p-7 transition hover:bg-zinc-900/50 sm:border-r lg:border-b-0">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Week 1
            </p>

            <p className="mt-4 text-3xl font-semibold">
              ₹
              {weekOne
                ? weekOne.toLocaleString()
                : "—"}

              <span className="ml-1 text-sm font-normal text-zinc-600">
                Cr
              </span>
            </p>

          </div>

          {/* LIFETIME */}

          <div className="p-7 transition hover:bg-zinc-900/50">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Lifetime
            </p>

            <p className="mt-4 text-3xl font-semibold">
              ₹
              {lifetime
                ? lifetime.toLocaleString()
                : "—"}

              <span className="ml-1 text-sm font-normal text-zinc-600">
                Cr
              </span>
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          PERFORMANCE
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">

        <div className="mb-10">

          <div className="flex items-center gap-3">

            <span className="h-px w-6 bg-zinc-700" />

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
              Performance
            </p>

          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Box Office Journey
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            Early theatrical performance compared with
            the movie's final lifetime collection.
          </p>

        </div>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-6 sm:p-8">

          <div className="space-y-9">

            {/* OPENING DAY */}

            <div>

              <div className="mb-3 flex items-center justify-between gap-5">

                <div>

                  <p className="text-sm font-medium">
                    Opening Day
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    First day collection
                  </p>

                </div>

                <p className="shrink-0 text-sm text-zinc-400">
                  ₹
                  {openingDay
                    ? openingDay.toLocaleString()
                    : "—"}{" "}
                  Cr
                </p>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${openingDayWidth}%`,
                  }}
                />

              </div>

            </div>

            {/* OPENING WEEKEND */}

            <div>

              <div className="mb-3 flex items-center justify-between gap-5">

                <div>

                  <p className="text-sm font-medium">
                    Opening Weekend
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    First weekend collection
                  </p>

                </div>

                <p className="shrink-0 text-sm text-zinc-400">
                  ₹
                  {openingWeekend
                    ? openingWeekend.toLocaleString()
                    : "—"}{" "}
                  Cr
                </p>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${openingWeekendWidth}%`,
                  }}
                />

              </div>

            </div>

            {/* WEEK 1 */}

            <div>

              <div className="mb-3 flex items-center justify-between gap-5">

                <div>

                  <p className="text-sm font-medium">
                    Week 1
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    First week collection
                  </p>

                </div>

                <p className="shrink-0 text-sm text-zinc-400">
                  ₹
                  {weekOne
                    ? weekOne.toLocaleString()
                    : "—"}{" "}
                  Cr
                </p>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{
                    width: `${weekOneWidth}%`,
                  }}
                />

              </div>

            </div>

            {/* LIFETIME */}

            <div>

              <div className="mb-3 flex items-center justify-between gap-5">

                <div>

                  <p className="text-sm font-medium">
                    Lifetime
                  </p>

                  <p className="mt-1 text-xs text-zinc-700">
                    Final reported collection
                  </p>

                </div>

                <p className="shrink-0 text-sm text-zinc-400">
                  ₹
                  {lifetime
                    ? lifetime.toLocaleString()
                    : "—"}{" "}
                  Cr
                </p>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">

                <div className="h-full w-full rounded-full bg-white" />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-7 sm:p-9">

          <div className="grid gap-8 md:grid-cols-3">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Release
              </p>

              <p className="mt-3 text-lg font-medium">
                {movie.release_date || "Unknown"}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Lifetime Multiple
              </p>

              <p className="mt-3 text-lg font-medium">

                {openingDay > 0
                  ? `${(lifetime / openingDay).toFixed(1)}×`
                  : "—"}

              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Lifetime vs opening day
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                Database
              </p>

              <p className="mt-3 text-lg font-medium">
                Box Office
              </p>

              <p className="mt-1 text-xs text-zinc-700">
                Data through 2023
              </p>

            </div>

          </div>

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
