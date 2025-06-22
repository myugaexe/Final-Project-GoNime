import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
      if (!session || !session.user || !session.user.id) {
         return NextResponse.json({ error: "You must Log-in" }, { status: 401 });
     }

     const userId = Number(session.user.id);

    const body = await req.json();
    const { animeId } = body;

    if (!animeId || !userId) {
      return NextResponse.json({ error: "animeId and userId are required" }, { status: 400 });
    }
    
    const existingAnime = await db.animeList.findFirst({
        where: {
            animeId,
            userId,
        }
    })
    if (!existingAnime) {
      return NextResponse.json({ error: "Anime dont exists in the list" }, { status: 409 });
    }
    
    const deleted = await db.animeList.deleteMany({
        where: { animeId, userId }
    });

    return NextResponse.json({ "Delete anime successed ": deleted }, { status: 201 });
  } catch (error) {
    console.error("Error deleting anime from list:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}