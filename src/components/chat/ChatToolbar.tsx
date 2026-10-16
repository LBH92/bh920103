import React, { useState, useRef } from 'react';
import { Smile, Image as ImageIcon, X, Upload } from 'lucide-react';

interface ChatToolbarProps {
  onInsertText: (text: string) => void;
  onImageUploaded: (url: string, meta: { fileType: string; fileSize: number; fileName?: string }) => void;
  disabled?: boolean;
}

// Popular Stock & Meme Emojis (주식 테마 짤 / 이모티콘 팩)
const CHAT_EMOJI_CATEGORIES = [
  {
    name: '📈 투자/상승',
    emojis: ['🚀', '📈', '🔥', '💰', '💎🙌', '🐂', '🔥상한가', '💸수익', '🎉', '💯'],
  },
  {
    name: '📉 하락/위기',
    emojis: ['📉', '🐻', '🥶', '😱', '💧', '😭', '💀', '📉폭락', '⚠️', '🚨'],
  },
  {
    name: '☕ 일상/반응',
    emojis: ['☕', '👀', '👍', '🙏', '👏', '🤔', '😎', '🤣', '😴', '✨'],
  },
];

export const ChatToolbar: React.FC<ChatToolbarProps> = ({
  onInsertText,
  onImageUploaded,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file selection
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

  // Upload image to server
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

      onImageUploaded(data.url, {
        fileType: data.meta.fileType,
        fileSize: data.meta.fileSize,
        fileName: data.meta.fileName,
      });
    } catch (err: any) {
      console.warn('[ChatToolbar] Upload error:', err);
      alert(err.message || '이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative flex items-center gap-1.5 py-1">
      {/* Emoji Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (!disabled) setIsOpen(!isOpen);
          }}
          disabled={disabled}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
          title="이모티콘 & 주식 짤 선택"
        >
          <Smile className="w-4 h-4 text-amber-500" />
        </button>

        {/* Emoji Selector Popover */}
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <span>💬 증시 이모티콘 & 밈 팩</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {CHAT_EMOJI_CATEGORIES.map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400">{cat.name}</div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {cat.emojis.map(emo => (
                      <button
                        type="button"
                        key={emo}
                        onClick={() => {
                          onInsertText(emo);
                          setIsOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-500/20 text-sm sm:text-base text-center transition-colors cursor-pointer flex items-center justify-center"
                        title={emo}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Upload Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        disabled={disabled || isUploading}
        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1"
        title="이미지 또는 짤(GIF/PNG/JPG) 업로드"
      >
        <ImageIcon className={`w-4 h-4 text-indigo-500 ${isUploading ? 'animate-bounce' : ''}`} />
        {isUploading && <span className="text-[10px] text-indigo-500 font-mono">업로드중...</span>}
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
