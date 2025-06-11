import { NextRequest, NextResponse } from "next/server";

const JIKAN_API_URL = "https://api.jikan.moe/v4/anime";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const genre = searchParams.get("genre");
    const minScore = searchParams.get("minScore");
    const orderBy = searchParams.get("orderBy"); // e.g., "popularity", "score"

    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (genre) params.genres = genre;
    if (minScore) params.min_score = minScore;

    // Always order descending for popularity/score
    if (orderBy === "popularity") {
        params.order_by = "popularity";
        params.sort = "asc"; // Popularity ascending
    } 
    else if (orderBy === "score") {
        params.order_by = "score";
        params.sort = "desc"; // Score descending
    }

    const url = new URL(JIKAN_API_URL);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    try {
        const res = await fetch(url.toString());
        if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch from Jikan API" }, { status: 500 });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching from Jikan API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}