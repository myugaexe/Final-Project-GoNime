import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "You must Log-in" }, { status: 401 });
     }

    const userId = Number(session.user.id);

    if (!userId) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const animeList = await prisma.animeList.findMany({
            where: { userId },
            select: { animeId: true, progress: true },
            take: 5,
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const totalAnime = animeList.length;
        const totalEpisodesWatched = animeList.reduce(
        (sum, item) => sum + (item.progress ?? 0),
        0
        );

        return NextResponse.json({
        userId: userId,
        username: user.username,
        totalAnime,
        totalEpisodesWatched,
        lastUpdates: animeList
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 });
    }
}
