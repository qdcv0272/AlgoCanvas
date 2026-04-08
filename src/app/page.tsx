import AuthInfoModal from "@/components/AuthInfoModal";
import AlgoGrid from "@/components/AlgoGrid";
import s from "./page.module.css";

export default function Home() {
  return (
    <main className={s.page}>
      <div className={s.hero}>
        <h1 className={s.title}>AlgoCanvas</h1>
        <p className={s.subtitle}>알고리즘 시각화</p>
        <AuthInfoModal />
      </div>

      <AlgoGrid />
    </main>
  );
}
