
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

  useEffect(() => {
    loadYears();
  }, []);

  function loadYears() {
    setLoading(true);
    setError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/years`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch yearly data");
        return response.json();
      })
      .then((data) => setYears(data))
      .catch((err) => {
        console.error("Error fetching yearly data:", err);
        setYears([]);
        setError(true);
      })
      .finally(() => setLoading(false));
  }

  const sortedYears = useMemo(
    () => [...years].sort((a, b) => Number(a.year) - Number(b.year)),
    [years]
  );

  const totalMovies = useMemo(
    () =>
      years.reduce(
        (sum, year) => sum + Number(year.movie_count || 0),
        0
      ),
    [years]
  );

  const totalLifetime = useMemo(
    () =>
      years.reduce(
        (sum, year) => sum + Number(year.total_lifetime_cr || 0),
        0
      ),
    [years]
  );

  const biggestYear = useMemo(() => {
    if (!years.length) return null;

    return years.reduce((max, year) =>
      Number(year.movie_count || 0) > Number(max.movie_count || 0)
        ? year
        : max
    );
  }, [years]);

  const highestCollectionYear = useMemo(() => {
    if (!years.length) return null;

    return years.reduce((max, year) =>
      Number(year.highest_lifetime_cr || 0) >
      Number(max.highest_lifetime_cr || 0)
        ? year
        : max
    );
  }, [years]);

  if (loading) {
    return (
      <main className="cinema-page years-page min-h-screen">
        <Navbar />
        <section className="years-loading-screen">
          <div className="years-projector-light" />
          <div className="years-loading-reel">▶</div>
          <p>PREPARING THE ARCHIVES</p>
          <span>PLEASE TAKE YOUR SEAT</span>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="cinema-page years-page min-h-screen">
        <Navbar />
        <section className="years-error-screen">
          <span>THE ARCHIVE IS TEMPORARILY CLOSED</span>
          <h1>We lost the projection.</h1>
          <p>Unable to load yearly analytics. Please check the backend and try again.</p>
          <button onClick={loadYears}>RESTART SCREENING ↻</button>
        </section>
      </main>
    );
  }

  return (
    <main className="cinema-page years-page min-h-screen overflow-x-hidden">
      <Navbar />

      {/* HERO — CINEMA TIME MACHINE */}
      <section className="time-machine-hero">
        <div className="time-machine-grain" />
        <div className="time-machine-curtain time-machine-curtain-left" />
        <div className="time-machine-curtain time-machine-curtain-right" />

        <div className="time-machine-inner">
          <div className="time-machine-copy">
            <div className="years-eyebrow">
              <span />
              THE INDIAN CINEMA ARCHIVE
            </div>

            <p className="years-archive-number">ARCHIVE COLLECTION · 1950—2023</p>

            <h1>
              A journey
              <br />
              through
              <br />
              <em>the years.</em>
            </h1>

            <p className="years-hero-description">
              Every era had its stars. Every decade had its blockbusters.
              Travel through the numbers behind Indian cinema's theatrical history.
            </p>

            <div className="years-hero-stamp">
              <span>74</span>
              <div>
                <strong>YEARS OF CINEMA</strong>
                <small>ONE CONTINUOUS STORY</small>
              </div>
            </div>
          </div>

          <div className="film-reel-display">
            <div className="film-reel-top">
              <span>THE PASSAGE OF TIME</span>
              <span>FRAME NO. 1950—2023</span>
            </div>

            <div className="film-strip">
              <div className="film-holes">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>

              <div className="film-frame film-frame-old">
                <span>THE BEGINNING</span>
                <strong>1950</strong>
                <small>THE FIRST CHAPTER</small>
              </div>

              <div className="film-frame film-frame-middle">
                <span>THE EVOLUTION</span>
                <strong>1990</strong>
                <small>A NEW CHAPTER</small>
              </div>

              <div className="film-frame film-frame-new">
                <span>THE BIG SCREEN</span>
                <strong>2023</strong>
                <small>THE LATEST CHAPTER</small>
              </div>

              <div className="film-holes">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} />
                ))}
              </div>
            </div>

            <div className="film-reel-bottom">
              <span>ROLLING THROUGH HISTORY</span>
              <span>◉ ◉ ◉</span>
            </div>
          </div>
        </div>

        <div className="years-era-line">
          <span>1950 · THE FIRST FRAME</span>
          <span>1970 · ANOTHER ERA</span>
          <span>1990 · THE NEW WAVE</span>
          <span>2010 · THE BIG SCREEN</span>
          <span>2023 · THE ARCHIVE</span>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="years-stat-section">
        <div className="years-section-intro">
          <span>THE ARCHIVE AT A GLANCE</span>
          <h2>Numbers behind the nostalgia.</h2>
        </div>

        <div className="years-stat-grid">
          <div className="years-stat-card">
            <span className="years-stat-index">01 / THE TIMELINE</span>
            <small>YEARS COVERED</small>
            <strong>{years.length}</strong>
            <p>1950 — 2023</p>
            <div className="stat-decoration">◉</div>
          </div>

          <div className="years-stat-card years-stat-featured">
            <span className="years-stat-index">02 / THE COLLECTION</span>
            <small>MOVIES IN THE ARCHIVE</small>
            <strong>{totalMovies.toLocaleString()}</strong>
            <p>Across all recorded years</p>
            <div className="stat-decoration">✳</div>
          </div>

          <div className="years-stat-card">
            <span className="years-stat-index">03 / THE BUSIEST YEAR</span>
            <small>MOST ACTIVE YEAR</small>
            <strong>{biggestYear?.year ?? "—"}</strong>
            <p>
              {Number(biggestYear?.movie_count || 0).toLocaleString()} movies released
            </p>
            <div className="stat-decoration">✦</div>
          </div>
        </div>
      </section>

      {/* COLLECTION CHART */}
      <section className="years-data-section">
        <div className="years-data-heading">
          <div>
            <span className="years-section-kicker">THE BOX OFFICE JOURNEY · 01</span>
            <h2>The rise of the collection.</h2>
            <p>Combined lifetime box office collection by release year.</p>
          </div>

          <div className="years-total-display">
            <small>ARCHIVE TOTAL</small>
            <strong>₹{totalLifetime.toLocaleString("en-IN")} Cr</strong>
          </div>
        </div>

        <div className="years-chart-frame">
          <div className="chart-frame-top">
            <span>COLLECTION TIMELINE</span>
            <span>UNIT · ₹ CRORES</span>
          </div>

          <div className="years-chart years-chart-gold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sortedYears}
                margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="#453128"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="#9a8061"
                  tick={{ fill: "#b39a79", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis
                  stroke="#9a8061"
                  tick={{ fill: "#b39a79", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#251413",
                    border: "1px solid #99764b",
                    borderRadius: "4px",
                    color: "#f2e6d1",
                  }}
                  formatter={(value: any) => [
                    `₹${Number(value || 0).toLocaleString("en-IN")} Cr`,
                    "Collection",
                  ]}
                  labelStyle={{ color: "#d7b477", marginBottom: "5px" }}
                />
                <Line
                  type="monotone"
                  dataKey="total_lifetime_cr"
                  stroke="#d7b477"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: "#a42f3b",
                    stroke: "#f1d39d",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-frame-bottom">
            <span>1950</span>
            <span>THE COLLECTION CHRONICLES</span>
            <span>2023</span>
          </div>
        </div>
      </section>

      {/* MOVIE PRODUCTION CHART */}
      <section className="years-data-section years-production-section">
        <div className="years-data-heading">
          <div>
            <span className="years-section-kicker">THE CINEMA INDUSTRY · 02</span>
            <h2>Years of production.</h2>
            <p>Number of movies represented in the dataset for each year.</p>
          </div>
          <div className="years-total-display">
            <small>MOVIES TRACKED</small>
            <strong>{totalMovies.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="years-chart-frame">
          <div className="chart-frame-top">
            <span>ANNUAL FILM COUNT</span>
            <span>UNIT · NUMBER OF MOVIES</span>
          </div>

          <div className="years-chart years-chart-red">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedYears}
                margin={{ top: 15, right: 15, left: 5, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  stroke="#453128"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  stroke="#9a8061"
                  tick={{ fill: "#b39a79", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={28}
                />
                <YAxis
                  stroke="#9a8061"
                  tick={{ fill: "#b39a79", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#251413",
                    border: "1px solid #99764b",
                    borderRadius: "4px",
                    color: "#f2e6d1",
                  }}
                  formatter={(value: any) => [
                    Number(value || 0).toLocaleString("en-IN"),
                    "Movies",
                  ]}
                  labelStyle={{ color: "#d7b477", marginBottom: "5px" }}
                />
                <Bar
                  dataKey="movie_count"
                  fill="#9d3941"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={17}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-frame-bottom">
            <span>1950</span>
            <span>THE PRODUCTION CHRONICLES</span>
            <span>2023</span>
          </div>
        </div>
      </section>

      {/* SPECIAL ARCHIVE FEATURE */}
      {highestCollectionYear && (
        <section className="years-feature-section">
          <div className="years-feature-card">
            <div className="years-feature-copy">
              <span>THE ARCHIVE SPOTLIGHT</span>
              <h2>A year to remember.</h2>
              <p>
                The highest individual lifetime collection recorded for a
                movie released in this year.
              </p>
            </div>

            <div className="years-feature-result">
              <small>FEATURED YEAR</small>
              <strong>{highestCollectionYear.year}</strong>
              <span>
                ₹
                {Number(
                  highestCollectionYear.highest_lifetime_cr || 0
                ).toLocaleString("en-IN")}{" "}
                Cr
              </span>
              <small>HIGHEST INDIVIDUAL LIFETIME COLLECTION</small>
            </div>
          </div>
        </section>
      )}

      {/* YEARLY ARCHIVE */}
      <section className="years-archive-section">
        <div className="years-data-heading">
          <div>
            <span className="years-section-kicker">THE COMPLETE RECORD · 03</span>
            <h2>The yearly ledger.</h2>
            <p>Browse the complete yearly box office record.</p>
          </div>
          <span className="years-record-count">
            {years.length} RECORDS
          </span>
        </div>

        <div className="years-ledger">
          <div className="years-ledger-header">
            <span>YEAR</span>
            <span>MOVIES</span>
            <span>TOTAL COLLECTION</span>
            <span>AVERAGE COLLECTION</span>
          </div>

          {sortedYears.map((year, index) => (
            <div className="years-ledger-row" key={year.year}>
              <span className="ledger-year">
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{year.year}</strong>
              </span>

              <span className="ledger-number">
                {Number(year.movie_count || 0).toLocaleString("en-IN")}
              </span>

              <span className="ledger-collection">
                ₹{Number(year.total_lifetime_cr || 0).toLocaleString("en-IN")} Cr
              </span>

              <span className="ledger-average">
                ₹{Number(year.avg_lifetime_cr || 0).toLocaleString("en-IN")} Cr
              </span>
            </div>
          ))}
        </div>

        <div className="years-ledger-footer">
          <span>BOX OFFICE ARCHIVES</span>
          <span>FIGURES IN ₹ CRORES</span>
          <span>1950 — 2023</span>
        </div>
      </section>

      <footer className="years-footer">
        <div>
          <strong>BOX OFFICE</strong>
          <span>THE CINEMA LEDGER</span>
        </div>
        <p>EVERY ERA LEAVES A MARK ON THE BIG SCREEN.</p>
        <span>END OF ARCHIVE · 2023</span>
      </footer>
    </main>
  );
}
