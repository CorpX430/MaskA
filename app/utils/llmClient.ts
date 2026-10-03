import OpenAI from 'openai';

export type Provider = 'openrouter' | 'groq';

export function detectProvider(apiKey: string): Provider {
  if (apiKey.startsWith('sk-or-')) return 'openrouter';
  if (apiKey.startsWith('gsk_')) return 'groq';
  throw new Error('Unsupported key. Use an OpenRouter key (sk-or-…) or Groq key (gsk_…).');
}

export function createLLMClient(apiKey: string) {
  const provider = detectProvider(apiKey);
  return {
    provider,
    client: new OpenAI({
      apiKey,
      baseURL: provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.groq.com/openai/v1',
      defaultHeaders: provider === 'openrouter' ? { 'HTTP-Referer': 'https://mask-ai.app', 'X-Title': 'Mask AI' } : undefined,
    }),
  };
}
