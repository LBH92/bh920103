import React from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { firebaseRepository } from '../../services/firebaseRepository';

interface AdminChatControlProps {
  roomId: string;
  roomName: string;
  count: number;
  adminUid: string;
  onClearHistory: () => void;
  onDeleteRoom: () => void;
}

export const AdminChatControl: React.FC<AdminChatControlProps> = ({ roomId, roomName, count, adminUid, onClearHistory, onDeleteRoom }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);
  const [showRestrictions, setShowRestrictions] = React.useState(false);

  const handleClearHistory = async () => {
    if (count === 0) {
      alert('삭제할 메시지가 없습니다.');
      return;
    }
    if (window.confirm(`'${roomName}' 채널의 모든 채팅 메시지 ${count}건을 삭제하시겠습니까?`)) {
      setIsLoading(true);
      try {
        await firebaseRepository.clearRoomChatHistory(roomId, adminUid);
        await firebaseRepository.logAdminAction(adminUid, '관리자', '채팅 삭제', `'${roomName}' 채널 메시지 ${count}건 삭제`);
        onClearHistory();
        alert('채팅 기록이 삭제되었습니다.');
      } catch (err: any) {
        alert(err.message || '삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm(`정말 '${roomName}' 채널을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      setIsLoading(true);
      try {
        await firebaseRepository.deleteChatRoom(roomId, adminUid);
        await firebaseRepository.logAdminAction(adminUid, '관리자', '채팅방 삭제', `'${roomName}' 채널 삭제`);
        alert('채팅방이 삭제되었습니다.');
        onDeleteRoom();
      } catch (err: any) {
        alert(err.message || '채팅방 삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 rounded-xl bg-amber-500/5 border border-amber-500/20">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" /> 관리 기능
        </span>
        <button
          onClick={handleClearHistory}
          disabled={isLoading || count === 0}
          className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          title="채팅방 기록 초기화"
        >
          <Trash2 className="w-3 h-3" /> {isLoading ? '처리중...' : `전체삭제 (${count})`}
        </button>
        <button
          onClick={handleDeleteRoom}
          disabled={isLoading}
          className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold flex items-center gap-1 transition-colors disabled:opacity-50"
          title="채팅방 삭제"
        >
          <Trash2 className="w-3 h-3" /> 삭제
        </button>
        <button
          onClick={() => setShowLogs(!showLogs)}
          className="px-2 py-1 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 text-[10px] font-bold transition-colors"
        >
          {showLogs ? '로그 닫기' : '관리 로그'}
        </button>
        <button
          onClick={() => setShowRestrictions(!showRestrictions)}
          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold transition-colors"
        >
          {showRestrictions ? '제한 닫기' : '채팅 제한 관리'}
        </button>
      </div>
      {showLogs && <AdminLogView />}
      {showRestrictions && <AdminRestrictionView adminUid={adminUid} />}
    </div>
  );
};

const AdminLogView: React.FC = () => {
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'adminLogs'), orderBy('timestamp', 'desc'), limit(10));
    const unsub = onSnapshot(q, snap => {
      const data: any[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() }));
      setLogs(data);
    });
    return unsub;
  }, []);

  return (
    <div className="text-[10px] max-h-40 overflow-y-auto bg-white dark:bg-[#131722] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="font-bold text-slate-500 mb-1">최근 관리 로그</div>
      {logs.map(log => (
        <div key={log.id} className="border-b border-slate-100 dark:border-slate-800 py-1">
          <span className="font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
          <span className="text-slate-500 mx-1">by {log.adminName}</span>
          <p className="text-slate-400">{log.details}</p>
          <span className="text-slate-300">{new Date(log.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const AdminRestrictionView: React.FC<{ adminUid: string }> = ({ adminUid }) => {
  const [restrictedUids, setRestrictedUids] = React.useState<string[]>([]);

  React.useEffect(() => {
    return firebaseRepository.subscribeChatRestrictions(setRestrictedUids);
  }, []);

  const handleUnrestrict = async (uid: string) => {
    if (window.confirm(`사용자 ${uid}의 채팅 제한을 해제하시겠습니까?`)) {
      try {
        await firebaseRepository.unrestrictChatUser(uid);
        await firebaseRepository.logAdminAction(adminUid, '관리자', '채팅 제한 해제', `사용자 ${uid} 제한 해제`);
        alert('제한이 해제되었습니다.');
      } catch (err: any) {
        alert('해제 실패: ' + err.message);
      }
    }
  };

  return (
    <div className="text-[10px] max-h-40 overflow-y-auto bg-white dark:bg-[#131722] p-2 rounded-lg border border-slate-200 dark:border-slate-700">
      <div className="font-bold text-slate-500 mb-1">채팅 제한된 사용자</div>
      {restrictedUids.length === 0 && <p className="text-slate-400">제한된 사용자가 없습니다.</p>}
      {restrictedUids.map(uid => (
        <div key={uid} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-1">
          <span className="font-mono text-slate-700 dark:text-slate-300 truncate" title={uid}>{uid}</span>
          <button
            onClick={() => handleUnrestrict(uid)}
            className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 font-bold"
          >
            해제
          </button>
        </div>
      ))}
    </div>
  );
};
