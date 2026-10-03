# Mask AI implementation plan

## Product direction
Mask AI is a mobile-first reply studio for creators who want to turn a public post into a thoughtful, ready-to-share response. The provided ReplyCraft specification is preserved as the product behavior; the presentation is branded as Mask AI and tuned for a fast phone viewport.

## Design system
- **Design movement:** editorial dark-mode utility with a hint of cyber-minimalism.
- **Core principles:** calm focus, high signal, visible control, and momentum from prompt to publish.
- **Color philosophy:** near-black creates a quiet writing surface; electric blue indicates action and navigation; mint marks successful output and progress; warm white keeps long-form text comfortable.
- **Layout paradigm:** a narrow reading column with a persistent utility rail on desktop and stacked, thumb-friendly sections on mobile. The main workflow is an intentional vertical funnel rather than a grid of equal cards.
- **Signature elements:** a mint “mask” mark, thin electric-blue focus rings, and tiny uppercase section labels that make the tool feel like a console without feeling technical.
- **Interaction philosophy:** every field explains why it is here, the primary action stays visually dominant, and generated output appears as a clear handoff rather than a modal interruption.
- **Animation:** use short opacity/translate transitions for progressive disclosure, a soft shimmer while generating, and no decorative loops that compete with writing.
- **Typography:** Space Grotesk for headings and brand moments, Geist/system sans for readable controls and reply text. Headlines use tight tracking; labels use small uppercase tracking.
- **Brand essence:** “A sharper reply before your next scroll” for creators who want to participate with intent. Personality: precise, optimistic, quietly bold.
- **Brand voice:** direct, encouraging, and non-hype. Example lines: “Make the next reply count.” and “Bring the thought. We’ll shape the signal.”
- **Wordmark / logo:** a compact M built from two offset masks, represented in the UI as a mint angular monogram inside a rounded square.
- **Signature brand color:** mint `#73F7BB`.

## Implementation
- Next.js App Router with TypeScript and Tailwind CSS.
- Clerk wraps the app; `/dashboard` and `/api/generate` are protected by Clerk middleware and the API route performs a second server-side user check.
- The client keeps the user-supplied OpenRouter/Groq key in memory for the current tab only. The server detects prefixes and uses the OpenAI-compatible SDK with the provider-specific base URL and model.
- Static PWA metadata lives in `public/manifest.json`, `public/icon.svg`, and `public/manus-routes.json`.
- Render-ready container and environment documentation are included; GitHub connection is handled through the managed project canonical-repository flow.

## Project structure
- `app/page.tsx`: public landing page and signed-in entry state.
- `app/dashboard/page.tsx`: interactive reply workspace.
- `app/components/*`: generated reply and loading-state UI.
- `app/api/generate/route.ts`: authenticated provider-aware generation endpoint.
- `app/utils/llmClient.ts`: provider detection and OpenAI-compatible client factory.
- `app/globals.css`: visual system and utility styles.
- `public/*`: app icon, PWA manifest, and route manifest.
- `Dockerfile`: Render container build and runtime.
