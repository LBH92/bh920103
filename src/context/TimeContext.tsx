import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatKST } from '../utils/dateUtils';

interface TimeContextType {
  now: Date;
  formatted: string;
}

const TimeContext = createContext<TimeContextType | null>(null);

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [now, setNow] = useState(() => new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TimeContext.Provider value={{ now, formatted: formatKST(now) }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) throw new Error('useTime must be used within TimeProvider');
  return context;
};
