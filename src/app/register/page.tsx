"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRegister } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import s from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await apiRegister(email, password, name);
      setAuth(token, user);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s["auth-page"]}>
      <div className={s.card}>
        <h1 className={s.title}>AlgoCanvas</h1>
        <p className={s.subtitle}>회원가입</p>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.field}>
            <label className={s.label} htmlFor="name">
              이름
            </label>
            <input id="name" type="text" className={s.input} placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="email">
              이메일
            </label>
            <input id="email" type="email" className={s.input} placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className={s.input}
              placeholder="8자 이상 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {error && <p className={s.error}>{error}</p>}

          <button type="submit" className={s.submit} disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className={s.footer}>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className={s.link}>
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
