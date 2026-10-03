import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createLLMClient } from '@/app/utils/llmClient';

const personaInstructions: Record<string, string> = {
  insightful: 'insightful and supportive, adding a specific perspective or useful nuance',
  bold: 'bold and visionary, confident without being performative',
  humorous: 'witty and light-hearted, with a smart understated punchline',
  professional: 'professional and credible, with clear expertise and restraint',
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to generate a reply.' }, { status: 401 });

  try {
    const body = await request.json();
    const tweetUrl = typeof body.tweetUrl === 'string' ? body.tweetUrl.trim() : '';
    const tweetText = typeof body.tweetText === 'string' ? body.tweetText.trim() : '';
    const persona = typeof body.persona === 'string' ? body.persona : 'insightful';
    const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';

    if (!tweetUrl && !tweetText) return NextResponse.json({ error: 'Add a post URL or paste the post text first.' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: 'Add your OpenRouter or Groq key to continue.' }, { status: 400 });

    const { client, provider } = createLLMClient(apiKey);
    const context = [tweetUrl ? `Post URL: ${tweetUrl}` : '', tweetText ? `Post text: ${tweetText}` : ''].filter(Boolean).join('\n');
    const systemPrompt = `You are a social media engagement expert. Write one thoughtful reply to the supplied post. The reply should be ${personaInstructions[persona] || personaInstructions.insightful}. Make the original poster want to follow the writer by being genuinely useful or distinctive, never flattering without substance. Keep it under 280 characters, use no hashtags, no quotation marks around the reply, no prefatory explanation, and sound natural.`;

    const completion = await client.chat.completions.create({
      model: provider === 'openrouter' ? 'meta-llama/llama-3.1-70b-instruct' : 'llama3-70b-8192',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: context }],
      max_tokens: 150,
      temperature: 0.8,
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: 'The model returned an empty reply. Try again.' }, { status: 502 });
    return NextResponse.json({ reply: reply.replace(/^['"]|['"]$/g, '') });
  } catch (error) {
    console.error('Mask AI generation error', error);
    const message = error instanceof Error ? error.message : 'Unable to generate a reply right now.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
