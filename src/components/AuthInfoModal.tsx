"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import s from "./AuthInfoModal.module.css";

const FEATURES = [
  {
    icon: "💾",
    name: "커스텀 입력 저장",
    desc: "내가 입력한 배열·그래프 데이터를 저장해두고 나중에 불러올 수 있어요.",
  },
  {
    icon: "📈",
    name: "학습 진도 기록",
    desc: "어떤 알고리즘을 몇 번 실행했는지 히스토리로 확인할 수 있어요.",
  },
  {
    icon: "🔖",
    name: "알고리즘 북마크",
    desc: "즐겨찾는 알고리즘에 북마크를 달고 메모를 남길 수 있어요.",
  },
];

export default function AuthInfoModal() {
  const [open, setOpen] = useState(true);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn()) return null;

  return (
    <>
      <button className={s.banner} onClick={() => setOpen(true)}>
        <span>✨</span>
        <span>로그인하면 더 많은 기능을 사용할 수 있어요</span>
        <span>→</span>
      </button>

      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.header}>
              <h2 className={s.title}>회원 전용 기능</h2>
              <button className={s.closeBtn} onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>

            <div className={s.body}>
              <p className={s.desc}>
                로그인하면 학습 데이터를 저장하고 나만의 학습 기록을 관리할 수 있어요.
                <br />
                지금 무료로 가입해보세요!
              </p>

              <ul className={s.featureList}>
                {FEATURES.map((f) => (
                  <li key={f.name} className={s.feature}>
                    <span className={s.featureIcon}>{f.icon}</span>
                    <div className={s.featureText}>
                      <span className={s.featureName}>{f.name}</span>
                      <span className={s.featureDesc}>{f.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={s.actions}>
                <Link href="/login" className={s.btnLogin} onClick={() => setOpen(false)}>
                  로그인
                </Link>
                <Link href="/register" className={s.btnRegister} onClick={() => setOpen(false)}>
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
