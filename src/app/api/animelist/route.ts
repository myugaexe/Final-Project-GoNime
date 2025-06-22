import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "You must log in." }, { status: 401 });
  }

  const userId = Number(session.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
  }

  try {
    const animeList = await db.animeList.findMany({
    where: { userId },
    select: { animeId: true, status: true, progress: true, score: true,},
  });


    const detailedAnime = [];

    for (const anime of animeList) {
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${anime.animeId}`);
        const jikanData = await res.json();

        if (jikanData?.data) {
          detailedAnime.push({
            animeId: anime.animeId,
            status: anime.status,
            progress: anime.progress ?? 0,
            score: anime.score ?? 0, 
            title: jikanData.data.title,
            image_url: jikanData.data.images?.jpg?.image_url || '',
            studios: jikanData.data.studios || [],
            aired: jikanData.data.aired?.string || 'Unknown',
          });
        } else {
          console.warn(`Invalid Jikan response for ID ${anime.animeId}`, jikanData);
        }
      } catch (error) {
        console.error(`Failed to fetch from Jikan for ID ${anime.animeId}`, error);
      }

      await delay(750);
    }

    return NextResponse.json(detailedAnime, { status: 200 });
  } catch (error) {
    console.error("Error fetching anime list for user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
