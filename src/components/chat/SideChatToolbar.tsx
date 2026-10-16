import React, { useState, useRef } from 'react';
import { Smile, Image as ImageIcon, X } from 'lucide-react';

interface SideChatToolbarProps {
  onInsertText: (text: string) => void;
  onImageUploaded: (url: string) => void;
  disabled?: boolean;
}

const EMOJI_PACK = ['🚀', '📈', '🔥', '💰', '💎🙌', '🐂', '🔥상한가', '💸수익', '📉', '🐻', '🥶', '😱', '☕', '👀', '👍', '🙏', '🎉'];

export const SideChatToolbar: React.FC<SideChatToolbarProps> = ({
  onInsertText,
  onImageUploaded,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('이미지 용량은 20MB 이하만 업로드 가능합니다.');
      return;
    }

    await uploadImageFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadImageFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uid = sessionStorage.getItem('bd_user_uid') || 'anonymous';
      formData.append('uid', uid);

      const res = await fetch('/api/chat/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '이미지 업로드에 실패했습니다.');
      }

      onImageUploaded(data.url);
    } catch (err: any) {
      console.warn('[SideChatToolbar] Upload error:', err);
      alert(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1">
      {/* Emoji Toggle */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (!disabled) setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
          title="이모티콘 & 주식 짤 선택"
        >
          <Smile className="w-4 h-4 text-amber-500" />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-900 dark:text-white">증시 이모티콘 팩</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
              {EMOJI_PACK.map(emo => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => {
                    onInsertText(emo);
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-xs sm:text-sm text-center transition-colors cursor-pointer"
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <button
        type="button"
        onClick={() => {
          if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        disabled={disabled || isUploading}
        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 flex items-center gap-1"
        title="이미지 또는 짤 업로드"
      >
        <ImageIcon className={`w-4 h-4 text-indigo-500 ${isUploading ? 'animate-bounce' : ''}`} />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
