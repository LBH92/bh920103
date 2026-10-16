import React from 'react';
import { InquiryForm } from '../user/InquiryForm';
import { MyInquiries } from '../user/MyInquiries';
import { useApp } from '../../context/AppContext';

export const InquiryPage: React.FC = () => {
  const { user, requireAuth } = useApp();

  if (!user) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-xl font-bold">로그인이 필요합니다</h2>
        <button onClick={() => requireAuth('문의하기')} className="bg-rose-600 text-white p-3 rounded-xl w-full font-bold">로그인 후 문의하기</button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black">고객센터</h1>
      <p className="text-sm text-slate-500">서비스 이용 중 궁금한 점이나 불편 사항을 문의해 주세요.</p>
      
      <div className="p-6 bg-white dark:bg-[#131722] border rounded-2xl">
        <h2 className="font-bold text-lg mb-4">문의 작성</h2>
        <InquiryForm />
      </div>

      <div className="p-6 bg-white dark:bg-[#131722] border rounded-2xl">
        <h2 className="font-bold text-lg mb-4">내 문의 내역</h2>
        <MyInquiries />
      </div>
    </div>
  );
};
