# KhorMusic

A music streaming web player: playlists, library, likes, search, a player with volume and progress controls, Google sign-in and an admin panel for managing content.

## Features

- **Player** — play, pause, next/previous, shuffle, volume, seeking
- **Playlists** — create, edit, delete, add songs; a "Liked Songs" playlist
- **Library & search** — the user's saved playlists, song search
- **Authentication** — Google sign-in (Firebase Auth)
- **Admin panel** — manage songs and playlists

## Tech stack

| Part | Technologies |
|---|---|
| `music-khor/` (frontend) | Astro, React, TypeScript, Tailwind CSS, Zustand, Radix UI, Framer Motion, Firebase Auth |
| `bdexpressjs/` (backend) | Node.js, Express, PostgreSQL (`pg`) |

## Getting started

### Backend

```bash
cd bdexpressjs
cp .env.example .env    # set DATABASE_URL to your PostgreSQL
npm install
psql "$DATABASE_URL" -f schema.sql -f seed.sql
npm run dev
```

The API is available at `http://localhost:4444/bdmusic`.

### Frontend

```bash
cd music-khor
npm install
npm run dev
```

The backend address is set in `music-khor/src/lib/config.ts`.

> Audio files (`music-khor/public/songs/`) are not included for copyright reasons — put your own `.mp3` files there and update the paths in `seed.sql`.

## Database

`users` · `playlists` · `songs` · `user_playlists` · `playlist_songs` — see [`bdexpressjs/schema.sql`](bdexpressjs/schema.sql).
