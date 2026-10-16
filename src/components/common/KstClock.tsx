import React, { useState, useEffect } from 'react';
import { formatKST } from '../../utils/dateUtils';

export const KstClock: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(formatKST(new Date()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/50">
      {time}
    </div>
  );
};
