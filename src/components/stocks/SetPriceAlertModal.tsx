import React, { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SetPriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  symbolName: string;
  currentPrice: number;
}

export const SetPriceAlertModal: React.FC<SetPriceAlertModalProps> = ({
  isOpen,
  onClose,
  symbol,
  symbolName,
  currentPrice,
}) => {
  const { showToast, firebaseUser } = useApp();
  const [targetPrice, setTargetPrice] = useState<number>(currentPrice);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          symbol,
          symbolName,
          type: 'price_target',
          condition,
          value: targetPrice,
          enabled: true,
        }),
      });

      if (!response.ok) throw new Error('알림 설정에 실패했습니다.');

      showToast(`[${symbolName}] 목표가 ${targetPrice.toLocaleString()}원 ${condition === 'above' ? '이상' : '이하'} 알림이 설정되었습니다.`, 'success');
      onClose();
    } catch (err) {
      showToast('알림 설정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            목표가 알림 설정
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">대상 종목</label>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {symbolName} ({symbol})
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">조건</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`px-3 py-2 rounded-lg text-xs font-bold ${condition === 'above' ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                가격 상승 (이상)
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`px-3 py-2 rounded-lg text-xs font-bold ${condition === 'below' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                가격 하락 (이하)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">목표가</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors"
          >
            {isSubmitting ? '설정 중...' : '알림 설정하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
