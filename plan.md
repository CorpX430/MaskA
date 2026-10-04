# Mask AI implementation plan

## Product direction

Mask AI is a mobile-first reply studio for creators who want to turn a public post into a thoughtful, ready-to-share response. It preserves the provided ReplyCraft behavior while presenting a focused Mask AI experience that keeps the user in control of every final post.

## Design system

- **Design movement:** editorial dark-mode utility with a hint of cyber-minimalism.
- **Core principles:** calm focus, high signal, visible control, and momentum from prompt to publish.
- **Color philosophy:** near-black creates a quiet writing surface; electric blue indicates action and navigation; mint marks successful output and progress; warm white keeps long-form text comfortable.
- **Layout paradigm:** a narrow reading column with a persistent utility rail on desktop and stacked, thumb-friendly sections on mobile. The workflow is an intentional vertical funnel rather than a uniform grid.
- **Signature elements:** a mint “mask” mark, thin electric-blue focus rings, and tiny uppercase section labels.
- **Interaction philosophy:** every field explains why it is here, the primary action remains visually dominant, and generated output appears as a clear handoff rather than a modal interruption.
- **Animation:** short opacity/translate transitions for progressive disclosure, a soft shimmer while generating, and no decorative loops that compete with writing.
- **Typography:** Space Grotesk-inspired display hierarchy with a clean system sans for readable controls and reply text.
- **Brand essence:** “A sharper reply before your next scroll” for creators who want to participate with intent. Personality: precise, optimistic, quietly bold.
- **Brand voice:** direct, encouraging, and non-hype. Example lines: “Make the next reply count.” and “Bring the thought. We’ll shape the signal.”
- **Wordmark / logo:** a compact M built from two offset masks, represented by a mint angular monogram inside a rounded square.
- **Signature brand color:** mint `#73F7BB`.

## Implementation

- Next.js App Router with TypeScript and Tailwind CSS.
- Clerk wraps the app; `/dashboard` is protected by Clerk middleware, and `/api/generate` performs a second server-side user check.
- OpenRouter is integrated through its official TypeScript SDK. `OPENROUTER_API_KEY` exists only on the server; browser requests never contain a model key.
- The generation route validates and bounds all input, hashes the Clerk user ID before sharing it with OpenRouter for provider-side abuse isolation, limits generation bursts per user, returns sanitized replies under 280 characters, and does not expose provider error payloads.
- Static PWA metadata lives in `public/manifest.json`, `public/icon.svg`, and `public/manus-routes.json`.
- A Dockerfile and Render declaration support build, health check, and auto-deploy from `main`.

## Project structure

- `app/page.tsx`: public landing page and signed-in entry state.
- `app/dashboard/page.tsx`: dynamic authenticated dashboard entry.
- `app/dashboard/DashboardClient.tsx`: interactive reply workspace.
- `app/components/*`: generated reply and loading-state UI.
- `app/api/generate/route.ts`: authenticated and rate-limited OpenRouter endpoint.
- `app/api/health/route.ts`: Render readiness endpoint.
- `app/utils/llmClient.ts`: server-only OpenRouter SDK factory and model configuration.
- `app/globals.css`: visual system and utility styles.
- `public/*`: app icon, PWA manifest, and route manifest.
- `Dockerfile` and `render.yaml`: Render container and environment declarations.
