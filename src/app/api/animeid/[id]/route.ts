import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime detail" },
      { status: 500 }
    );
  }
}
