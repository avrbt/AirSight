# AirSight
https://drive.google.com/file/d/17nbqiBGgvxd__4cHEKz1GQa_IDHZkj8Y/view?usp=sharing




# AirSight

AirSight is an AI-powered air quality monitoring and insights platform built to help users understand environmental conditions through a modern dashboard experience. It combines a React + Vite frontend with supporting backend, AI, and deployment folders, making it suitable for real-time visualization, analytics, and intelligent environmental tracking.

## Features

* Clean and responsive dashboard UI
* Air quality and environment-focused data visualization
* Charts and analytics powered by Recharts
* AI-related project structure for intelligent analysis
* Frontend, backend, and deployment-ready folder separation
* Docker / Nginx setup support for production use

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4
* **Charts:** Recharts
* **Build Tools:** Vite, oxfmt
* **Project Structure:** frontend, backend, ai, docs, docker/nginx

## Project Structure

```bash
AirSight/
├── frontend/
├── backend/
├── ai/
├── docs/
├── docker/
│   └── nginx/
├── src/
├── .github/
└── README.md
```

## Getting Started

### Prerequisites

* Node.js 18+ recommended
* npm, pnpm, or yarn
* Git

### Installation

```bash
git clone https://github.com/avrbt/AirSight.git
cd AirSight
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Format code

```bash
npm run format
```

## Scripts

From `package.json`, the available scripts are:

* `dev` — starts Vite on `0.0.0.0`
* `build` — builds the app for production
* `preview` — previews the production build
* `format` — formats code using `oxfmt`

## Use Case

AirSight is useful for:

* monitoring air quality trends
* visualizing environmental data
* building AI-assisted insights dashboards
* presenting smart city or sustainability-related analytics

## Deployment

The repository includes a `docker/nginx` directory, which suggests the project is prepared for containerized deployment behind Nginx.

## Contributing

Contributions are welcome.
Feel free to open an issue or submit a pull request with improvements, bug fixes, or new features.

## License

Add your preferred license here.

---

Built with care for hackathons, demos, and real-world environmental dashboards.
