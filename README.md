# Mask AI

Mask AI is a mobile-first reply studio for turning a post into a concise, thoughtful reply. It does **not** connect to the Twitter/X API: users supply the context, choose a voice, and then copy the draft or open X manually.

## Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS
- Clerk authentication
- OpenRouter TypeScript SDK for server-side AI generation
- Prisma 6 with PostgreSQL persistence
- Docker deployment on Render

## Product behavior

1. Visitors sign in with Clerk, then enter the protected `/dashboard` workspace.
2. A signed-in user pastes post text and/or a post URL, then selects a voice: insightful, bold, humorous, or professional.
3. The authenticated `/api/generate` route sends the request to OpenRouter using a **server-only** `OPENROUTER_API_KEY` and returns one under-280-character reply.
4. The dashboard shows the reply, supports copying it, can open an X compose intent, remembers the user’s preferred voice, and shows the last 12 private generations.
5. Generation history is stored in PostgreSQL by Clerk user ID. The app gracefully falls back to stateless operation if `DATABASE_URL` has not been attached yet.

The application never stores model credentials. A small in-memory per-user rate limit protects the shared OpenRouter key against accidental or abusive bursts.

## Local setup

1. Create a Clerk application and enable the desired sign-in methods (email/password is sufficient; Twitter/X is optional).
2. Copy `.env.local.example` to `.env.local` and add the Clerk, OpenRouter, and PostgreSQL values.
3. Run `npm ci`, `npm run db:generate`, and `npm run dev`.
4. For a connected database, run `npm run db:deploy` before starting the app.
5. Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk browser publishable key |
| `CLERK_PUBLISHABLE_KEY` | Yes | Runtime alias used by the server-rendered provider |
| `CLERK_SECRET_KEY` | Yes | Clerk server authentication key |
| `OPENROUTER_API_KEY` | Yes | Server-only AI credential |
| `OPENROUTER_MODEL` | No | Overrides `google/gemini-3.1-flash-lite` |
| `DATABASE_URL` | For persistence | Prisma PostgreSQL connection string |
| `APP_URL` | No | Public URL supplied to OpenRouter as application attribution |

## Render deployment

The repository includes a Dockerfile and `render.yaml`. The deployed service builds Prisma Client, runs `prisma migrate deploy` at startup, and then starts Next.js. The Render Blueprint links the `mask-ai-db` PostgreSQL resource through `DATABASE_URL`.

The included Render database uses the free plan and is scheduled to expire after the provider’s free-plan period. Upgrade the database plan before that date if you need uninterrupted history retention.

Add the Clerk values and `OPENROUTER_API_KEY` as Render environment variables. Keep `OPENROUTER_API_KEY` server-only and give the key a provider-side spending limit. In Clerk, add the Render domain to the allowed origins and redirect URLs.

## Premium roadmap suggestions

The current premium foundation is private history plus remembered preferences. Strong next upgrades are: reply A/B variants with a side-by-side quality selector; saved personas and reusable tone presets; team workspaces with shared voice libraries; analytics for reply performance using user-entered outcome tags; URL preview and source extraction with explicit user consent; exportable history; and a paid usage meter with monthly limits and Stripe/Clerk Billing.

## Routes

- `/` — public product landing page
- `/sign-in` and `/sign-up` — Clerk authentication pages
- `/dashboard` — protected reply studio, preference controls, and private generation library
- `/api/generate` — authenticated OpenRouter generation endpoint
- `/api/history` — authenticated generation history endpoint
- `/api/preferences` — authenticated preference endpoint
- `/api/health` — unauthenticated Render readiness endpoint
