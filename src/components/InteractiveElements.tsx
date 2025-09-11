import React, { useState, useEffect } from 'react';
import { Shuffle, Trophy, Star, RefreshCw, CheckCircle, XCircle, Target, Zap, Puzzle, Music } from 'lucide-react';

interface InteractiveElementsProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'youth' | 'adults';
}

export default function InteractiveElements({ devotional, section }: InteractiveElementsProps) {
  const [activeGame, setActiveGame] = useState<'quiz' | 'memory' | 'puzzle' | 'crossword' | 'story' | 'coloring' | 'rhythm' | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  const resetGame = () => {
    setActiveGame(null);
    setGameCompleted(false);
  };

  return (
    <div className="space-y-6">
      {/* Game Selection */}
      {!activeGame && (
        <div className={`rounded-2xl p-6 ${
          section === 'children'
            ? 'bg-gradient-to-br from-yellow-100 to-green-100'
            : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🎮 Interactive Games
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GameButton
              icon={<Trophy className="h-6 w-6" />}
              title="Quiz Time"
              description="Test your knowledge!"
              onClick={() => setActiveGame('quiz')}
              section={section}
            />
            <GameButton
              icon={<Star className="h-6 w-6" />}
              title="Memory Match"
              description="Match the pairs!"
              onClick={() => setActiveGame('memory')}
              section={section}
            />
            <GameButton
              icon={<Puzzle className="h-6 w-6" />}
              title="Word Puzzle"
              description="Arrange the verse!"
              onClick={() => setActiveGame('puzzle')}
              section={section}
            />
            <GameButton
              icon={<Target className="h-6 w-6" />}
              title="Crossword"
              description="Fill the grid!"
              onClick={() => setActiveGame('crossword')}
              section={section}
            />
            <GameButton
              icon={<Zap className="h-6 w-6" />}
              title="Story Builder"
              description="Create your story!"
              onClick={() => setActiveGame('story')}
              section={section}
            />
            {section === 'children' && (
              <>
                <GameButton
                  icon={<Star className="h-6 w-6" />}
                  title="Color & Learn"
                  description="Color Bible scenes!"
                  onClick={() => setActiveGame('coloring')}
                  section={section}
                />
                <GameButton
                  icon={<Music className="h-6 w-6" />}
                  title="Rhythm Game"
                  description="Tap to the beat!"
                  onClick={() => setActiveGame('rhythm')}
                  section={section}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Game Components */}
      {activeGame === 'quiz' && (
        <QuizGame
          devotional={devotional}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}
      
      {activeGame === 'memory' && (
        <MemoryGame
          scripture={devotional.scripture}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}
      
      {activeGame === 'puzzle' && (
        <WordPuzzleGame
          scripture={devotional.scripture}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'crossword' && (
        <CrosswordGame
          devotional={devotional}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'story' && (
        <StoryBuilderGame
          devotional={devotional}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'coloring' && section === 'children' && (
        <ColoringGame
          devotional={devotional}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}

      {activeGame === 'rhythm' && section === 'children' && (
        <RhythmGame
          devotional={devotional}
          section={section}
          onComplete={() => setGameCompleted(true)}
          onClose={() => setActiveGame(null)}
        />
      )}
    </div>
  );
}

interface GameButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  section: 'children' | 'youth' | 'adults';
}

function GameButton({ icon, title, description, onClick, section }: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl transition-all hover:scale-105 ${
        section === 'children'
          ? 'bg-white hover:bg-yellow-50 text-gray-800 border-2 border-yellow-300'
          : 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-purple-500'
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        {icon}
        <h4 className="font-bold">{title}</h4>
        <p className={`text-sm ${
          section === 'children' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          {description}
        </p>
      </div>
    </button>
  );
}

interface GameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'youth' | 'adults';
  onComplete: () => void;
  onClose: () => void;
}

// Quiz Game Component
function QuizGame({ devotional, section, onComplete, onClose }: GameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      question: `What is the main theme of "${devotional.title}"?`,
      options: ['Love', 'Faith', 'Hope', 'All of the above'],
      correct: 3
    },
    {
      question: 'Which book of the Bible does today\'s scripture come from?',
      options: ['Matthew', 'John', 'Romans', 'Psalms'],
      correct: 0
    },
    {
      question: 'What is the key message we should remember?',
      options: ['Be kind', 'Trust God', 'Help others', 'All of the above'],
      correct: 3
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsCompleted(true);
        onComplete();
      }
    }, 2000);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className={`rounded-2xl p-6 max-w-md w-full ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-100 to-green-100'
          : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🏆 Quiz Time
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
            <div className="mb-4">
              <div className={`text-sm mb-2 ${
                section === 'children' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className={`w-full bg-gray-200 rounded-full h-2 ${
                section === 'children' ? 'bg-gray-200' : 'bg-gray-700'
              }`}>
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    section === 'children' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className={`text-lg font-bold mb-4 ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}>
                {questions[currentQuestion].question}
              </h4>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      showResult
                        ? index === questions[currentQuestion].correct
                          ? section === 'children'
                            ? 'bg-green-200 text-green-800 border-2 border-green-400'
                            : 'bg-green-600 text-white border-2 border-green-400'
                          : selectedAnswer === index
                          ? section === 'children'
                            ? 'bg-red-200 text-red-800 border-2 border-red-400'
                            : 'bg-red-600 text-white border-2 border-red-400'
                          : section === 'children'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-gray-700 text-gray-300'
                        : section === 'children'
                        ? 'bg-white hover:bg-blue-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-600 hover:border-purple-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className={`text-center p-4 rounded-xl ${
                selectedAnswer === questions[currentQuestion].correct
                  ? section === 'children'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-green-800 text-green-200'
                  : section === 'children'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-red-800 text-red-200'
              }`}>
                {selectedAnswer === questions[currentQuestion].correct ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Correct! Well done!</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <XCircle className="h-5 w-5" />
                    <span>Not quite right. Keep learning!</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h4 className={`text-2xl font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Quiz Complete!
            </h4>
            <p className={`text-lg mb-4 ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              You scored {score} out of {questions.length}!
            </p>
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                section === 'children'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Great Job!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Memory Game Component
function MemoryGame({ scripture, section, onComplete, onClose }: { scripture: string; section: 'children' | 'youth' | 'adults'; onComplete: () => void; onClose: () => void; }) {
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
      if (cards[first].word === cards[second].word) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);
          setMatches(matches + 1);
          setFlippedCards([]);
          
          if (matches + 1 === cards.length / 2) {
            setIsCompleted(true);
            onComplete();
          }
        }, 1000);
      } else {
        // No match
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
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
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
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
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

// Word Puzzle Game Component
function WordPuzzleGame({ scripture, section, onComplete, onClose }: { scripture: string; section: 'children' | 'youth' | 'adults'; onComplete: () => void; onClose: () => void; }) {
  const [words, setWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [userArrangement, setUserArrangement] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const scriptureWords = scripture.split(' ').slice(0, 8);
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
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
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

// Crossword Game Component
function CrosswordGame({ devotional, section, onComplete, onClose }: GameProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [clues, setClues] = useState<{across: string[], down: string[]}>({across: [], down: []});
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    generateCrossword();
  }, []);

  const generateCrossword = () => {
    // Simple 5x5 crossword based on devotional content
    const words = devotional.title.split(' ').concat(devotional.scripture.split(' '))
      .filter(word => word.length >= 3 && word.length <= 5)
      .slice(0, 4);
    
    const newGrid = Array(5).fill(null).map(() => Array(5).fill(''));
    const newClues = {
      across: [`1. ${devotional.title.split(' ')[0]} (across)`],
      down: [`1. Key word from scripture (down)`]
    };
    
    setGrid(newGrid);
    setClues(newClues);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({row, col});
  };

  const handleInputChange = (value: string, row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className={`rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-100 to-green-100'
          : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🎯 Crossword Puzzle
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

        {/* Crossword Grid */}
        <div className="grid grid-cols-5 gap-1 mb-6 mx-auto w-fit">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={cell}
                onChange={(e) => handleInputChange(e.target.value, rowIndex, colIndex)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-8 h-8 text-center font-bold border-2 rounded ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'border-blue-500 bg-blue-100'
                    : section === 'children'
                    ? 'border-gray-300 bg-white text-gray-800'
                    : 'border-gray-600 bg-gray-800 text-white'
                }`}
              />
            ))
          )}
        </div>

        {/* Clues */}
        <div className="space-y-4">
          <div>
            <h4 className={`font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Across
            </h4>
            {clues.across.map((clue, index) => (
              <p key={index} className={`text-sm ${
                section === 'children' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {clue}
              </p>
            ))}
          </div>
          <div>
            <h4 className={`font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Down
            </h4>
            {clues.down.map((clue, index) => (
              <p key={index} className={`text-sm ${
                section === 'children' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {clue}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setIsCompleted(true);
            onComplete();
          }}
          className={`w-full mt-6 py-3 px-4 rounded-xl font-bold transition-colors ${
            section === 'children'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}

// Story Builder Game Component
function StoryBuilderGame({ devotional, section, onComplete, onClose }: GameProps) {
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const parts = [
      "Once upon a time,",
      "there was a person who",
      "learned about God's love",
      "and decided to",
      "share it with others.",
      "The end!"
    ];
    setStoryParts(parts);
  }, []);

  const addToPart = (partIndex: number, text: string) => {
    const newStory = currentStory + ' ' + storyParts[partIndex] + ' ' + text;
    setCurrentStory(newStory);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className={`rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto ${
        section === 'children'
          ? 'bg-gradient-to-br from-yellow-100 to-green-100'
          : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            ⚡ Story Builder
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

        <div className={`p-4 rounded-xl mb-6 ${
          section === 'children'
            ? 'bg-white border-2 border-yellow-300'
            : 'bg-gray-800 border-2 border-purple-500'
        }`}>
          <h4 className={`font-bold mb-2 ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            Your Story:
          </h4>
          <p className={`${
            section === 'children' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            {currentStory || "Start building your story by clicking the parts below!"}
          </p>
        </div>

        <div className="space-y-3">
          {storyParts.map((part, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className={`flex-1 p-3 rounded-lg ${
                section === 'children'
                  ? 'bg-blue-100 text-gray-800'
                  : 'bg-gray-700 text-white'
              }`}>
                {part}
              </span>
              <input
                type="text"
                placeholder="Add your words..."
                className={`flex-1 p-2 rounded-lg ${
                  section === 'children'
                    ? 'bg-white border-2 border-gray-300 text-gray-800'
                    : 'bg-gray-800 border-2 border-gray-600 text-white'
                }`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToPart(index, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setIsCompleted(true);
            onComplete();
          }}
          className={`w-full mt-6 py-3 px-4 rounded-xl font-bold transition-colors ${
            section === 'children'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          Finish Story
        </button>
      </div>
    </div>
  );
}

// Coloring Game Component (Children only)
function ColoringGame({ devotional, section, onComplete, onClose }: GameProps) {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [coloredPaths, setColoredPaths] = useState<{[key: string]: string}>({});

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handlePathClick = (pathId: string) => {
    setColoredPaths(prev => ({
      ...prev,
      [pathId]: selectedColor
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            🎨 Color & Learn
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-800"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex flex-wrap gap-2 mb-6">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-4 ${
                selectedColor === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Simple SVG Coloring Page */}
        <div className="bg-white p-4 rounded-xl mb-6">
          <svg viewBox="0 0 200 200" className="w-full h-48">
            {/* Simple house shape */}
            <path
              d="M50 150 L50 100 L100 50 L150 100 L150 150 Z"
              fill={coloredPaths['house'] || 'white'}
              stroke="#333"
              strokeWidth="2"
              onClick={() => handlePathClick('house')}
              className="cursor-pointer hover:opacity-80"
            />
            {/* Door */}
            <rect
              x="90"
              y="120"
              width="20"
              height="30"
              fill={coloredPaths['door'] || 'white'}
              stroke="#333"
              strokeWidth="2"
              onClick={() => handlePathClick('door')}
              className="cursor-pointer hover:opacity-80"
            />
            {/* Window */}
            <rect
              x="65"
              y="110"
              width="15"
              height="15"
              fill={coloredPaths['window'] || 'white'}
              stroke="#333"
              strokeWidth="2"
              onClick={() => handlePathClick('window')}
              className="cursor-pointer hover:opacity-80"
            />
            {/* Sun */}
            <circle
              cx="170"
              cy="30"
              r="15"
              fill={coloredPaths['sun'] || 'white'}
              stroke="#333"
              strokeWidth="2"
              onClick={() => handlePathClick('sun')}
              className="cursor-pointer hover:opacity-80"
            />
          </svg>
        </div>

        <button
          onClick={() => {
            onComplete();
          }}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
        >
          Finish Coloring
        </button>
      </div>
    </div>
  );
}

// Rhythm Game Component (Children only)
function RhythmGame({ devotional, section, onComplete, onClose }: GameProps) {
  const [score, setScore] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [beats, setBeats] = useState<boolean[]>([]);

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setCurrentBeat(prev => (prev + 1) % 8);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCurrentBeat(0);
    setBeats(Array(8).fill(false));
  };

  const handleBeatTap = () => {
    if (gameActive) {
      const newBeats = [...beats];
      newBeats[currentBeat] = true;
      setBeats(newBeats);
      setScore(prev => prev + 10);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            🎵 Rhythm Game
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-200 hover:bg-red-300 text-red-800"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            Score: {score}
          </div>
          <p className="text-gray-600">
            Tap the button when the circle lights up!
          </p>
        </div>

        {/* Beat Circles */}
        <div className="flex justify-center space-x-2 mb-6">
          {Array(8).fill(0).map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                index === currentBeat && gameActive
                  ? 'bg-yellow-400 border-yellow-600 scale-125'
                  : beats[index]
                  ? 'bg-green-400 border-green-600'
                  : 'bg-gray-200 border-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Tap Button */}
        <button
          onClick={handleBeatTap}
          disabled={!gameActive}
          className={`w-32 h-32 mx-auto block rounded-full text-2xl font-bold transition-all ${
            gameActive
              ? 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          TAP!
        </button>

        <div className="flex space-x-4 mt-6">
          <button
            onClick={startGame}
            className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
          >
            {gameActive ? 'Restart' : 'Start Game'}
          </button>
          <button
            onClick={() => {
              setGameActive(false);
              onComplete();
            }}
            className="flex-1 py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold transition-colors"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}