import { OpenRouter } from '@openrouter/sdk';

export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-3.1-flash-lite';

/**
 * Creates a server-only OpenRouter client. The key is deliberately read only
 * from the runtime environment and is never passed to a browser client.
 */
export function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) return null;

  return new OpenRouter({
    apiKey,
    appTitle: 'Mask AI',
    httpReferer: process.env.APP_URL?.trim() || 'https://mask-ai-6sio.onrender.com',
    timeoutMs: 25_000,
  });
}

export function getOpenRouterModel() {
  return process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
}
