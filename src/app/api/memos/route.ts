import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// GET /api/memos
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const memos = await prisma.memo.findMany({ where: { userId } });
    const result: Record<string, string> = {};
    for (const m of memos) result[m.algorithmId] = m.content;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "인증이 유효하지 않습니다." }, { status: 401 });
  }
}

// POST /api/memos
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { algorithmId, content } = await req.json() as { algorithmId?: string; content?: string };
    if (!algorithmId || content === undefined) {
      return NextResponse.json({ message: "algorithmId와 content가 필요합니다." }, { status: 400 });
    }

    const memo = await prisma.memo.upsert({
      where: { userId_algorithmId: { userId, algorithmId } },
      create: { userId, algorithmId, content },
      update: { content },
    });
    return NextResponse.json({ algorithmId: memo.algorithmId, content: memo.content });
  } catch {
    return NextResponse.json({ message: "메모 저장에 실패했습니다." }, { status: 500 });
  }
}
