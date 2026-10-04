# Mask AI

Mask AI is a mobile-first reply studio for turning a post into a concise, thoughtful reply. It does **not** connect to the Twitter/X API: users supply the context, choose a voice, and then copy the draft or open X manually.

## Stack

- Next.js 14 App Router and TypeScript
- Tailwind CSS
- Clerk authentication
- OpenRouter TypeScript SDK for server-side AI generation
- Docker deployment on Render

## Product behavior

1. Visitors sign in with Clerk, then enter the protected `/dashboard` workspace.
2. A signed-in user pastes post text and/or a post URL, then selects a voice: insightful, bold, humorous, or professional.
3. The authenticated `/api/generate` route sends the request to OpenRouter using a **server-only** `OPENROUTER_API_KEY` and returns one under-280-character reply.
4. The dashboard shows the reply, supports copying it, and can open an X compose intent. No post is submitted automatically.

The application never stores user prompts, generated replies, or model credentials. A small in-memory per-user rate limit protects the shared OpenRouter key against accidental or abusive bursts.

## Local setup

1. Create a Clerk application and enable the desired sign-in methods (email/password is sufficient; Twitter/X is optional).
2. Copy `.env.local.example` to `.env.local` and add the Clerk and OpenRouter values.
3. Create an OpenRouter project key with an appropriate spending limit.
4. Run `npm ci` and then `npm run dev`.
5. Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk browser publishable key |
| `CLERK_PUBLISHABLE_KEY` | Yes | Runtime alias used by the server-rendered provider |
| `CLERK_SECRET_KEY` | Yes | Clerk server authentication key |
| `OPENROUTER_API_KEY` | Yes | Server-only AI credential |
| `OPENROUTER_MODEL` | No | Overrides `google/gemini-3.1-flash-lite` |
| `APP_URL` | No | Public URL supplied to OpenRouter as application attribution |

## Render deployment

The repository includes a Dockerfile and `render.yaml`. The deployed service is expected to:

- build with `npm ci && npm run build`;
- start with `npm start` and honor Render's `PORT` environment variable;
- expose the unauthenticated health check at `/api/health`;
- auto-deploy updates from the `main` branch.

Before the AI and authentication paths can be used in production, add the three Clerk values and `OPENROUTER_API_KEY` as Render environment variables. Keep `OPENROUTER_API_KEY` server-only and give the key a provider-side spending limit. In Clerk, add the final Render domain to the allowed origins and redirect URLs.

## Routes

- `/` — public product landing page
- `/sign-in` and `/sign-up` — Clerk authentication pages
- `/dashboard` — protected reply studio
- `/api/generate` — authenticated OpenRouter generation endpoint
- `/api/health` — unauthenticated Render readiness endpoint
