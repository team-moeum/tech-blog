import { NextResponse } from "next/server";
import { getArticleInfoList } from "@/api/notion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const role = searchParams.get("role");

  try {
    const { articles, nextCursor } = await getArticleInfoList(
      false,
      role as string,
      cursor as string
    );
    return NextResponse.json({ articles, nextCursor });
  } catch (error) {
    console.error("API Error:", error);
  }
}
