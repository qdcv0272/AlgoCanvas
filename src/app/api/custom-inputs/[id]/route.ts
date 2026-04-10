import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// DELETE /api/custom-inputs/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { id } = await params;
    const inputId = parseInt(id, 10);
    if (isNaN(inputId)) return NextResponse.json({ message: "유효하지 않은 ID입니다." }, { status: 400 });

    const existing = await prisma.customInput.findFirst({ where: { id: inputId, userId } });
    if (!existing) return NextResponse.json({ message: "항목을 찾을 수 없습니다." }, { status: 404 });

    await prisma.customInput.delete({ where: { id: inputId } });
    return NextResponse.json({ message: "삭제되었습니다." });
  } catch {
    return NextResponse.json({ message: "커스텀 입력 삭제에 실패했습니다." }, { status: 500 });
  }
}
