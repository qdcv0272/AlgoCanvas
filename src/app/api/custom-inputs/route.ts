import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// GET /api/custom-inputs?algorithmId=xxx
export async function GET(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const algorithmId = req.nextUrl.searchParams.get("algorithmId");
    if (!algorithmId) return NextResponse.json({ message: "algorithmId가 필요합니다." }, { status: 400 });

    const inputs = await prisma.customInput.findMany({
      where: { userId, algorithmId },
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, data: true, createdAt: true },
    });
    return NextResponse.json(inputs);
  } catch {
    return NextResponse.json({ message: "인증이 유효하지 않습니다." }, { status: 401 });
  }
}

// POST /api/custom-inputs
export async function POST(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });

  try {
    const { userId } = verifyToken(token);
    const { algorithmId, label, data } = (await req.json()) as {
      algorithmId?: string;
      label?: string;
      data?: string;
    };

    if (!algorithmId || !label || !data) {
      return NextResponse.json({ message: "algorithmId, label, data가 모두 필요합니다." }, { status: 400 });
    }

    const input = await prisma.customInput.create({
      data: { userId, algorithmId, label, data },
      select: { id: true, label: true, data: true, createdAt: true },
    });
    return NextResponse.json(input, { status: 201 });
  } catch {
    return NextResponse.json({ message: "커스텀 입력 저장에 실패했습니다." }, { status: 500 });
  }
}
