import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAnalyticsContext } from '../AnalyticsProvider';

interface QuizGameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function QuizGame({ devotional, section, onComplete, onClose }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { trackGamePlay, trackGameComplete } = useAnalyticsContext();

  useEffect(() => {
    trackGamePlay('Quiz Time');
  }, [trackGamePlay]);

  // Helper to extract book name from scripture string (e.g., "John 3:16")
  const getBookFromScripture = (scripture: string) => scripture.split(' ')[0];

  // Generate some dynamic questions
  const generatedQuestions = [
    {
      question: `What is the main theme of "${devotional.title}"?`,
      options: [devotional.title, 'Love', 'Faith', 'Hope'],
      correct: 0,
    },
    {
      question: `Which book of the Bible does today’s scripture come from? (${devotional.scripture})`,
      options: [
        getBookFromScripture(devotional.scripture),
        'Psalms',
        'Romans',
        'Matthew',
      ],
      correct: 0,
    },
    {
      question: `Fill in the blank: "${devotional.content.split(' ')[0]} ..."` ,
      options: [
        devotional.content.split(' ')[0], // first word from content
        'God',
        'Jesus',
        'Love',
      ],
      correct: 0,
    },
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === generatedQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < generatedQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsCompleted(true);
        trackGameComplete(
          'Quiz Time',
          score + (answerIndex === generatedQuestions[currentQuestion].correct ? 1 : 0)
        );
        onComplete();
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-2xl p-6 max-w-md w-full ${
          section === 'children'
            ? 'bg-gradient-to-br from-yellow-100 to-green-100'
            : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-2xl font-bold ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}
          >
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
              <div
                className={`text-sm mb-2 ${
                  section === 'children' ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                Question {currentQuestion + 1} of {generatedQuestions.length}
              </div>
              <div
                className={`w-full rounded-full h-2 ${
                  section === 'children' ? 'bg-gray-200' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    section === 'children' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{
                    width: `${((currentQuestion + 1) / generatedQuestions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mb-6">
              <h4
                className={`text-lg font-bold mb-4 ${
                  section === 'children' ? 'text-gray-800' : 'text-white'
                }`}
              >
                {generatedQuestions[currentQuestion].question}
              </h4>

              <div className="space-y-3">
                {generatedQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      showResult
                        ? index === generatedQuestions[currentQuestion].correct
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
              <div
                className={`text-center p-4 rounded-xl ${
                  selectedAnswer === generatedQuestions[currentQuestion].correct
                    ? section === 'children'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-green-800 text-green-200'
                    : section === 'children'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-red-800 text-red-200'
                }`}
              >
                {selectedAnswer === generatedQuestions[currentQuestion].correct ? (
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
            <h4
              className={`text-2xl font-bold mb-2 ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}
            >
              Quiz Complete!
            </h4>
            <p
              className={`text-lg mb-4 ${
                section === 'children' ? 'text-gray-600' : 'text-gray-300'
              }`}
            >
              You scored {score} out of {generatedQuestions.length}!
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
