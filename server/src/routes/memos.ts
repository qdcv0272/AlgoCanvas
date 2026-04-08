import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();
router.use(authenticate);

// 내 메모 전체 조회 (algorithmId → content 맵)
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const memos = await prisma.memo.findMany({ where: { userId: req.userId! } });
    const result: Record<string, string> = {};
    for (const m of memos) result[m.algorithmId] = m.content;
    res.json(result);
  } catch {
    res.status(500).json({ message: "메모를 불러오지 못했습니다." });
  }
});

// 메모 저장 (없으면 생성, 있으면 업데이트)
router.post("/", async (req: AuthRequest, res: Response) => {
  const { algorithmId, content } = req.body as { algorithmId?: string; content?: string };
  if (!algorithmId || content === undefined) {
    res.status(400).json({ message: "algorithmId와 content가 필요합니다." });
    return;
  }

  try {
    const memo = await prisma.memo.upsert({
      where: { userId_algorithmId: { userId: req.userId!, algorithmId } },
      create: { userId: req.userId!, algorithmId, content },
      update: { content },
    });
    res.json({ algorithmId: memo.algorithmId, content: memo.content });
  } catch {
    res.status(500).json({ message: "메모 저장에 실패했습니다." });
  }
});

// 메모 삭제
router.delete("/:algorithmId", async (req: AuthRequest, res: Response) => {
  const algorithmId = req.params.algorithmId as string;
  try {
    await prisma.memo.deleteMany({ where: { userId: req.userId!, algorithmId } });
    res.json({ message: "삭제되었습니다." });
  } catch {
    res.status(500).json({ message: "메모 삭제에 실패했습니다." });
  }
});

export default router;
