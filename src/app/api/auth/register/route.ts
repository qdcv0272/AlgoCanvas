import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password, name } = (await req.json()) as { username?: string; password?: string; name?: string };

  if (!username || !password || !name) {
    return NextResponse.json({ message: "이름, 아이디, 비밀번호를 모두 입력해주세요." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return NextResponse.json({ message: "이미 사용 중인 아이디입니다." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, name: name.trim() },
  });

  const token = signToken({ userId: user.id, username: user.username });

  return NextResponse.json({ token, user: { id: user.id, username: user.username, name: user.name } }, { status: 201 });
}
