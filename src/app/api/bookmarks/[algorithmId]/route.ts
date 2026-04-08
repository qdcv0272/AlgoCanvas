import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// DELETE /api/bookmarks/[algorithmId]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ algorithmId: string }> }) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { algorithmId } = await params;
    await prisma.bookmark.deleteMany({ where: { userId, algorithmId } });
    return NextResponse.json({ message: "삭제되었습니다." });
  } catch {
    return NextResponse.json({ message: "북마크 삭제에 실패했습니다." }, { status: 500 });
  }
}
