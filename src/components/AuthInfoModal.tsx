"use client";

import { useState, useSyncExternalStore } from "react";
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

// useSyncExternalStore로 클라이언트 마운트 여부를 감지한다.
// 이유: useState + useEffect로 mounted를 관리하면 ESLint React 컴파일러가
// "effect 내부에서 setState 동기 호출" 오류를 발생시킨다.
// useSyncExternalStore는 서버 snapshot(false)과 클라이언트 snapshot(true)을
// 분리할 수 있어서 Hydration mismatch 없이 CSR 전용 UI를 안전하게 렌더링할 수 있다.
const subscribe = () => () => {};

export default function AuthInfoModal() {
  // dismissed: 사용자가 모달을 닫았는지 여부 (false = 열림, true = 닫힘)
  const [dismissed, setDismissed] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const mounted = useSyncExternalStore(
    subscribe, // 외부 상태 변화 구독 없음 (빈 구독)
    () => true, // 클라이언트: 마운트됨
    () => false, // 서버(SSR): 마운트 안 됨 → 렌더 스킵
  );

  // 서버 렌더 또는 로그인 상태면 표시하지 않음
  if (!mounted || isLoggedIn()) return null;

  // dismissed 상태를 open/close 의미로 반전해서 사용
  const open = !dismissed;

  return (
    <>
      <button className={s.banner} onClick={() => setDismissed(false)}>
        <span>✨</span>
        <span>로그인하면 더 많은 기능을 사용할 수 있어요</span>
        <span>→</span>
      </button>

      {open && (
        <div className={s.overlay} onClick={() => setDismissed(true)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.header}>
              <h2 className={s.title}>회원 전용 기능</h2>
              <button className={s.closeBtn} onClick={() => setDismissed(true)}>
                ✕
              </button>
            </div>

            <div className={s.body}>
              <p className={s.desc}>
                로그인하면 학습 데이터를 저장하고 나만의 학습 기록을 관리할 수 있어요.
                <br />
                <span className={s.testSize}>
                  테스트 아이디 & 비번 <br />
                  ID: test <br />
                  password: test1234
                </span>
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
                <Link href="/login" className={s.btnLogin} onClick={() => setDismissed(true)}>
                  로그인
                </Link>
                <Link href="/register" className={s.btnRegister} onClick={() => setDismissed(true)}>
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
