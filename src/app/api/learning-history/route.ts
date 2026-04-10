import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// GET /api/learning-history
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const rows = await prisma.learningHistory.findMany({
      where: { userId },
      orderBy: { lastRunAt: "desc" },
      select: { algorithmId: true, runCount: true, lastRunAt: true },
    });
    const result: Record<string, { runCount: number; lastRunAt: string }> = {};
    for (const r of rows) {
      result[r.algorithmId] = { runCount: r.runCount, lastRunAt: r.lastRunAt.toISOString() };
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "인증이 유효하지 않습니다." }, { status: 401 });
  }
}

// POST /api/learning-history  — 실행 횟수 1 증가 + lastRunAt 갱신
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { algorithmId } = (await req.json()) as { algorithmId?: string };
    if (!algorithmId) return NextResponse.json({ message: "algorithmId가 필요합니다." }, { status: 400 });

    const row = await prisma.learningHistory.upsert({
      where: { userId_algorithmId: { userId, algorithmId } },
      create: { userId, algorithmId, runCount: 1, lastRunAt: new Date() },
      update: { runCount: { increment: 1 }, lastRunAt: new Date() },
      select: { algorithmId: true, runCount: true, lastRunAt: true },
    });
    return NextResponse.json({ algorithmId: row.algorithmId, runCount: row.runCount, lastRunAt: row.lastRunAt.toISOString() });
  } catch {
    return NextResponse.json({ message: "학습 기록 저장에 실패했습니다." }, { status: 500 });
  }
}
