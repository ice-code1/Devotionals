import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface CrosswordGameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function CrosswordGame({
  devotional,
  section,
  onComplete,
  onClose,
}: CrosswordGameProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [clues, setClues] = useState<{ across: string[]; down: string[] }>({
    across: [],
    down: [],
  });
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    generateCrossword();
  }, []);

  const generateCrossword = () => {
    // Break devotional into words and filter for short ones
    const bodyWords = devotional.content
      .replace(/[^\w\s]/g, '') // remove punctuation
      .split(/\s+/)
      .filter((word) => word.length >= 3 && word.length <= 5);

    // Pick up to 6 unique random indices
    const indices: number[] = [];
    while (indices.length < 6 && indices.length < bodyWords.length) {
      const rand = Math.floor(Math.random() * bodyWords.length);
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }

    // Store words with their positions
    const selected = indices.map((i) => ({
      word: bodyWords[i],
      position: i + 1,
    }));

    setAnswers(selected.map((item) => item.word));

    const newGrid = Array(5)
      .fill(null)
      .map(() => Array(5).fill(''));

    const newClues = {
      across: selected.map(
        (item, idx) => `${idx + 1}. ${item.position}th word in devotional body (across)`
      ),
      down: selected.map(
        (item, idx) => `${idx + 1}. ${item.position}th word in devotional body (down)`
      ),
    };

    setGrid(newGrid);
    setClues(newClues);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleInputChange = (value: string, row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col] = value.toUpperCase();
    setGrid(newGrid);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${
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
            <h4
              className={`font-bold mb-2 ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}
            >
              Across
            </h4>
            {clues.across.map((clue, index) => (
              <p
                key={index}
                className={`text-sm ${
                  section === 'children' ? 'text-gray-700' : 'text-gray-300'
                }`}
              >
                {clue} {isCompleted && `(Answer: ${answers[index]})`}
              </p>
            ))}
          </div>
          <div>
            <h4
              className={`font-bold mb-2 ${
                section === 'children' ? 'text-gray-800' : 'text-white'
              }`}
            >
              Down
            </h4>
            {clues.down.map((clue, index) => (
              <p
                key={index}
                className={`text-sm ${
                  section === 'children' ? 'text-gray-700' : 'text-gray-300'
                }`}
              >
                {clue} {isCompleted && `(Answer: ${answers[index]})`}
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
