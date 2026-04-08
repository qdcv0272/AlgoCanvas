import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json() as { username?: string; password?: string };

  if (!username || !password) {
    return NextResponse.json({ message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = signToken({ userId: user.id, username: user.username });

  return NextResponse.json({ token, user: { id: user.id, username: user.username, name: user.name } });
}
