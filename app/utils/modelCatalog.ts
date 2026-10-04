export const DEFAULT_OPENROUTER_MODEL = 'google/gemini-3.1-flash-lite';

export const OPENROUTER_MODEL_OPTIONS = [
  { id: DEFAULT_OPENROUTER_MODEL, label: 'Gemini Flash Lite', detail: 'Fast and balanced' },
  { id: 'apodex/apodex-1.1-mini:free', label: 'Apodex Mini', detail: 'Free reasoning model' },
  { id: 'inclusionai/ling-3.1-flash', label: 'Ling Flash', detail: 'Long-context specialist' },
] as const;
