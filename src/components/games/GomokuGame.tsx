import React, { useState, useEffect, useCallback } from 'react';
import { Board, BOARD_SIZE, createBoard, checkWin, Cell, getBestMove } from './engines/gomoku/engine';
import { firebaseRepository } from '../../services/firebaseRepository';
import { useApp } from '../../context/AppContext';

export const GomokuGame: React.FC = () => {
  const { user } = useApp();
  const [board, setBoard] = useState<Board>(createBoard());
  const [turn, setTurn] = useState<'black' | 'white'>('black');
  const [winner, setWinner] = useState<'black' | 'white' | 'draw' | null>(null);
  const [gameMode, setGameMode] = useState<'pvp' | 'pva' | 'online'>('pva');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [playerColor, setPlayerColor] = useState<'black' | 'white'>('black');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [onlineMatchId, setOnlineMatchId] = useState<string | null>(null);
  const [matchData, setMatchData] = useState<any>(null);

  const makeMove = useCallback(async (r: number, c: number) => {
    if (board[r][c] || winner || isAiThinking) return;
    if (gameMode === 'online' && matchData) {
      if (matchData.status !== 'playing' || turn !== (user?.id === matchData.blackPlayerId ? 'black' : 'white')) return;
    }

    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = turn;
    
    const nextTurn = turn === 'black' ? 'white' : 'black';
    const isWin = checkWin(newBoard, r, c, turn);
    const winResult = isWin ? turn : (getBestMove(newBoard, 'black', 'easy') === null ? 'draw' : null);

    if (gameMode === 'online' && onlineMatchId) {
      await firebaseRepository.updateMatchMove(onlineMatchId, newBoard, nextTurn, winResult as any);
      if (isWin) await firebaseRepository.updateUserStats(user!.id, 1500, true, false);
    } else {
      setBoard(newBoard);
      if (isWin) setWinner(turn);
      else setTurn(nextTurn);
    }
  }, [board, turn, winner, isAiThinking, gameMode, onlineMatchId, matchData, user]);

  useEffect(() => {
    if (gameMode === 'online' && onlineMatchId) {
      return firebaseRepository.subscribeMatch(onlineMatchId, (data) => {
        setMatchData(data);
        setBoard(data.boardState);
        setTurn(data.turn);
        setWinner(data.winner || null);
      });
    }
  }, [gameMode, onlineMatchId]);

  useEffect(() => {
    if (gameMode === 'pva' && turn !== playerColor && !winner) {
      setIsAiThinking(true);
      setTimeout(() => {
        const move = getBestMove(board, turn, aiDifficulty);
        makeMove(move.r, move.c);
        setIsAiThinking(false);
      }, 500);
    }
  }, [gameMode, turn, playerColor, winner, board, aiDifficulty, makeMove]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      {/* 게임 상태 및 제어 */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md bg-white dark:bg-[#131722] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {winner ? (winner === 'draw' ? '무승부!' : `${winner === 'black' ? '흑' : '백'} 승리!`) : isAiThinking ? 'AI가 수를 계산 중입니다...' : `${turn === 'black' ? '흑' : '백'}의 차례`}
        </div>
        <div className="flex gap-2 w-full">
          <select className="flex-1 text-sm p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" value={gameMode} onChange={(e) => setGameMode(e.target.value as any)}>
            <option value="pvp">사람 vs 사람</option>
            <option value="pva">사람 vs AI</option>
            <option value="online">온라인 매칭</option>
          </select>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-sm hover:bg-indigo-700 transition"
            onClick={() => { setBoard(createBoard()); setTurn('black'); setWinner(null); }}
          >
            재시작
          </button>
        </div>
      </div>
      
      {/* 보드 */}
      <div className="grid gap-0 border-2 border-slate-900 bg-amber-100 shadow-xl" style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}>
        {board.map((row, r) => 
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              className="w-8 h-8 sm:w-10 sm:h-10 border border-slate-400 flex items-center justify-center relative"
              onClick={() => makeMove(r, c)}
              disabled={isAiThinking || (gameMode === 'pva' && turn !== playerColor) || (gameMode === 'online' && (matchData?.status !== 'playing' || turn !== (user?.id === matchData?.blackPlayerId ? 'black' : 'white')))}
            >
              {cell === 'black' && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-black shadow-md z-10" />}
              {cell === 'white' && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-slate-600 shadow-md z-10" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
