# Orbit

A solar system observatory: interactive 3D exploration, a NASA-backed catalog, Astronomy Picture of the Day, and an optional AI guide.

## Product

- **Explore** — full-screen 3D model of the Sun and planets, with optional dwarf planets
- **Inspector** — diameter, mass, day, year, temperature, gravity, and major moons
- **Catalog** — 34 bodies compiled from NASA fact sheets and Wikipedia
- **Sky** — NASA Astronomy Picture of the Day
- **Guide** — an eve agent that can focus the camera, look up facts, and lead a tour

The 3D explorer works without an AI key. The guide needs Vercel AI Gateway credentials.

## Run locally

Node.js 24 is required.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Set `AI_GATEWAY_API_KEY` (or run `eve link`) only if you want the guide to answer.

## Data

Catalog data is baked into `data/catalog.json` so the product works offline and on deploy:

- NASA planetary fact sheet via [devstronomy/nasa-data-scraper](https://github.com/devstronomy/nasa-data-scraper)
- Wikipedia REST summaries and thumbnails
- NASA APOD, with a stored fallback

Refresh the catalog:

```bash
node scripts/build-catalog.mjs
```

## Deploy

Deploy the Next.js app to Vercel. `withEve()` mounts the agent at `/eve/v1/*`. Browser chat is open for this public demo (`none()` in `agent/channels/eve.ts`).
