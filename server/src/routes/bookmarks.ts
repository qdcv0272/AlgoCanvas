import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/authenticate";

const router = Router();
router.use(authenticate);

// 내 북마크 목록 조회
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: "asc" },
    });
    res.json(bookmarks.map((b) => b.algorithmId));
  } catch {
    res.status(500).json({ message: "북마크를 불러오지 못했습니다." });
  }
});

// 북마크 추가
router.post("/", async (req: AuthRequest, res: Response) => {
  const { algorithmId } = req.body as { algorithmId?: string };
  if (!algorithmId) {
    res.status(400).json({ message: "algorithmId가 필요합니다." });
    return;
  }

  try {
    await prisma.bookmark.upsert({
      where: { userId_algorithmId: { userId: req.userId!, algorithmId } },
      create: { userId: req.userId!, algorithmId },
      update: {},
    });
    res.status(201).json({ algorithmId });
  } catch {
    res.status(500).json({ message: "북마크 저장에 실패했습니다." });
  }
});

// 북마크 삭제
router.delete("/:algorithmId", async (req: AuthRequest, res: Response) => {
  const algorithmId = req.params.algorithmId as string;
  try {
    await prisma.bookmark.deleteMany({
      where: { userId: req.userId!, algorithmId },
    });
    res.json({ message: "삭제되었습니다." });
  } catch {
    res.status(500).json({ message: "북마크 삭제에 실패했습니다." });
  }
});

export default router;
