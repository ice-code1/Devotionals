import React, { useState } from 'react';
import { Gamepad2, Brain, Shuffle, Trophy, Star } from 'lucide-react';

interface InteractiveElementsProps {
  section: 'children' | 'teenagers';
  scripture: string;
  title: string;
}

export default function InteractiveElements({ section, scripture, title }: InteractiveElementsProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [memoryCards, setMemoryCards] = useState<Array<{id: number, word: string, matched: boolean, flipped: boolean}>>([]);
  const [dragWords, setDragWords] = useState<Array<{id: number, word: string, placed: boolean}>>([]);

  // Initialize memory game
  const initMemoryGame = () => {
    const words = scripture.split(' ').slice(0, 6);
    const cards = [...words, ...words].map((word, index) => ({
      id: index,
      word,
      matched: false,
      flipped: false
    })).sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
    setActiveGame('memory');
  };

  // Initialize drag and drop game
  const initDragGame = () => {
    const words = scripture.split(' ').map((word, index) => ({
      id: index,
      word,
      placed: false
    })).sort(() => Math.random() - 0.5);
    setDragWords(words);
    setActiveGame('drag');
  };

  const quizQuestions = [
    {
      question: `What is the main message of "${title}"?`,
      options: ['Love', 'Faith', 'Hope', 'All of the above'],
      correct: 3
    },
    {
      question: 'How can we apply this devotional in our daily life?',
      options: ['Pray more', 'Be kind to others', 'Read the Bible', 'All of the above'],
      correct: 3
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === quizQuestions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
  };

  const flipCard = (cardId: number) => {
    setMemoryCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, flipped: !card.flipped } : card
    ));
  };

  if (!activeGame) {
    return (
      <div className={`rounded-2xl p-6 ${
        section === 'children'
          ? 'bg-gradient-to-r from-yellow-100 to-orange-100'
          : 'bg-gradient-to-r from-purple-900/50 to-blue-900/50'
      }`}>
        <h3 className={`text-2xl font-bold mb-4 text-center ${
          section === 'children' ? 'text-gray-800' : 'text-white'
        }`}>
          🎮 Fun Activities
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveGame('quiz')}
            className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
              section === 'children'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <Brain className="h-8 w-8 mx-auto mb-2" />
            <div className="font-bold">Quiz Time</div>
            <div className="text-sm opacity-90">Test your knowledge</div>
          </button>
          
          <button
            onClick={initMemoryGame}
            className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
              section === 'children'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Gamepad2 className="h-8 w-8 mx-auto mb-2" />
            <div className="font-bold">Memory Match</div>
            <div className="text-sm opacity-90">Match the words</div>
          </button>
          
          <button
            onClick={initDragGame}
            className={`p-4 rounded-xl transition-all duration-200 transform hover:scale-105 ${
              section === 'children'
                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Shuffle className="h-8 w-8 mx-auto mb-2" />
            <div className="font-bold">Word Puzzle</div>
            <div className="text-sm opacity-90">Arrange the verse</div>
          </button>
        </div>
      </div>
    );
  }

  if (activeGame === 'quiz') {
    return (
      <div className={`rounded-2xl p-6 ${
        section === 'children'
          ? 'bg-gradient-to-r from-blue-100 to-purple-100'
          : 'bg-gradient-to-r from-purple-900/50 to-blue-900/50'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🧠 Quiz Time
          </h3>
          <button
            onClick={() => setActiveGame(null)}
            className={`px-4 py-2 rounded-lg ${
              section === 'children'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Back
          </button>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <div className={`text-lg font-semibold ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </div>
            
            <div className={`text-xl ${
              section === 'children' ? 'text-gray-700' : 'text-gray-200'
            }`}>
              {quizQuestions[currentQuestion].question}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedAnswer === null
                      ? section === 'children'
                        ? 'bg-white hover:bg-blue-50 text-gray-800 border-2 border-transparent hover:border-blue-300'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-transparent hover:border-purple-400'
                      : selectedAnswer === index
                        ? index === quizQuestions[currentQuestion].correct
                          ? 'bg-green-500 text-white border-2 border-green-600'
                          : 'bg-red-500 text-white border-2 border-red-600'
                        : index === quizQuestions[currentQuestion].correct
                          ? 'bg-green-500 text-white border-2 border-green-600'
                          : section === 'children'
                            ? 'bg-gray-200 text-gray-500'
                            : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl">
              {quizScore === quizQuestions.length ? '🏆' : quizScore > 0 ? '⭐' : '💪'}
            </div>
            <div className={`text-2xl font-bold ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}>
              You scored {quizScore} out of {quizQuestions.length}!
            </div>
            <div className={`text-lg ${
              section === 'children' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              {quizScore === quizQuestions.length 
                ? 'Perfect! You really understood the message!' 
                : quizScore > 0 
                  ? 'Great job! Keep learning and growing!' 
                  : 'Keep trying! Every attempt helps you learn more!'}
            </div>
            <button
              onClick={resetQuiz}
              className={`px-6 py-3 rounded-lg font-bold ${
                section === 'children'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  if (activeGame === 'memory') {
    return (
      <div className={`rounded-2xl p-6 ${
        section === 'children'
          ? 'bg-gradient-to-r from-green-100 to-blue-100'
          : 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            🎮 Memory Match
          </h3>
          <button
            onClick={() => setActiveGame(null)}
            className={`px-4 py-2 rounded-lg ${
              section === 'children'
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {memoryCards.map((card) => (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              className={`aspect-square p-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                card.flipped || card.matched
                  ? section === 'children'
                    ? 'bg-yellow-400 text-gray-800'
                    : 'bg-purple-500 text-white'
                  : section === 'children'
                    ? 'bg-gray-300 hover:bg-gray-400 text-transparent'
                    : 'bg-gray-700 hover:bg-gray-600 text-transparent'
              }`}
            >
              {card.flipped || card.matched ? card.word : '?'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}