import React from 'react';
import { Info, FileText, ShieldCheck } from 'lucide-react';

export const AppInfoView: React.FC = () => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">병돌 인베스트먼트</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Version 1.0.0 (Build 20261025.1)</p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">고객 지원 및 약관</h4>
        
        <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">서비스 이용약관</span>
          </div>
        </a>

        <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">개인정보 처리방침</span>
          </div>
        </a>
      </div>
    </div>
  );
};
