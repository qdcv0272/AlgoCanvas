import React from "react";
import s from "./guideModal.module.css";

interface GuideModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function GuideModal({ title, onClose, children }: GuideModalProps) {
  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>{title}</h2>
          <button className={s.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={s.modalBody}>{children}</div>
        <div className={s.modalFooter}>
          <button className={s.modalStartBtn} onClick={onClose}>
            시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
