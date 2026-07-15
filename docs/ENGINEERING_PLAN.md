# AirSight AI — Engineering Blueprint

> **Document Status:** Approved v1.0  
> **Prepared By:** Principal Software Engineer & Tech Lead  
> **Last Updated:** July 15, 2026  
> **Hackathon:** ET AI Hackathon 2026  
> **Classification:** Engineering Specification — Architecture & Implementation Plan

---

## Table of Contents

1. [Folder Structure](#1-folder-structure)
2. [Git Branching Strategy](#2-git-branching-strategy)
3. [Coding Standards](#3-coding-standards)
4. [API Folder Organization](#4-api-folder-organization)
5. [Database Migration Strategy](#5-database-migration-strategy)
6. [Backend Module Breakdown](#6-backend-module-breakdown)
7. [Frontend Module Breakdown](#7-frontend-module-breakdown)
8. [AI Module Breakdown](#8-ai-module-breakdown)
9. [Environment Variables](#9-environment-variables)
10. [Development Workflow](#10-development-workflow)
11. [Coding Conventions](#11-coding-conventions)
12. [Logging Strategy](#12-logging-strategy)
13. [Testing Strategy](#13-testing-strategy)
14. [CI/CD Workflow](#14-ci-cd-workflow)
15. [Milestones](#15-milestones)

---

## 1. Folder Structure

A monorepo structure separating the visual UI client, the REST API core, and the AI modeling notebooks/modules.

```
airsight-ai/
 ├── .github/
 │    └── workflows/              # GitHub Actions CI/CD workflows
 ├── backend/
 │    ├── api/                    # FastAPI routes, dependencies, schemas
 │    ├── core/                   # Shared configurations, DB engines, logs
 │    ├── crud/                   # Database CRUD query layer
 │    ├── db/                     # SQLAlchemy models, Alembic migrations
 │    ├── services/               # External APIs, task handlers, business logic
 │    ├── tests/                  # Pytest test cases
 │    ├── Dockerfile
 │    ├── requirements.txt
 │    └── main.py                 # FastAPI application entry point
 ├── frontend/
 │    ├── public/                 # Static assets, map markers
 │    ├── src/
 │    │    ├── assets/            # Tailwind css styles, local images
 │    │    ├── components/        # Reusable UI components (buttons, charts)
 │    │    ├── hooks/             # Custom React hooks (React Query fetch wrappers)
 │    │    ├── pages/             # Route-level screens (Dashboard, Forecast)
 │    │    ├── services/          # API services client mapping
 │    │    ├── store/             # Zustand state management
 │    │    └── types/             # TypeScript definitions
 │    ├── tailwind.config.js
 │    ├── tsconfig.json
 │    ├── Dockerfile
 │    └── package.json
 ├── ml/
 │    ├── data/                   # Data caching (gitignored)
 │    ├── models/                 # Model export files (XGBoost .json, LSTM .pt)
 │    ├── src/
 │    │    ├── features/          # Processing & spatial interpolation pipelines
 │    │    ├── inference/         # Prediction, forecast, and SHAP calculators
 │    │    └── training/          # Model architecture, training scripts
 │    ├── notebooks/              # Exploration & SHAP verification notebooks
 │    └── requirements.txt
 ├── docker-compose.yml           # Unified local workspace orchestration
 └── README.md
```

---

## 2. Git Branching Strategy

We adopt the **GitHub Flow** strategy, modified for fast-paced team hackathons.

- **Main Branch (`main`):** Production-ready code. Commits here represent stable milestones. Protected branch requiring at least one approving review and green checks.
- **Development Branch (`dev`):** The staging ground where feature branches merge. Used for team testing.
- **Feature Branches (`feat/*`, `fix/*`, `refactor/*`):** Short-lived branches created from `dev`. Examples:
  - `feat/api-spatial-query`
  - `feat/ui-shap-visual`
  - `fix/timescale-conn-leak`

### Pull Request Rules:
1. Rebase feature branches on top of `dev` before opening a PR.
2. PR execution requires passing CI checks (Lint, Unit Tests, Docker Build).
3. Merge commits are disabled. Squash-merge is enforced to maintain a linear git history.

---

## 3. Coding Standards

### 3.1 Python Backend & AI
- **Formatter:** `black` (default line length: 88).
- **Linter:** `ruff` (covers pyflakes, pycodestyle, isort imports).
- **Static Typing:** Typed parameters using type-hints (`typing` module). Verified using `mypy`.

### 3.2 TypeScript Frontend
- **Formatter & Linter:** `eslint` configured with `eslint-config-prettier` and `prettier`.
- **TypeScript:** Strict type checking (`strict: true` in `tsconfig.json`). Explicitly avoid the use of `any`.
- **Naming:** CamelCase for classes/types, camelCase for variables/functions, UPPER_SNAKE_CASE for constant values.

---

## 4. API Folder Organization

FastAPI modules are structured by domain bounds inside `backend/api/`.

```
backend/api/
 ├── v1/
 │    ├── endpoints/
 │    │    ├── aqi.py             # Hyperlocal predictions
 │    │    ├── attribution.py     # XGBoost + SHAP values
 │    │    ├── forecast.py        # LSTM forecasting metrics
 │    │    └── alerts.py          # Trigger management
 │    ├── dependencies.py         # DB sessions, auth overrides
 │    └── router.py               # Combined routers routing to /v1
 └── schemas/                     # Pydantic schemas (Request/Response models)
      ├── aqi.py
      ├── attribution.py
      └── forecast.py
```

---

## 5. Database Migration Strategy

We manage database schema shifts with **Alembic** (built-on SQLAlchemy).

- **Migration Process:**
  1. Add or modify models in `backend/db/models/`.
  2. Generate a migration script locally:
     `docker-compose exec api alembic revision --autogenerate -m "add_shap_values_to_attribution"`
  3. Inspect the autogenerated script in `backend/db/migrations/versions/` to verify PostGIS index correctness.
  4. Apply migrations on target environment:
     `alembic upgrade head`
- **Data Seeds:** Seed scripts (`backend/db/seed.py`) provide mock ward geometries and weather features for the single-city MVP.

---

## 6. Backend Module Breakdown

- **Core Module (`backend/core/`):** Initializes base configuration settings, setups connection pools using SQLAlchemy AsyncEngine, and maps custom exception handlers.
- **Spatial Grid Engine (`backend/services/gis.py`):** Calculates spatial mappings, matching latitude/longitude query keys to the nearest 500m grid cell polygon in PostGIS.
- **Alert Dispatch Engine (`backend/services/alerts.py`):** Compares live predictions to preset ward threshold targets. If a breach is detected, it triggers asynchronous push tasks.

---

## 7. Frontend Module Breakdown

- **GIS Engine (`frontend/src/components/Map.tsx`):** Renders Mapbox GL JS canvases. Animates spatial layers including ward choropleths, station nodes, and wind vector symbols.
- **State Store (`frontend/src/store/`):** Using Zustand stores to handle active ward selections, viewport scopes, current map layers, and alert feeds.
- **Visual Charts (`frontend/src/components/charts/`):** Custom area charts for forecasting (wrapping Recharts with custom SVG confidence zones) and horizontal bar groupings for SHAP values.

---

## 8. AI Module Breakdown

- **Feature Engineering Pipeline (`ml/src/features/`):** Generates lag features, calculates cyclical temporal components, and performs spatial interpolation (Kriging).
- **Attribution & Explainer Service (`ml/src/inference/attribution.py`):** Evaluates local weather and sensor arrays using the XGBoost model. Computes feature importance using SHAP `TreeExplainer` on request.
- **Temporal Forecast Engine (`ml/src/inference/forecast.py`):** Runs inference on the pre-trained LSTM network to project 72 hours of expected PM2.5 levels.

---

## 9. Environment Variables

Templates for project variables (`.env.example` in repo root).

### Backend Config:
```env
PROJECT_NAME="AirSight AI MVP"
ENV_MODE=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secretpassword
POSTGRES_DB=airsight_db
POSTGRES_HOST=db
POSTGRES_PORT=5432
REDIS_URL=redis://redis:6379/0
MAPBOX_ACCESS_TOKEN=pk.ey...
GEMINI_API_KEY=AIzaSy...
```

### Frontend Config:
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.ey...
```

---

## 10. Development Workflow

Setting up the project locally:

1. **Clone the Repo:**
   `git clone https://github.com/organization/airsight-ai.git && cd airsight-ai`
2. **Launch Infrastructure Services:**
   `docker-compose up -d --build` (Starts PostgreSQL+PostGIS, Redis, FastAPI, and Vite hot reload server)
3. **Execute DB Migrations & Seeding:**
   `docker-compose exec api alembic upgrade head`
   `docker-compose exec api python /app/db/seed.py`
4. **Inspect API Docs:** Open `http://localhost:8000/docs` to test endpoints.

---

## 11. Coding Conventions

- **Database Queries:** Always use async SQLAlchemy operations (`select()`, `execute()`) inside session contexts.
- **React Custom Hooks:** Separate data fetching logic from the UI. Place API requests in custom hooks using `@tanstack/react-query`.
- **Model Storage:** ML models should be versioned, saved as serializable weights (`.json` or `.pt`), and loaded into CPU memory once at container boot.

---

## 12. Logging Strategy

- **Format:** Structured JSON logging for production engines; standard log formats for local development.
- **Implementation:** Python's standard `logging` library configured in `backend/core/logger.py`.
- **Log Levels:**
  - `DEBUG`: Log input variables, SQL statements, and interpolation metrics.
  - `INFO`: Log system start, migration stages, and successful inferences.
  - `WARNING`: Log API delays, slow DB operations, and near-limit thresholds.
  - `ERROR` / `CRITICAL`: Log database connection failures, model load errors, and unhandled system exceptions.

---

## 13. Testing Strategy

```
                          +------------------------+
                          |   End-to-End Tests     |  <-- Playwright / Cypress
                          |   (Critical User Flows)|
                          +------------------------+
                          |    Integration Tests   |  <-- Pytest API testing,
                          |    (DB queries, APIs)  |      Zustand integration
                          +------------------------+
                          |      Unit Tests        |  <-- Python pytest (inference modules),
                          |    (Logic, schemas)    |      Jest / React Testing Library
                          +------------------------+
```

- **Target Coverage:** Minimum 80% coverage for core ML algorithms and API routing schemas.
- **Mocking:** Mock external API integrations (such as Copernicus Hub and IMD) using `pytest-mock`.

---

## 14. CI/CD Workflow

### GitHub Actions Pipeline (`.github/workflows/ci.yml`):
- **Lint Check:** Runs `ruff` for Python, `eslint` for TypeScript on code commit.
- **Test Suit runner:** Boots a transient PostgreSQL service, runs Alembic migrations, and executes testing blocks.
- **Docker Build Validation:** Verifies that both frontend and backend Dockerfiles compile.

---

## 15. Milestones

```
Milestone 1: Database & Data Pipeline setup (Week 1)
 ├── PostGIS schemas populated with ward shapefiles
 └── Airflow data pipelines polling mock CPCB API streams

Milestone 2: AI Core Models integration (Week 2)
 ├── Trained XGBoost and LSTM weights exported to /ml/models
 └── SHAP explainability parser generating structured outputs

Milestone 3: FastAPI Backend & API validation (Week 3)
 ├── REST endpoints validated with strict Pydantic schemas
 └── Spatial coordinates matching grid cells mapped in PostGIS

Milestone 4: Mapbox Front & Dashboard polish (Week 4)
 ├── Dashboard components connected to endpoints
 ├── Mapbox GL JS rendering AQI heatmap overlays
 └── Final mock run & presentation prep
```

---

*© 2026 AirSight AI. Confidential Engineering Document.*  
*Prepared for the ET AI Hackathon.*
