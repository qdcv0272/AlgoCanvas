import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = Router();

// 회원가입
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !password || !name) {
    res.status(400).json({ message: "이름, 이메일, 비밀번호를 모두 입력해주세요." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "비밀번호는 8자 이상이어야 합니다." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "유효하지 않은 이메일 형식입니다." });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name: name.trim() },
  });

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
