import React, { useState, useCallback } from 'react';
import { Board, createBoard, isValidMove, Player, Piece } from './engines/janggi/engine';

// TODO: 온라인 대전 시 Firestore 동기화 및 턴 검증 로직 연동 필요
export const JanggiGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(createBoard());
  const [turn, setTurn] = useState<Player>('cho');
  const [selected, setSelected] = useState<{r: number, c: number} | null>(null);

  const pieceName = (piece: Piece | null) => {
    if (!piece) return '';
    const names: Record<string, string> = { gung: '宮', sa: '士', cha: '車', po: '包', ma: '馬', sang: '象', jol: '卒' };
    return names[piece.type] || piece.type;
  };

  const handleCellClick = useCallback((r: number, c: number) => {
    if (selected) {
      if (isValidMove(board, selected, {r, c}, turn)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = newBoard[selected.r][selected.c];
        newBoard[selected.r][selected.c] = null;
        setBoard(newBoard);
        setTurn(turn === 'cho' ? 'han' : 'cho');
        setSelected(null);
      } else {
        // Deselect or re-select if clicking own piece
        if (board[r][c]?.player === turn) {
          setSelected({r, c});
        } else {
          setSelected(null);
        }
      }
    } else {
      if (board[r][c] && board[r][c]?.player === turn) {
        setSelected({r, c});
      }
    }
  }, [board, selected, turn]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 text-slate-900 dark:text-white">
      {/* 게임 상태 및 제어 */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm bg-white dark:bg-[#131722] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-sm font-bold">
          {turn === 'cho' ? '초(Cho)' : '한(Han)'}의 차례
        </div>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition"
          onClick={() => { setBoard(createBoard()); setTurn('cho'); setSelected(null); }}
        >
          재시작
        </button>
      </div>

      {/* 보드 */}
      <div className="grid grid-cols-9 border-2 border-slate-900 bg-amber-100 shadow-xl" style={{ width: '450px', height: '500px' }}>
        {board.map((row, r) => 
          row.map((cell, c) => (
            <button 
              key={`${r}-${c}`} 
              className={`border border-slate-400 w-[50px] h-[50px] flex items-center justify-center ${selected?.r === r && selected?.c === c ? 'bg-indigo-300' : ''}`}
              onClick={() => handleCellClick(r, c)}
            >
              <span className={`text-lg font-bold ${cell?.player === 'cho' ? 'text-red-700' : 'text-blue-700'}`}>
                {pieceName(cell)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
