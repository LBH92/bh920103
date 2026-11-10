import React, { useState, useCallback, useEffect } from 'react';
import { Card, createDeck, evaluateHand, HandRank } from './engines/holdem/engine';

interface Player { id: number; cards: Card[]; chips: number; bet: number; folded: boolean; isAi: boolean; }

export const HoldemGame: React.FC = () => {
  const [deck, setDeck] = useState(createDeck());
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, cards: [], chips: 1000, bet: 0, folded: false, isAi: false },
    { id: 1, cards: [], chips: 1000, bet: 0, folded: true, isAi: true } // AI dummy
  ]);
  const [pot, setPot] = useState(0);
  const [phase, setPhase] = useState<'preflop' | 'flop' | 'turn' | 'river' | 'showdown'>('preflop');
  const [turn, setTurn] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const deal = useCallback(() => {
    const newDeck = createDeck();
    setPlayers(prev => prev.map(p => ({ ...p, cards: [newDeck.pop()!, newDeck.pop()!], bet: 0, folded: false, chips: p.chips - 10 }))); // Simple blind
    setCommunityCards([]);
    setPot(20);
    setPhase('preflop');
    setTurn(0);
    setWinner(null);
    setDeck(newDeck);
  }, []);

  const handleAction = (action: 'fold' | 'call' | 'raise', amount: number = 0) => {
    if (players[turn].folded) return;
    
    let newPlayers = [...players];
    if (action === 'fold') newPlayers[turn].folded = true;
    else {
      const betAmount = action === 'call' ? 10 : amount;
      newPlayers[turn].chips -= betAmount;
      newPlayers[turn].bet += betAmount;
      setPot(prev => prev + betAmount);
    }
    setPlayers(newPlayers);

    // Basic round end check (everyone called or folded)
    const activePlayers = newPlayers.filter(p => !p.folded);
    if (activePlayers.every(p => p.bet === activePlayers[0].bet) && phase !== 'showdown') {
      nextPhase();
    } else {
      setTurn(prev => (prev + 1) % players.length);
    }
  };

  const nextPhase = useCallback(() => {
    if (phase === 'preflop') {
        setCommunityCards(deck.splice(0, 3));
        setPhase('flop');
    }
    else if (phase === 'flop') {
        setCommunityCards([...communityCards, deck.pop()!]);
        setPhase('turn');
    }
    else if (phase === 'turn') {
        setCommunityCards([...communityCards, deck.pop()!]);
        setPhase('river');
    }
    else if (phase === 'river') {
      // Showdown
      const winnerData = players.map(p => ({
          ...p,
          hand: evaluateHand([...p.cards, ...communityCards])
      }));
      const winner = winnerData.reduce((best, p) => {
          if (p.folded) return best;
          if (!best || p.hand.rank > best.hand.rank) return p; // Note: Simple rank comparison, needs better logic
          return best;
      }, winnerData[0]);
      
      setWinner(`Player ${winner.id} wins with ${winner.hand.rank}!`);
      setPhase('showdown');
    }
    setTurn(0);
  }, [phase, deck, communityCards, players]);

  useEffect(() => {
    if (players[turn].isAi && phase !== 'showdown') {
      setTimeout(() => handleAction('call'), 1000);
    }
  }, [turn, players, phase]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 text-slate-900 dark:text-white">
      <h2 className="text-xl font-bold">텍사스 홀덤</h2>
      <div className="text-sm">단계: {phase} | 팟: {pot} | 차례: Player {turn}</div>
      <div className="flex gap-2">
        {communityCards.map((c, i) => <div key={i} className="w-12 h-16 bg-white border border-slate-300 rounded flex items-center justify-center text-sm">{c.rank}{c.suit}</div>)}
      </div>
      <div className="flex gap-4">
        {players.map(p => (
          <div key={p.id} className="border p-2 rounded">
            P{p.id} {p.folded ? '(Folded)' : ''}: {p.cards.map(c => `${c.rank}${c.suit}`).join(', ')} | 칩: {p.chips} | 베팅: {p.bet}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => handleAction('fold')} className="px-4 py-2 bg-red-600 text-white rounded">폴드</button>
        <button onClick={() => handleAction('call')} className="px-4 py-2 bg-blue-600 text-white rounded">콜</button>
        <button onClick={deal} className="px-4 py-2 bg-slate-900 text-white rounded">새 판 시작</button>
      </div>
      {winner && <div className="text-lg font-bold text-green-600">{winner}</div>}
    </div>
  );
};
