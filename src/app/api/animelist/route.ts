import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { animeId, status, progress, score } = body;

    const animeEntry = await db.animeList.upsert({
      where: {
        animeId_userId: {
          animeId: animeId,
          userId: user.id
        }
      },
      update: {
        status,
        progress,
        score
      },
      create: {
        animeId: animeId,
        userId: user.id,
        status,
        progress,
        score
      }
    });

    return NextResponse.json({ message: 'Anime saved successfully', animeEntry });
  } catch (err) {
    console.error('Error saving anime:', err);
    return NextResponse.json({ error: 'Failed to save anime' }, { status: 500 });
  }
}
