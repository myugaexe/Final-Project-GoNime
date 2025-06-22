import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "You must Log-in" }, { status: 401 });
  }
  
  const userId = Number(session.user.id);

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const animeList = await db.animeList.findMany({
      where: { userId },
      select: { animeId: true, status: true }
    });

    const detailedAnime = await Promise.all(
      animeList.map(async (anime) => {
        try {
          const res = await fetch(`https://api.jikan.moe/v4/anime/${anime.animeId}`);
          const jikanData = await res.json();
          return {
            ...anime,
            title: jikanData.data.title,
            image_url: jikanData.data.images.jpg.image_url,
            studios: jikanData.data.studios,
            aired: jikanData.data.aired.string,
          };
        } catch (error) {
          console.error(`Failed to fetch from Jikan for ID ${anime.animeId}`, error);
          return null;
        }
      })
    );

    const result = detailedAnime.filter((a) => a !== null);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching anime list for user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
