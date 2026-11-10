export type PieceType = 'gung' | 'sa' | 'cha' | 'po' | 'ma' | 'sang' | 'jol';
export type Player = 'cho' | 'han';
export interface Piece { type: PieceType; player: Player; }
export type Board = (Piece | null)[][]; // 10 rows x 9 cols

export const createBoard = (): Board => {
  const board: Board = Array(10).fill(null).map(() => Array(9).fill(null));
  // Han (top)
  board[0][0] = { type: 'cha', player: 'han' }; board[0][8] = { type: 'cha', player: 'han' };
  board[0][1] = { type: 'ma', player: 'han' }; board[0][7] = { type: 'ma', player: 'han' };
  board[0][2] = { type: 'sang', player: 'han' }; board[0][6] = { type: 'sang', player: 'han' };
  board[0][3] = { type: 'sa', player: 'han' }; board[0][5] = { type: 'sa', player: 'han' };
  board[1][4] = { type: 'gung', player: 'han' };
  board[2][1] = { type: 'po', player: 'han' }; board[2][7] = { type: 'po', player: 'han' };
  board[3][0] = { type: 'jol', player: 'han' }; board[3][2] = { type: 'jol', player: 'han' }; 
  board[3][4] = { type: 'jol', player: 'han' }; board[3][6] = { type: 'jol', player: 'han' }; board[3][8] = { type: 'jol', player: 'han' };
  // Cho (bottom)
  board[9][0] = { type: 'cha', player: 'cho' }; board[9][8] = { type: 'cha', player: 'cho' };
  board[9][1] = { type: 'ma', player: 'cho' }; board[9][7] = { type: 'ma', player: 'cho' };
  board[9][2] = { type: 'sang', player: 'cho' }; board[9][6] = { type: 'sang', player: 'cho' };
  board[9][3] = { type: 'sa', player: 'cho' }; board[9][5] = { type: 'sa', player: 'cho' };
  board[8][4] = { type: 'gung', player: 'cho' };
  board[7][1] = { type: 'po', player: 'cho' }; board[7][7] = { type: 'po', player: 'cho' };
  board[6][0] = { type: 'jol', player: 'cho' }; board[6][2] = { type: 'jol', player: 'cho' };
  board[6][4] = { type: 'jol', player: 'cho' }; board[6][6] = { type: 'jol', player: 'cho' }; board[6][8] = { type: 'jol', player: 'cho' };
  return board;
};

const isInsidePalace = (r: number, c: number, player: Player): boolean => {
  if (player === 'han') return r >= 0 && r <= 2 && c >= 3 && c <= 5;
  return r >= 7 && r <= 9 && c >= 3 && c <= 5;
};

const getPath = (from: {r: number, c: number}, to: {r: number, c: number}): {r: number, c: number}[] => {
  const path: {r: number, c: number}[] = [];
  const dr = Math.sign(to.r - from.r);
  const dc = Math.sign(to.c - from.c);
  let r = from.r + dr, c = from.c + dc;
  while (r !== to.r || c !== to.c) {
    path.push({r, c});
    r += dr; c += dc;
  }
  return path;
};

export const isValidMove = (board: Board, from: {r: number, c: number}, to: {r: number, c: number}, player: Player): boolean => {
  const piece = board[from.r][from.c];
  if (!piece || piece.player !== player) return false;
  const target = board[to.r][to.c];
  if (target && target.player === player) return false;
  const dr = to.r - from.r, dc = to.c - from.c;
  const absDr = Math.abs(dr), absDc = Math.abs(dc);

  switch (piece.type) {
    case 'cha':
      if (dr !== 0 && dc !== 0 && !(isInsidePalace(from.r, from.c, player) && isInsidePalace(to.r, to.c, player))) return false;
      return getPath(from, to).every(p => !board[p.r][p.c]);
    case 'po':
      if (dr !== 0 && dc !== 0) return false;
      const path = getPath(from, to);
      const piecesInPath = path.filter(p => board[p.r][p.c]);
      if (piecesInPath.length !== 1) return false;
      return piecesInPath[0].r === to.r && piecesInPath[0].c === to.c && board[piecesInPath[0].r][piecesInPath[0].c]?.type !== 'po';
    case 'ma':
      const leg = {r: from.r + Math.sign(dr), c: from.c + Math.sign(dc)};
      if ((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2)) return !board[leg.r][leg.c];
      return false;
    case 'sang':
      const leg1 = {r: from.r + Math.sign(dr), c: from.c + Math.sign(dc)};
      const leg2 = {r: from.r + Math.sign(dr) * 2, c: from.c + Math.sign(dc) * 2};
      if ((absDr === 3 && absDc === 2) || (absDr === 2 && absDc === 3)) return !board[leg1.r][leg1.c] && !board[leg2.r][leg2.c];
      return false;
    case 'gung':
    case 'sa':
      return isInsidePalace(to.r, to.c, player) && absDr <= 1 && absDc <= 1;
    case 'jol':
      const forward = player === 'cho' ? -1 : 1;
      return (dr === forward && dc === 0) || (dr === 0 && absDc === 1);
    default: return false;
  }
};

export const checkWin = (board: Board): Player | 'draw' | null => {
  // Check if Gung exists
  return null;
};

export const evaluateBoard = (board: Board): number => {
  let score = 0;
  board.forEach((row, r) => row.forEach((piece, c) => {
    if (!piece) return;
    const values: Record<string, number> = { gung: 1000, sa: 50, cha: 100, po: 50, ma: 30, sang: 30, jol: 10 };
    score += (piece.player === 'cho' ? 1 : -1) * (values[piece.type] || 0);
  }));
  return score;
};

export const minimax = (board: Board, depth: number, alpha: number, beta: number, isMaximizing: boolean, player: Player): number => {
  if (depth === 0) return evaluateBoard(board);
  return evaluateBoard(board); // Placeholder
};

export const getBestMove = (board: Board, aiPlayer: Player, difficulty: 'easy' | 'medium' | 'hard' | 'expert'): { from: {r: number, c: number}, to: {r: number, c: number} } | null => {
  return null; // Placeholder
};
