"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function YearsPage() {
  const [years, setYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ============================================================
  // LOAD YEARLY DATA
  // ============================================================

  useEffect(() => {
    loadYears();
  }, []);

  function loadYears() {
    setLoading(true);
    setError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/years`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch yearly data");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Yearly data:", data);
        setYears(data);
      })
      .catch((error) => {
        console.error("Error fetching yearly data:", error);
        setYears([]);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // ============================================================
  // SUMMARY DATA
  // ============================================================

  const totalMovies = useMemo(() => {
    return years.reduce(
      (sum, year) => sum + Number(year.movie_count || 0),
      0
    );
  }, [years]);

  const totalLifetime = useMemo(() => {
    return years.reduce(
      (sum, year) =>
        sum + Number(year.total_lifetime_cr || 0),
      0
    );
  }, [years]);

  const biggestYear = useMemo(() => {
    if (years.length === 0) {
      return null;
    }

    return years.reduce((max, year) =>
      Number(year.movie_count || 0) >
      Number(max.movie_count || 0)
        ? year
        : max
    );
  }, [years]);

  const highestCollectionYear = useMemo(() => {
    if (years.length === 0) {
      return null;
    }

    return years.reduce((max, year) =>
      Number(year.highest_lifetime_cr || 0) >
      Number(max.highest_lifetime_cr || 0)
        ? year
        : max
    );
  }, [years]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="cinema-page years-page min-h-screen">
        <Navbar />

        <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8">

          <div className="h-4 w-48 animate-pulse rounded bg-zinc-900" />

          <div className="mt-6 h-20 max-w-2xl animate-pulse rounded bg-zinc-900" />

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950"
              />
            ))}

          </div>

          <div className="mt-12 h-[450px] animate-pulse rounded-2xl border border-zinc-900 bg-zinc-950" />

        </section>
      </main>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <main className="cinema-page years-page min-h-screen">
        <Navbar />

        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6 sm:px-8">

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 text-zinc-600">
              !
            </div>

            <h1 className="mt-6 text-2xl font-semibold">
              Unable to load yearly analytics.
            </h1>

            <p className="mt-3 text-sm text-zinc-600">
              Check that the backend is running and try again.
            </p>

            <button
              onClick={loadYears}
              className="mt-7 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white"
            >
              Try Again
            </button>

          </div>

        </section>
      </main>
    );
  }

  return (
    <main className="cinema-page years-page min-h-screen overflow-x-hidden">

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="cinema-hero relative border-b border-zinc-900">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute right-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-3xl" />

          <div className="absolute left-[-180px] top-48 h-[400px] w-[400px] rounded-full bg-zinc-500/[0.02] blur-3xl" />

        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-32">

          <div className="mb-7 flex items-center gap-3">

            <span className="h-px w-8 bg-zinc-600" />

            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Indian Box Office Analytics
            </p>

          </div>

          <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-7xl">

            Box Office
            <br />

            <span className="text-zinc-500">
              Through The Years.
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
            Explore how Indian cinema and box office
            performance evolved from 1950 through 2023.
          </p>

          <div className="years-reel" aria-label="Timeline of Indian cinema from 1950 to 2023">
            <div className="years-reel-heading">
              <span>THE CINEMA TIMELINE</span>
              <strong>74 years on the big screen</strong>
            </div>

            <div className="years-timeline">
              <div className="timeline-line" />
              {[
                { year: "1950", label: "THE FIRST FRAME" },
                { year: "1970", label: "GOLDEN AGE" },
                { year: "1990", label: "NEW WAVE" },
                { year: "2010", label: "BIG SCREEN ERA" },
                { year: "2023", label: "THE LATEST CHAPTER" },
              ].map((milestone, index) => (
                <div className="timeline-milestone" key={milestone.year}>
                  <span className={`timeline-marker ${index === 0 || index === 4 ? "timeline-marker-edge" : ""}`} />
                  <strong>{milestone.year}</strong>
                  <small>{milestone.label}</small>
                </div>
              ))}
            </div>

            <div className="years-reel-foot">
              <span>FROM BLACK-AND-WHITE CLASSICS</span>
              <span>TO MODERN BLOCKBUSTERS</span>
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pt-12 sm:px-8">

        <div className="years-summary grid grid-cols-1 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950 md:grid-cols-3">

          {/* YEARS */}

          <div className="border-b border-zinc-900 p-7 md:border-b-0 md:border-r">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Years Covered
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {years.length}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              1950 — 2023
            </p>

          </div>

          {/* MOVIES */}

          <div className="border-b border-zinc-900 p-7 md:border-b-0 md:border-r">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Movies
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {totalMovies.toLocaleString()}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              Across all years
            </p>

          </div>

          {/* MOST ACTIVE */}

          <div className="p-7">

            <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
              Most Active Year
            </p>

            <p className="mt-4 text-4xl font-semibold tracking-tight">
              {biggestYear?.year ?? "—"}
            </p>

            <p className="mt-2 text-sm text-zinc-600">
              {Number(
                biggestYear?.movie_count || 0
              ).toLocaleString()}{" "}
              movies released
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          COLLECTION TREND
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="h-px w-6 bg-zinc-700" />

              <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                Collection Trend
              </p>

            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Total Lifetime Collection
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Combined lifetime box office collection by release year
            </p>

          </div>

          <div className="text-left sm:text-right">

            <p className="text-xs uppercase tracking-wider text-zinc-700">
              All Years
            </p>

            <p className="mt-1 text-lg font-medium">
              ₹{totalLifetime.toLocaleString()} Cr
            </p>

          </div>

        </div>

        <div className="years-chart rounded-2xl border border-zinc-900 bg-zinc-950 p-4 sm:p-6">

          <div className="h-[380px] w-full sm:h-[450px]">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart
                data={years}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2d2e34"
                />

                <XAxis
                  dataKey="year"
                  stroke="#85847f"
                  tick={{
                    fill: "#85847f",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#85847f"
                  tick={{
                    fill: "#85847f",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#191a1f",
                    border: "1px solid #2d2e34",
                    borderRadius: "12px",
                    color: "#f2eee5",
                  }}
                  labelStyle={{
                    color: "#aaa397",
                    marginBottom: "5px",
                  }}
                  formatter={(value: any) => [
                    `₹${Number(value || 0).toLocaleString()} Cr`,
                    "Collection",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="total_lifetime_cr"
                  stroke="#c6a66a"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </section>

      {/* ======================================================
          MOVIES BY YEAR
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <span className="h-px w-6 bg-zinc-700" />

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
              Production
            </p>

          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Movies Released by Year
          </h2>

          <p className="mt-2 text-sm text-zinc-600">
            Number of movies represented in the dataset for each year
          </p>

        </div>

        <div className="years-chart rounded-2xl border border-zinc-900 bg-zinc-950 p-4 sm:p-6">

          <div className="h-[380px] w-full sm:h-[450px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={years}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2d2e34"
                />

                <XAxis
                  dataKey="year"
                  stroke="#85847f"
                  tick={{
                    fill: "#85847f",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#85847f"
                  tick={{
                    fill: "#85847f",
                    fontSize: 11,
                  }}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#191a1f",
                    border: "1px solid #2d2e34",
                    borderRadius: "12px",
                    color: "#f2eee5",
                  }}
                  labelStyle={{
                    color: "#aaa397",
                    marginBottom: "5px",
                  }}
                  formatter={(value: any) => [
                    Number(value || 0).toLocaleString(),
                    "Movies",
                  ]}
                />

                <Bar
                  dataKey="movie_count"
                  fill="#c6a66a"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={18}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </section>

      {/* ======================================================
          HIGHLIGHT
      ====================================================== */}

      {highestCollectionYear && (

        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-7 md:p-9">

            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">

              <div>

                <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
                  Highest Individual Lifetime Collection
                </p>

                <h2 className="mt-3 text-3xl font-semibold">
                  {highestCollectionYear.year}
                </h2>

                <p className="mt-2 text-sm text-zinc-600">
                  Highest-grossing movie of that release year
                </p>

              </div>

              <div className="md:text-right">

                <p className="text-4xl font-semibold tracking-tight">
                  ₹
                  {Number(
                    highestCollectionYear.highest_lifetime_cr || 0
                  ).toLocaleString()}
                  <span className="ml-2 text-lg text-zinc-500">
                    Cr
                  </span>
                </p>

              </div>

            </div>

          </div>

        </section>

      )}

      {/* ======================================================
          YEARLY TABLE
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <span className="h-px w-6 bg-zinc-700" />

            <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
              Raw Data
            </p>

          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Yearly Breakdown
          </h2>

        </div>

        <div className="years-table overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[120px_1fr_1fr_1fr] border-b border-zinc-900 bg-zinc-950 px-6 py-4 text-xs uppercase tracking-wider text-zinc-600 sm:grid">

            <span>Year</span>

            <span>Movies</span>

            <span>Total Lifetime</span>

            <span>Average Lifetime</span>

          </div>

          {/* TABLE ROWS */}

          {years.map((year) => (

            <div
              key={year.year}
              className="grid grid-cols-2 gap-y-5 border-b border-zinc-900 px-5 py-5 transition last:border-b-0 hover:bg-zinc-900/50 sm:grid-cols-[120px_1fr_1fr_1fr] sm:items-center sm:gap-0 sm:px-6"
            >

              {/* YEAR */}

              <div>

                <p className="text-lg font-medium">
                  {year.year}
                </p>

                <p className="mt-1 text-xs text-zinc-700 sm:hidden">
                  Year
                </p>

              </div>

              {/* MOVIES */}

              <div className="text-right sm:text-left">

                <p className="text-zinc-400">
                  {Number(
                    year.movie_count || 0
                  ).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-zinc-700 sm:hidden">
                  Movies
                </p>

              </div>

              {/* TOTAL */}

              <div>

                <p>
                  ₹
                  {Number(
                    year.total_lifetime_cr || 0
                  ).toLocaleString()}{" "}
                  Cr
                </p>

                <p className="mt-1 text-xs text-zinc-700 sm:hidden">
                  Total Lifetime
                </p>

              </div>

              {/* AVERAGE */}

              <div className="text-right sm:text-left">

                <p className="text-zinc-400">
                  ₹
                  {Number(
                    year.avg_lifetime_cr || 0
                  ).toLocaleString()}{" "}
                  Cr
                </p>

                <p className="mt-1 text-xs text-zinc-700 sm:hidden">
                  Average Lifetime
                </p>

              </div>

            </div>

          ))}

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
