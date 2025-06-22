import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const userId = 1; 

        const user = await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const lastUpdates = await db.animeList.findMany({
            where: { userId: userId },
            orderBy: { id: "desc" }, 
            take: 5
        });

        return NextResponse.json({
            user,
            lastUpdates
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
