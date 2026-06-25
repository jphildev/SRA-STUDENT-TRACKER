# AdNU SRA SkillTrack — Mobile Web App

Mobile-first prototype of the SRA SkillTrack reading-comprehension monitoring
app, built with **Next.js 14 (App Router) + TypeScript**. Front-end only — it
ships with mock data and is structured so a back-end can be wired in later.

## Screens

| Route      | Screen   |
|------------|----------|
| `/login`   | Sign In  |
| `/`        | Home     |
| `/levels`  | Levels (My Journey + full colour-level palette table) |
| `/log`     | Progress Log |
| `/awards`  | Badges   |
| `/guide`   | SRA Guide |

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. On a desktop browser the app is centered in a
phone frame; on a real phone it fills the screen.

## Notch / Dynamic Island

The layout sets `viewport-fit=cover` and pads the header with
`env(safe-area-inset-top)` so content never sits under the front camera or
Dynamic Island. A faux iOS status bar (clock, island pill, signal/wi-fi/battery)
is rendered in the app shell to mirror the real device chrome.

## Deploy to Vercel

This is a standard Next.js app and deploys to Vercel with no extra config:

1. Push the repo to GitHub.
2. In Vercel, **New Project → Import** the repo.
3. Set the **Root Directory** to `mobile-front-end`.
4. Deploy. (Framework preset auto-detects as Next.js.)

## Wiring a back-end later

- Replace the mock arrays in each page (and `src/lib/levels.ts`) with `fetch`
  calls to your API.
- `src/app/login/page.tsx` currently just routes to `/` — swap in your auth
  call (e.g. NextAuth) there.
