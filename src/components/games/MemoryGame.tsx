import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface MemoryGameProps {
  scripture: string;
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function MemoryGame({ scripture, section, onComplete, onClose }: MemoryGameProps) {
  const [cards, setCards] = useState<Array<{id: number, word: string, isFlipped: boolean, isMatched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const words = scripture.split(' ').slice(0, 6);
    const gameCards = [...words, ...words].map((word, index) => ({
      id: index,
      word,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
    
    setCards(gameCards);
  }, [scripture]);

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (newCards[first].word === newCards[second].word) {
        // ✅ use functional state update
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);

          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === updatedCards.length / 2) {
              setIsCompleted(true);
              onComplete();
            }
            return newMatches;
          });

          setFlippedCards([]);
        }, 1000);
      } else {
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl p-6 max-w-lg w-full ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-100 to-green-100'
          : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            ⭐ Memory Match
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              section === 'children' 
                ? 'bg-red-200 hover:bg-red-300 text-red-800' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {!isCompleted ? (
          <>
            <div className={`text-center mb-4 ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Matches: {matches} / {cards.length / 2}
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)} 
                  className={`aspect-square p-2 rounded-xl text-sm font-bold transition-all ${
                    card.isFlipped || card.isMatched
                      ? section === 'children'
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-blue-600 text-white'
                      : section === 'children'
                      ? 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200'
                      : 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-600'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? card.word : '?'}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className={`text-2xl font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Perfect Match!
            </h4>
            <p className={`text-lg mb-4 ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              You found all the pairs!
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                section === 'children'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Awesome!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}