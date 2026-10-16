import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useApp } from '../../context/AppContext';
import { Inquiry } from '../../types';

export const MyInquiries: React.FC = () => {
  const { user } = useApp();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchInquiries = async () => {
      const q = query(collection(db, 'inquiries'), where('userId', '==', user.id), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
    };
    fetchInquiries();
  }, [user]);

  return (
    <div className="space-y-4">
      {inquiries.map(i => (
        <div key={i.id} className="p-4 border rounded shadow">
          <h3 className="font-bold">{i.title} [{i.status}]</h3>
          <p className="text-sm">{i.content}</p>
          {i.answer && <p className="mt-2 p-2 bg-slate-100 rounded text-sm">답변: {i.answer}</p>}
        </div>
      ))}
    </div>
  );
};
