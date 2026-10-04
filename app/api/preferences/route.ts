import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPrisma } from '@/app/utils/prisma';

export const runtime = 'nodejs';
const validPersonas = new Set(['insightful', 'bold', 'humorous', 'professional']);

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to view preferences.' }, { status: 401 });
  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ defaultPersona: 'insightful', configured: false });

  try {
    const preference = await prisma.userPreference.findUnique({ where: { clerkUserId: userId } });
    return NextResponse.json({ defaultPersona: preference?.defaultPersona || 'insightful', configured: true });
  } catch {
    return NextResponse.json({ defaultPersona: 'insightful', configured: false });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Sign in to save preferences.' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const defaultPersona = typeof body.defaultPersona === 'string' ? body.defaultPersona : '';
  if (!validPersonas.has(defaultPersona)) return NextResponse.json({ error: 'Choose a supported reply voice.' }, { status: 400 });

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ defaultPersona, configured: false });

  try {
    await prisma.userPreference.upsert({
      where: { clerkUserId: userId },
      create: { clerkUserId: userId, defaultPersona },
      update: { defaultPersona },
    });
    return NextResponse.json({ defaultPersona, configured: true });
  } catch {
    return NextResponse.json({ error: 'Unable to save your preference right now.' }, { status: 503 });
  }
}
