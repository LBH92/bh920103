import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { Inquiry } from '../../../types';

export const AdminInquiriesTab: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      setInquiries(data);
      setLoading(false);
    };
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'processing' | 'answered', answer: string) => {
    await updateDoc(doc(db, 'inquiries', id), { status, answer, updatedAt: new Date().toISOString() });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status, answer } : i));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">문의 관리</h2>
      <div className="space-y-4">
        {inquiries.map(i => (
          <div key={i.id} className="p-4 border rounded shadow">
            <h3 className="font-bold">{i.title} [{i.type}]</h3>
            <p className="text-sm">{i.content}</p>
            <p className="text-xs text-slate-500">작성자: {i.userName} | 상태: {i.status}</p>
            {i.status !== 'answered' && (
              <div className="mt-2">
                <textarea className="w-full border rounded p-2" placeholder="답변 내용" onChange={(e) => { /* simplified for brevity */ }} />
                <button onClick={() => handleUpdateStatus(i.id, 'answered', '답변 내용')} className="bg-blue-500 text-white p-2 rounded">답변 등록</button>
              </div>
            )}
            {i.answer && <p className="mt-2 p-2 bg-slate-100 rounded">답변: {i.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
