import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { firebaseRepository } from '../../services/firebaseRepository';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-slot',
  format = 'auto',
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const publisherId = import.meta.env.VITE_ADSENSE_CLIENT;

  useEffect(() => {
    // Only attempt to push ads if VITE_ADSENSE_CLIENT is properly configured and present
    if (publisherId && publisherId.startsWith('ca-pub-')) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setIsLoaded(true);
        firebaseRepository.incrementAdStats(slotId, 'impressions');
      } catch (err) {
        console.warn('[AdSlot] AdSense push error:', err);
      }
    }
  }, [publisherId, slotId]);

  const handleAdClick = () => {
    firebaseRepository.incrementAdStats(slotId, 'clicks');
  };

  // If AdSense client is not configured, show "광고 문의" placeholder
  if (!publisherId || !publisherId.startsWith('ca-pub-')) {
    return (
      <div className={`my-4 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#131722]/50 text-center ${className}`}>
        <p className="text-[11px] font-bold text-slate-500 dark:text-400">광고 문의</p>
      </div>
    );
  }

  return (
    <div onClick={handleAdClick} className={`my-4 p-2 rounded-xl bg-slate-50 dark:bg-[#131722]/80 border border-slate-200/60 dark:border-slate-800 text-center overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-2 pb-1 text-[10px] text-slate-400 font-mono">
        <span>ADVERTISEMENT</span>
        <Info className="w-3 h-3 text-slate-300" />
      </div>
      <div className="min-h-[90px] flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
