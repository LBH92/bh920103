import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useApp } from '../../context/AppContext';

export const InquiryForm: React.FC = () => {
  const { user, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'account' | 'technical' | 'market' | 'other'>('other');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        userId: user.id,
        userName: user.name,
        type,
        title,
        content,
        contact,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      showToast('문의가 접수되었습니다.', 'success');
      setTitle('');
      setContent('');
      setContact('');
    } catch (e) {
      showToast('문의 접수에 실패했습니다.', 'error');
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border p-2 rounded">
        <option value="other">기타</option>
        <option value="account">계정 문의</option>
        <option value="technical">기술 문의</option>
        <option value="market">시장 데이터 문의</option>
      </select>
      <input type="text" placeholder="제목" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-2 rounded" />
      <textarea placeholder="내용" value={content} onChange={e => setContent(e.target.value)} required className="w-full border p-2 rounded" rows={4} />
      <input type="text" placeholder="연락처 (선택)" value={contact} onChange={e => setContact(e.target.value)} className="w-full border p-2 rounded" />
      <button type="submit" disabled={submitting} className="bg-rose-600 text-white p-2 rounded w-full">제출하기</button>
    </form>
  );
};
