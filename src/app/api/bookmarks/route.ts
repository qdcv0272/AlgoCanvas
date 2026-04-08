import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// GET /api/bookmarks
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(bookmarks.map((b) => b.algorithmId));
  } catch {
    return NextResponse.json({ message: "인증이 유효하지 않습니다." }, { status: 401 });
  }
}

// POST /api/bookmarks
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { algorithmId } = (await req.json()) as { algorithmId?: string };
    if (!algorithmId) return NextResponse.json({ message: "algorithmId가 필요합니다." }, { status: 400 });

    await prisma.bookmark.upsert({
      where: { userId_algorithmId: { userId, algorithmId } },
      create: { userId, algorithmId },
      update: {},
    });
    return NextResponse.json({ algorithmId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "북마크 저장에 실패했습니다." }, { status: 500 });
  }
}
