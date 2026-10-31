import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthLoading, showToast, setActiveTab, activeTab, isAdmin } = useApp();

  useEffect(() => {
    if (isAuthLoading) return;

    if (activeTab === 'admin' && !isAdmin) {
      setActiveTab('home');
      showToast('관리자 전용 영역입니다. 인가된 관리자 계정만 접근할 수 있습니다.', 'warning');
    }
  }, [isAuthLoading, isAdmin, activeTab, setActiveTab, showToast]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c0f17]">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};
