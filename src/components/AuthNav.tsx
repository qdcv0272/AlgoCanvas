"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";
import s from "./AuthNav.module.css";

export default function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoggedIn } = useAuthStore();
  const clear = useUserDataStore((s) => s.clear);
  const isHome = pathname === "/";

  const handleLogout = () => {
    logout();
    clear();
    router.push("/");
  };

  if (isLoggedIn() && user) {
    return (
      <nav className={s.nav}>
        <Link href="/" className={s.logo}>
          AlgoCanvas
        </Link>
        <div className={s.spacer} />
        <span className={s.name}>{user.name}님</span>
        <button className={s.logout} onClick={handleLogout}>
          로그아웃
        </button>
      </nav>
    );
  }

  return (
    <nav className={s.nav}>
      <Link href="/" className={s.logo}>
        AlgoCanvas
      </Link>
      <div className={s.spacer} />
      {!isHome && (
        <Link href="/" className={s.home}>
          ← 홈
        </Link>
      )}
      <Link href="/login" className={s.login}>
        로그인
      </Link>
      <Link href="/register" className={s.register}>
        회원가입
      </Link>
    </nav>
  );
}
