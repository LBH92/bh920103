export type Cell = null | 'black' | 'white';
export type Board = Cell[][];

export const BOARD_SIZE = 15;

export const createBoard = (): Board => 
  Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

export const checkWin = (board: Board, row: number, col: number, player: 'black' | 'white'): boolean => {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) count++;
      else break;
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) count++;
      else break;
    }
    if (count >= 5) return true;
  }
  return false;
};

// Simplified evaluation function for Gomoku
export const evaluateBoard = (board: Board): number => {
  let score = 0;
  // A real evaluation would count patterns like open-4, closed-4, open-3, etc.
  // For now, this is a placeholder that prioritizes central positions.
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 'black') {
        score += (7 - Math.abs(r - 7)) + (7 - Math.abs(c - 7));
      } else if (board[r][c] === 'white') {
        score -= (7 - Math.abs(r - 7)) + (7 - Math.abs(c - 7));
      }
    }
  }
  return score;
};

export const getAvailableMoves = (board: Board): {r: number, c: number}[] => {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!board[r][c]) moves.push({r, c});
    }
  }
  return moves;
};

export const minimax = (board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean): number => {
  if (depth === 0) return evaluateBoard(board);
  
  const moves = getAvailableMoves(board);
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      board[move.r][move.c] = 'black';
      const ev = minimax(board, depth - 1, alpha, beta, false);
      board[move.r][move.c] = null;
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      board[move.r][move.c] = 'white';
      const ev = minimax(board, depth - 1, alpha, beta, true);
      board[move.r][move.c] = null;
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMove = (board: Board, aiPlayer: 'black' | 'white', difficulty: 'easy' | 'medium' | 'hard' | 'expert'): { r: number, c: number } => {
  const depth = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : difficulty === 'hard' ? 3 : 4;
  const moves = getAvailableMoves(board);
  let bestMove = moves[0];
  let bestEval = aiPlayer === 'black' ? -Infinity : Infinity;

  for (const move of moves) {
    board[move.r][move.c] = aiPlayer;
    const ev = minimax(board, depth - 1, -Infinity, Infinity, aiPlayer === 'white');
    board[move.r][move.c] = null;
    if (aiPlayer === 'black' ? ev > bestEval : ev < bestEval) {
      bestEval = ev;
      bestMove = move;
    }
  }
  return bestMove;
};
