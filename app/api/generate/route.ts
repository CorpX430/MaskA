import { createHash } from 'crypto';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getOpenRouterClient, getOpenRouterModel } from '@/app/utils/llmClient';

export const runtime = 'nodejs';

const personaInstructions: Record<string, string> = {
  insightful: 'insightful and supportive, adding a specific perspective or useful nuance',
  bold: 'bold and visionary, confident without being performative',
  humorous: 'witty and light-hearted, with a smart understated punchline',
  professional: 'professional and credible, with clear expertise and restraint',
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const requestHistory = new Map<string, number[]>();

type GenerateRequest = {
  tweetUrl?: unknown;
  tweetText?: unknown;
  persona?: unknown;
};

function readString(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function hasRemainingQuota(userId: string) {
  const now = Date.now();
  const recent = (requestHistory.get(userId) || []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestHistory.set(userId, recent);
    return false;
  }

  recent.push(now);
  requestHistory.set(userId, recent);
  return true;
}

function cleanReply(content: string) {
  const normalized = content.replace(/\s+/g, ' ').trim().replace(/^['“”]|['“”]$/g, '');
  if (normalized.length <= 280) return normalized;

  const shortened = normalized.slice(0, 280);
  return shortened.replace(/\s+\S*$/, '').trimEnd() || shortened.trimEnd();
}

function anonymousUserId(userId: string) {
  return createHash('sha256').update(userId).digest('hex').slice(0, 32);
}

export async function POST(request: Request) {
  let userId: string | null = null;

  try {
    ({ userId } = await auth());
  } catch {
    return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 503 });
  }

  if (!userId) return NextResponse.json({ error: 'Sign in to generate a reply.' }, { status: 401 });

  let body: GenerateRequest;
  try {
    body = (await request.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: 'Send a valid generation request.' }, { status: 400 });
  }

  const tweetUrl = readString(body.tweetUrl, 2_000);
  const tweetText = readString(body.tweetText, 2_000);
  const persona = typeof body.persona === 'string' && body.persona in personaInstructions ? body.persona : 'insightful';

  if (!tweetUrl && !tweetText) {
    return NextResponse.json({ error: 'Add a post URL or paste the post text first.' }, { status: 400 });
  }

  const client = getOpenRouterClient();
  if (!client) {
    return NextResponse.json({ error: 'The AI service is not configured yet. Please try again shortly.' }, { status: 503 });
  }

  if (!hasRemainingQuota(userId)) {
    return NextResponse.json({ error: 'You have reached the reply limit. Please wait a few minutes and try again.' }, { status: 429 });
  }

  const context = [
    tweetUrl ? `Post URL: ${tweetUrl}` : '',
    tweetText ? `Post text: ${tweetText}` : '',
  ].filter(Boolean).join('\n');

  const systemPrompt = `You are a social media engagement expert. Write exactly one thoughtful reply to the supplied post. The reply should be ${personaInstructions[persona]}. Make the original poster want to follow the writer by being genuinely useful or distinctive, never flattering without substance. Keep it under 240 characters, use no hashtags, no quotation marks around the reply, no prefatory explanation, and sound natural.`;

  try {
    const completion = await client.chat.send({
      chatRequest: {
        model: getOpenRouterModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: context },
        ],
        maxCompletionTokens: 110,
        reasoningEffort: 'minimal',
        temperature: 0.8,
        stream: false,
        user: anonymousUserId(userId),
      },
    });

    if (!('choices' in completion)) {
      return NextResponse.json({ error: 'The AI service returned an unexpected response. Please try again.' }, { status: 502 });
    }

    const content = completion.choices[0]?.message.content;
    const reply = typeof content === 'string' ? cleanReply(content) : '';

    if (!reply) {
      return NextResponse.json({ error: 'The model returned an empty reply. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch {
    // Do not return or log provider error payloads, which can include operational details.
    console.error('Mask AI reply generation failed.');
    return NextResponse.json({ error: 'Unable to generate a reply right now. Please try again.' }, { status: 502 });
  }
}
