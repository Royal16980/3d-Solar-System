# 3D Solar System Guide

An interactive Three.js solar system with an [eve](https://eve.dev) agent that can explain the planets, move the camera, and change orbit speed.

## Run locally

Node.js 24 is required.

```bash
npm install
```

Set a Vercel AI Gateway key (or link a Vercel project so `VERCEL_OIDC_TOKEN` is available):

```bash
cp .env.example .env.local
```

Then start the Next.js app, which also boots the eve agent:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The 3D model fills the page; the guide chat sits beside it.

The eve REPL is optional:

```bash
npm run dev:eve
```

## What the agent can do

- Answer questions about the Sun and eight planets
- Focus the camera on a named body
- Speed up, slow down, or pause orbits
- Lead a short outward tour from the Sun

Click a planet to inspect it yourself, or ask the guide to show it.

## Deploy

Deploy the Next.js app to Vercel. `withEve()` mounts the agent at `/eve/v1/*` on the same origin. Production browser chat is open for this public demo (`none()` in `agent/channels/eve.ts`).
