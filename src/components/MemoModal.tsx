"use client";

import { useState } from "react";
import s from "./MemoModal.module.css";

interface Props {
  algorithmId: string;
  title: string;
  initialContent: string;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function MemoModal({ title, initialContent, onClose, onSave, onDelete }: Props) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(content);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("메모를 삭제하시겠습니까?")) return;
    setSaving(true);
    await onDelete();
    setSaving(false);
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>
            <span className={s.titleIcon}>✏️</span>
            {title} 메모
          </h2>
          <button className={s.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        <textarea
          className={s.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`${title}에 대한 메모를 남겨보세요.\n예) 핵심 개념, 시간복잡도, 헷갈리는 부분…`}
          rows={8}
          autoFocus
        />

        <div className={s.footer}>
          {initialContent && (
            <button className={s.deleteBtn} onClick={handleDelete} disabled={saving}>
              삭제
            </button>
          )}
          <div className={s.footerRight}>
            <button className={s.cancelBtn} onClick={onClose} disabled={saving}>
              취소
            </button>
            <button className={s.saveBtn} onClick={handleSave} disabled={saving || content === initialContent}>
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
