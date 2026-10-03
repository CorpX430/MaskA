# Mask AI

Mask AI is a mobile-first reply studio based on the ReplyCraft blueprint. It helps you turn a post into a concise, thoughtful reply without a Twitter/X API connection. You supply the post context and a session-only OpenRouter or Groq key; Mask AI drafts the line, then you choose whether to copy it or open X manually.

## Stack

Next.js 14 App Router, TypeScript, Tailwind CSS, Clerk, and the OpenAI-compatible SDK.

## Local setup

1. Create a Clerk application and enable email/password plus Twitter/X under social connections.
2. Copy `.env.local.example` to `.env.local` and add the Clerk publishable and secret keys.
3. Install dependencies with `npm install`.
4. Run `npm run dev`, then open `http://localhost:3000`.

The OpenRouter/Groq key is intentionally entered in the dashboard and is not written to environment variables or persisted by the app.

## GitHub and Render

The managed Webdev project is prepared for a GitHub canonical repository. Connect it from the project’s Git configuration flow so the authorized private repository becomes the project source. For Render, create a Web Service from the repository, use the included `Dockerfile`, and set the start command to `npm start` if Render asks for one. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/`, and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/` as Render environment variables. Render should expose port `3000`.

For Clerk, set the local and Render domains in Clerk’s allowed origins/redirect URLs. Enable Twitter/X in the Clerk dashboard; the app does not call the Twitter API and only uses Clerk for sign-in.

## Routes

- `/` — public landing page
- `/dashboard` — protected reply studio
- `/api/generate` — authenticated POST endpoint

## Security notes

Keys entered in the dashboard are sent only to the authenticated generation route for that request. They are not persisted in Clerk metadata, cookies, databases, or logs by the application.
