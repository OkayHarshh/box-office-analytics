Got you. No emojis. Paste this entire block into `README.md` in Notepad.

````markdown
# Box Office Analytics

A full-stack Indian cinema box office analytics platform built to explore movie performance, lifetime collections, rankings, and yearly box office trends.

The project combines a Databricks data platform, FastAPI backend, and Next.js analytics frontend into an end-to-end application.

## Live Project

Frontend:
PASTE_YOUR_VERCEL_URL_HERE

Backend API:
https://box-office-analytics.onrender.com

## Overview

Box Office Analytics provides an interactive way to explore Indian movie box office data from 1950 to 2023.

Users can:

- Search for movies
- View individual movie performance
- Compare opening-day collections
- Compare opening-weekend collections
- Explore lifetime gross rankings
- Analyze yearly box office trends
- View yearly movie production statistics
- Explore collection trends through interactive charts

## Architecture

```text
                         GitHub
                            |
              +-------------+-------------+
              |                           |
              v                           v
           Vercel                      Render
       Next.js Frontend             FastAPI Backend
              |                           |
              |       HTTP API            |
              +-------------------------->|
                                          |
                                          | SQL
                                          v
                                    Databricks
                                   SQL Warehouse
````

## Tech Stack

### Data Engineering

* Databricks
* Databricks SQL Warehouse
* SQL
* Medallion Architecture
* Bronze Layer
* Silver Layer
* Gold Layer

### Backend

* Python
* FastAPI
* Databricks SQL Connector
* Uvicorn

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts

### Deployment

* GitHub
* Vercel
* Render
* Databricks

## Features

### Home

The homepage provides:

* Movie search
* Top lifetime grossers
* Lifetime collection rankings
* Direct navigation to movie details

### Rankings

The rankings dashboard provides:

* Lifetime rankings
* Opening Day rankings
* Opening Weekend rankings

Each ranking is retrieved through the FastAPI backend and connected to the Databricks data layer.

### Yearly Analytics

The yearly analytics dashboard provides:

* Total movies released by year
* Total lifetime collection by year
* Average lifetime collection
* Highest lifetime collection
* Interactive lifetime collection trend chart
* Movies-per-year chart
* Yearly data table

### Movie Details

Individual movie pages provide:

* Movie title
* Release date
* Movie poster
* Opening Day collection
* Opening Weekend collection
* Week 1 collection
* Lifetime collection
* Box office performance visualization
* Lifetime-to-opening-day multiple

Movie posters are retrieved dynamically through Wikipedia's public API when available.

## Backend API

The FastAPI backend exposes REST endpoints for the frontend.

### Health Check

```text
GET /
```

Response:

```json
{
  "message": "Box Office API is running"
}
```

### Top Lifetime Movies

```text
GET /api/movies/top-lifetime
```

### Movie Search

```text
GET /api/movies/search?name=movie_name
```

### Movie Details

```text
GET /api/movies/{movie_id}
```

### Lifetime Rankings

```text
GET /api/rankings/lifetime
```

### Opening Day Rankings

```text
GET /api/rankings/opening-day
```

### Opening Weekend Rankings

```text
GET /api/rankings/opening-weekend
```

### Yearly Analytics

```text
GET /api/years
```

## Data Architecture

The project uses a layered data architecture in Databricks.

```text
Raw Data
   |
   v
+-------------+
|   Bronze    |
| Raw Data    |
+-------------+
       |
       v
+-------------+
|   Silver    |
| Cleaned and |
| Transformed |
| Data        |
+-------------+
       |
       v
+-------------+
|    Gold     |
| Analytics   |
| Ready Data  |
+-------------+
       |
       v
    FastAPI
       |
       v
    Next.js
```

The Gold layer contains analytics-oriented datasets used by the application, including movie performance, rankings, and yearly performance data.

## Environment Variables

### Backend

The backend requires:

```env
DATABRICKS_SERVER_HOSTNAME=your_hostname
DATABRICKS_HTTP_PATH=your_http_path
DATABRICKS_TOKEN=your_token
```

These values must never be committed to GitHub.

### Frontend

For local development:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://box-office-analytics.onrender.com
```

## Local Development

### Clone the Repository

```bash
git clone https://github.com/OkayHarshh/box-office-analytics.git
cd box-office-analytics
```

### Backend

Navigate to the backend:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required Databricks environment variables.

Start FastAPI:

```bash
uvicorn main:app --reload --port 8000
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend

Open another terminal and navigate to:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start Next.js:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Production Build

To create a production build:

```bash
npm run build
```

The application includes the following routes:

```text
/
 /movies/[movie_id]
 /rankings
 /years
```

## Deployment

### Frontend

The Next.js frontend is deployed using Vercel.

The production frontend communicates with the FastAPI backend through the `NEXT_PUBLIC_API_URL` environment variable.

### Backend

The FastAPI backend is deployed using Render.

The backend connects securely to Databricks using environment variables stored in Render.

### Data Platform

The application uses Databricks SQL Warehouse as its analytics data source.

## Application Flow

When a user searches for a movie:

```text
User
 |
 v
Next.js Search UI
 |
 v
FastAPI API
 |
 v
Databricks SQL
 |
 v
Movie Results
 |
 v
Next.js UI
```

For analytics pages:

```text
Next.js
   |
   v
FastAPI
   |
   v
Databricks Gold Tables
   |
   v
JSON Response
   |
   v
Charts and Tables
```

## Project Structure

```text
box-office-analytics/
|
├── Backend/
│   ├── main.py
│   └── requirements.txt
|
├── Frontend/
│   ├── public/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   └── Navbar.tsx
│   │       ├── movies/
│   │       │   └── [movie_id]/
│   │       │       └── page.tsx
│   │       ├── rankings/
│   │       │   └── page.tsx
│   │       ├── years/
│   │       │   └── page.tsx
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── package.json
│   └── next.config.ts
|
├── .gitignore
└── README.md
```

## Security

Sensitive credentials are kept outside the repository.

The following files and credentials should never be committed:

```text
.env
.env.local
.env.*.local
DATABRICKS_TOKEN
DATABRICKS_SERVER_HOSTNAME
DATABRICKS_HTTP_PATH
```

The project uses environment variables for local development and cloud deployment.

## Future Improvements

Potential future improvements include:

* Genre-based analytics
* Actor and director analytics
* Production house rankings
* Year-over-year growth analysis
* Language-wise box office analysis
* Advanced movie comparison
* Revenue trend forecasting
* More detailed movie-level charts
* Automated data refresh pipelines
* Authentication
* Personalized dashboards

## Project Goals

This project demonstrates an end-to-end data engineering and analytics workflow:

```text
Data
 |
 v
Databricks
 |
 v
SQL Analytics
 |
 v
FastAPI
 |
 v
REST APIs
 |
 v
Next.js
 |
 v
Interactive Analytics
 |
 v
Cloud Deployment
```

The project combines data engineering, SQL analytics, backend development, frontend development, visualization, and cloud deployment into a single production-style application.

## Author

Harsh

GitHub:

[https://github.com/OkayHarshh](https://github.com/OkayHarshh)

````

**Only change this one line before saving:**

```text
https://box-office-analytics-five.vercel.app/
````


