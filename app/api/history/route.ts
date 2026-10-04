import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPrisma } from '@/app/utils/prisma';

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to view your history.' }, { status: 401 });

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ history: [], configured: false });

  try {
    const history = await prisma.generation.findMany({
      where: { clerkUserId: userId },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: { id: true, tweetText: true, persona: true, reply: true, createdAt: true },
    });
    return NextResponse.json({ history, configured: true });
  } catch {
    return NextResponse.json({ history: [], configured: false });
  }
}
