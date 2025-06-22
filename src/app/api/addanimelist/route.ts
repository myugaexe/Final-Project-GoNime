import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "You must Log-in" }, { status: 401 });
    }

    const body = await req.json();
    const animeId = Number(body.animeId);
    const { status, score, progress } = body;

    if (!animeId || !status) {
      return NextResponse.json({ error: "animeId and status are required" }, { status: 400 });
    }

    const userId = Number(session.user.id);

    const existingAnime = await db.animeList.findFirst({
      where: {
        animeId,
        userId,
      }
    });
    if (existingAnime) {
      return NextResponse.json({ error: "Anime already exists in the list" }, { status: 409 });
    }

    const animeList = await db.animeList.create({
      data: {
        animeId,
        userId,
        status,
        score,
        progress,
      },
    });

    return NextResponse.json(animeList, { status: 201 });
  } catch (error) {
    console.error("Error adding anime to list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}