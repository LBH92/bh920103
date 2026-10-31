import React from 'react';
import { Clock } from 'lucide-react';
import { useTime } from '../../context/TimeContext';

interface KstClockProps {
  className?: string;
  showIcon?: boolean;
}

export const KstClock: React.FC<KstClockProps> = ({
  className = "text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/50 flex items-center gap-1.5 whitespace-nowrap",
  showIcon = false,
}) => {
  const { formatted } = useTime();

  return (
    <div className={className} title="한국 표준시 (KST, Asia/Seoul)">
      {showIcon && <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
      <span>{formatted}</span>
    </div>
  );
};
