import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import bookmarksRouter from "./routes/bookmarks";
import memosRouter from "./routes/memos";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT ?? 3002;

app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/bookmarks", bookmarksRouter);
app.use("/api/memos", memosRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
