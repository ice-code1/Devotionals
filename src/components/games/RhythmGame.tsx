import React, { useState, useEffect } from "react";
import { XCircle } from "lucide-react";

interface RhythmGameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: "children" | "teenagers";
  onComplete: () => void;
  onClose: () => void;
}

export default function RhythmGame({
  devotional,
  section,
  onComplete,
  onClose,
}: RhythmGameProps) {
  const [score, setScore] = useState(0);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [feedback, setFeedback] = useState<string>(""); // Perfect, Good, Miss
  const [lastBeatTime, setLastBeatTime] = useState<number>(0);
  const [beatCount, setBeatCount] = useState(0);

  const totalBeats = 32; // game lasts 32 beats (~16s at 500ms)

  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % 8);
        setLastBeatTime(Date.now());
        setBeatCount((prev) => {
          if (prev + 1 >= totalBeats) {
            clearInterval(interval);
            setGameActive(false);
            onComplete();
          }
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCurrentBeat(0);
    setBeatCount(0);
    setFeedback("");
    setLastBeatTime(Date.now());
  };

  const handleBeatTap = () => {
    if (!gameActive) return;

    const now = Date.now();
    const delta = Math.abs(now - lastBeatTime);

    if (delta <= 100) {
      setScore((prev) => prev + 50);
      setFeedback("Perfect!");
    } else if (delta <= 200) {
      setScore((prev) => prev + 20);
      setFeedback("Good!");
    } else {
      setFeedback("Miss!");
    }

    setTimeout(() => setFeedback(""), 500); // clear feedback quickly
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-2xl p-6 max-w-md w-full ${
          section === "children"
            ? "bg-gradient-to-br from-yellow-100 to-green-100"
            : "bg-gradient-to-br from-purple-900 to-blue-900 text-white"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-2xl font-bold ${
              section === "children" ? "text-gray-800" : "text-white"
            }`}
          >
            🎵 Rhythm Game
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              section === "children"
                ? "bg-red-200 hover:bg-red-300 text-red-800"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Score & Feedback */}
        <div className="text-center mb-6">
          <div
            className={`text-3xl font-bold mb-2 ${
              section === "children" ? "text-gray-800" : "text-white"
            }`}
          >
            Score: {score}
          </div>
          <p
            className={`text-lg font-semibold ${
              feedback === "Perfect!"
                ? "text-green-500"
                : feedback === "Good!"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {feedback}
          </p>
        </div>

        {/* Beat Circles */}
        <div className="flex justify-center space-x-2 mb-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  index === currentBeat && gameActive
                    ? "bg-yellow-400 border-yellow-600 scale-125"
                    : "bg-gray-200 border-gray-400"
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
              ? "bg-blue-500 hover:bg-blue-600 text-white active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          TAP!
        </button>

        {/* Controls */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={startGame}
            className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
          >
            {gameActive ? "Restart" : "Start Game"}
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
