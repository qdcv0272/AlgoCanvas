"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiLogin } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import s from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await apiLogin(username, password);
      setAuth(token, user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s["auth-page"]}>
      <div className={s.card}>
        <h1 className={s.title}>AlgoCanvas</h1>
        <p className={s.subtitle}>로그인</p>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label} htmlFor="username">
              아이디
            </label>
            <input id="username" type="text" className={s.input} placeholder="아이디를 입력하세요" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={s.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button type="submit" className={s.submit} disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className={s.footer}>
          계정이 없으신가요?{" "}
          <Link href="/register" className={s.link}>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
