export type Suit = 'S' | 'H' | 'D' | 'C';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
export interface Card { suit: Suit; rank: Rank; }

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits: Suit[] = ['S', 'H', 'D', 'C'];
  for (const s of suits) for (let r = 2; r <= 14; r++) deck.push({ suit: s, rank: r as Rank });
  return deck.sort(() => Math.random() - 0.5);
};

export type HandRank = 'RoyalFlush' | 'StraightFlush' | 'FourKind' | 'FullHouse' | 'Flush' | 'Straight' | 'ThreeKind' | 'TwoPair' | 'OnePair' | 'HighCard';

// Helper to get combinations (e.g., 7 cards choose 5 = 21 combinations)
const getCombinations = <T,>(arr: T[], k: number): T[][] => {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];
  const [head, ...tail] = arr;
  return [...getCombinations(tail, k - 1).map(c => [head, ...c]), ...getCombinations(tail, k)];
};

export const evaluateHand = (cards: Card[]): { rank: HandRank, value: number } => {
  const combinations = getCombinations(cards, 5);
  let best: { rank: HandRank, value: number, score: number } = { rank: 'HighCard', value: 0, score: -1 };

  const rankScores: Record<HandRank, number> = {
    RoyalFlush: 10, StraightFlush: 9, FourKind: 8, FullHouse: 7, Flush: 6,
    Straight: 5, ThreeKind: 4, TwoPair: 3, OnePair: 2, HighCard: 1
  };

  combinations.forEach(combo => {
    const ranks = combo.map(c => c.rank).sort((a, b) => b - a);
    const suits = combo.map(c => c.suit);
    const isFlush = suits.every(s => s === suits[0]);
    
    // Straight check (including A-2-3-4-5)
    let isStraight = false;
    if (ranks[0] - ranks[4] === 4) isStraight = true;
    if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) isStraight = true;

    const freq: Record<number, number> = {};
    ranks.forEach(r => freq[r] = (freq[r] || 0) + 1);
    const counts = Object.values(freq).sort((a, b) => b - a);

    let rank: HandRank = 'HighCard';
    if (isFlush && isStraight && ranks[0] === 14 && ranks[4] === 10) rank = 'RoyalFlush';
    else if (isFlush && isStraight) rank = 'StraightFlush';
    else if (counts[0] === 4) rank = 'FourKind';
    else if (counts[0] === 3 && counts[1] === 2) rank = 'FullHouse';
    else if (isFlush) rank = 'Flush';
    else if (isStraight) rank = 'Straight';
    else if (counts[0] === 3) rank = 'ThreeKind';
    else if (counts[0] === 2 && counts[1] === 2) rank = 'TwoPair';
    else if (counts[0] === 2) rank = 'OnePair';

    const score = rankScores[rank] * 1000000 + ranks.reduce((acc, r, i) => acc + r * Math.pow(15, 4 - i), 0);
    if (score > best.score) best = { rank, value: ranks[0], score };
  });

  return { rank: best.rank, value: best.value };
};
