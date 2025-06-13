import { NextResponse } from "next/server";

const BASE_URL = "https://api.jikan.moe/v4/top/anime";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  try {
    const res = await fetch(`${BASE_URL}?page=${page}`);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching anime list:", error);
    return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
  }
}
