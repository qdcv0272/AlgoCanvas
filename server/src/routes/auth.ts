import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const router = Router();

// 회원가입
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, name } = req.body as { username?: string; password?: string; name?: string };

  if (!username || !password || !name) {
    res.status(400).json({ message: "이름, 아이디, 비밀번호를 모두 입력해주세요." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "비밀번호는 8자 이상이어야 합니다." });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    res.status(409).json({ message: "이미 사용 중인 아이디입니다." });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, password: hashed, name: name.trim() },
  });

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.status(201).json({
    token,
    user: { id: user.id, username: user.username, name: user.name },
  });
});

// 로그인
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ message: "아이디와 비밀번호를 입력해주세요." });
    return;
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    return;
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: { id: user.id, username: user.username, name: user.name },
  });
});

export default router;
