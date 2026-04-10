"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserDataStore } from "@/store/userDataStore";
import { CustomInputItem } from "@/lib/api";
import s from "./CustomInputModal.module.css";

interface Props {
  algorithmId: string;
  title: string;
  placeholder: string;
  /** 텍스트 입력값 → 알고리즘에 맞는 형태로 변환·적용 */
  onLoad: (data: string) => void;
  onClose: () => void;
}

export default function CustomInputModal({ algorithmId, title, placeholder, onLoad, onClose }: Props) {
  const { token } = useAuthStore();
  const { customInputs, fetchCustomInputs, saveCustomInput, deleteCustomInput } = useUserDataStore();

  const [inputText, setInputText] = useState("");
  const [labelText, setLabelText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const savedList: CustomInputItem[] = customInputs[algorithmId] ?? [];

  useEffect(() => {
    if (token) fetchCustomInputs(token, algorithmId);
  }, [token, algorithmId, fetchCustomInputs]);

  const handleSave = async () => {
    if (!token) return;
    if (!inputText.trim()) {
      setError("입력값을 작성해주세요.");
      return;
    }
    if (!labelText.trim()) {
      setError("저장 이름을 입력해주세요.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveCustomInput(token, algorithmId, labelText.trim(), inputText.trim());
      setLabelText("");
    } catch {
      setError("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = (item: CustomInputItem) => {
    onLoad(item.data);
    onClose();
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    await deleteCustomInput(token, id, algorithmId);
  };

  const handleApply = () => {
    if (!inputText.trim()) {
      setError("입력값을 작성해주세요.");
      return;
    }
    setError("");
    onLoad(inputText.trim());
    onClose();
  };

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.header}>
          <h2 className={s.title}>
            <span>📥</span>
            {title} 커스텀 입력
          </h2>
          <button className={s.closeBtn} onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>

        {/* 입력 필드 */}
        <div className={s.inputArea}>
          <label className={s.label}>입력값</label>
          <input className={s.textInput} value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={placeholder} />
        </div>

        {error && <p className={s.error}>{error}</p>}

        {/* 저장 (로그인 시) */}
        {token && (
          <div className={s.saveRow}>
            <input className={`${s.textInput} ${s.labelInput}`} value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="저장 이름 (예: 역순 배열)" />
            <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "저장 중…" : "💾 저장"}
            </button>
          </div>
        )}

        <button className={s.applyBtn} onClick={handleApply}>
          ▶ 적용
        </button>

        {/* 저장된 목록 */}
        {savedList.length > 0 && (
          <div className={s.savedSection}>
            <p className={s.savedTitle}>저장된 입력</p>
            <ul className={s.savedList}>
              {savedList.map((item) => (
                <li key={item.id} className={s.savedItem}>
                  <div className={s.savedMeta}>
                    <span className={s.savedLabel}>{item.label}</span>
                    <span className={s.savedData}>{item.data}</span>
                  </div>
                  <div className={s.savedActions}>
                    <button className={s.loadBtn} onClick={() => handleLoad(item)}>
                      불러오기
                    </button>
                    <button className={s.deleteSavedBtn} onClick={() => handleDelete(item.id)}>
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
