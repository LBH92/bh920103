import React from 'react';
import { Sparkles, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const ChatImageTestPanel: React.FC = () => {
  const [testStatus, setTestStatus] = React.useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResultUrl, setTestResultUrl] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleRunTest = async () => {
    setTestStatus('testing');
    setErrorMessage(null);
    try {
      // Create a small 1x1 valid red PNG buffer / Blob for testing upload
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('TEST GIF', 15, 55);
      }

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setTestStatus('error');
          setErrorMessage('테스트 이미지 생성 실패');
          return;
        }

        const file = new File([blob], 'test_meme.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('image', file);
        const uid = sessionStorage.getItem('bd_user_uid') || 'admin_test_uid';
        formData.append('uid', uid);

        const res = await fetch('/api/chat/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || '업로드 API 응답 오류');
        }

        setTestResultUrl(data.url);
        setTestStatus('success');
      }, 'image/png');
    } catch (err: any) {
      console.warn('[ChatImageTestPanel] Test error:', err);
      setTestStatus('error');
      setErrorMessage(err.message || '업로드 테스트 중 예외 발생');
    }
  };

  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
          <span>채팅 이미지 업로드 진단 테스트</span>
        </span>
        <button
          type="button"
          onClick={handleRunTest}
          disabled={testStatus === 'testing'}
          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer disabled:opacity-40"
        >
          {testStatus === 'testing' ? '테스트 중...' : '업로드 테스트 실행'}
        </button>
      </div>

      {testStatus === 'success' && testResultUrl && (
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-1.5">
          <div className="flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>이미지 업로드 & 서버 저장 성공!</span>
          </div>
          <div className="flex items-center gap-2">
            <img src={testResultUrl} alt="테스트 이미지" className="w-12 h-12 rounded object-cover border" />
            <span className="text-[10px] font-mono truncate">{testResultUrl}</span>
          </div>
        </div>
      )}

      {testStatus === 'error' && (
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold">
          업로드 테스트 실패: {errorMessage}
        </div>
      )}
    </div>
  );
};
