import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// GET /api/user-data  — 북마크·메모·학습기록을 한 번에 반환
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);

    const [bookmarkRows, memoRows, historyRows] = await Promise.all([
      prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
      prisma.memo.findMany({ where: { userId } }),
      prisma.learningHistory.findMany({
        where: { userId },
        orderBy: { lastRunAt: "desc" },
        select: { algorithmId: true, runCount: true, lastRunAt: true },
      }),
    ]);

    const memos: Record<string, string> = {};
    for (const m of memoRows) memos[m.algorithmId] = m.content;

    const history: Record<string, { runCount: number; lastRunAt: string }> = {};
    for (const r of historyRows) {
      history[r.algorithmId] = { runCount: r.runCount, lastRunAt: r.lastRunAt.toISOString() };
    }

    return NextResponse.json({
      bookmarks: bookmarkRows.map((b) => b.algorithmId),
      memos,
      history,
    });
  } catch {
    return NextResponse.json({ message: "인증이 유효하지 않습니다." }, { status: 401 });
  }
}
