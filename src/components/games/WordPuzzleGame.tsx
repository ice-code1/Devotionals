import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface WordPuzzleGameProps {
  scripture: string;
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function WordPuzzleGame({ scripture, section, onComplete, onClose }: WordPuzzleGameProps) {
  const [words, setWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userArrangement, setUserArrangement] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const scriptureWords = scripture.split(' ');
  setWords(scriptureWords);

    
    // Shuffle the words
    const shuffled = [...scriptureWords].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, [scripture]);

  const handleWordClick = (word: string, index: number) => {
    setUserArrangement([...userArrangement, word]);
    setShuffledWords(shuffledWords.filter((_, i) => i !== index));
  };

  const handleRemoveWord = (index: number) => {
    const word = userArrangement[index];
    setShuffledWords([...shuffledWords, word]);
    setUserArrangement(userArrangement.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const isCorrect = userArrangement.join(' ') === words.join(' ');
    if (isCorrect) {
      setIsCompleted(true);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-100 to-green-100'
          : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🧩 Word Puzzle
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
            <p className={`text-center mb-4 ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              Arrange the words in the correct order:
            </p>

            {/* User's arrangement */}
            <div className={`min-h-[100px] p-4 rounded-xl mb-4 border-2 border-dashed ${
              section === 'children'
                ? 'bg-white border-gray-300'
                : 'bg-gray-800 border-gray-600'
            }`}>
              <div className="flex flex-wrap gap-2">
                {userArrangement.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleRemoveWord(index)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      section === 'children'
                        ? 'bg-blue-200 hover:bg-blue-300 text-blue-800'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Available words */}
            <div className="flex flex-wrap gap-2 mb-6">
              {shuffledWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleWordClick(word, index)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    section === 'children'
                      ? 'bg-yellow-200 hover:bg-yellow-300 text-yellow-800'
                      : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>

            <button
              onClick={checkAnswer}
              disabled={userArrangement.length !== words.length}
              className={`w-full py-3 px-4 rounded-xl font-bold transition-colors ${
                userArrangement.length === words.length
                  ? section === 'children'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Check Answer
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className={`text-2xl font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Perfect!
            </h4>
            <p className={`text-lg mb-4 ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              You arranged the verse correctly!
            </p>
            <div className={`p-4 rounded-xl mb-4 ${
              section === 'children'
                ? 'bg-green-100 text-green-800'
                : 'bg-green-800 text-green-200'
            }`}>
              "{words.join(' ')}"
            </div>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                section === 'children'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Excellent!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}