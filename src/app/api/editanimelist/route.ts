import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "You must Log-in" }, { status: 401 });
    }

    const userId = Number(session.user.id);

    //const userId = 1; // For testing purposes, replace with session.user.id in production

    const body = await req.json();
    const { animeId, status, score, progress } = body;

    if (!animeId || !userId || !status) {
      return NextResponse.json({ error: "animeId, userId, and status are required" }, { status: 400 });
    }

    interface updateDataProps {
      status?: string;
      score?: number | null;
      progress?: number | null;
    }

    const updateData: updateDataProps = {};
    if (status !== undefined) updateData.status = status;
    if (score !== undefined) updateData.score = score;
    if (progress !== undefined) updateData.progress = progress;

    if (status === "Completed") updateData.progress = 100;
    if (status === "Plan To Watch") updateData.progress = null;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.animeList.updateMany({
        where: { animeId, userId },
        data: updateData
    });

    return NextResponse.json({ "Data update successed ": updated }, { status: 201 });
  } catch (error) {
    console.error("Error editing anime:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}