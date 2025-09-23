import React, { useState, useEffect } from 'react';
import { XCircle } from 'lucide-react';

interface StoryBuilderGameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function StoryBuilderGame({
  devotional,
  section,
  onComplete,
  onClose,
}: StoryBuilderGameProps) {
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // break scripture into chunks for building
    const words = devotional.scripture.split(' ');
    const chunkSize = Math.ceil(words.length / 5); // 5 parts max
    const parts: string[] = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      parts.push(words.slice(i, i + chunkSize).join(' '));
    }

    setStoryParts(parts);
  }, [devotional.scripture]);

  const addToPart = (partIndex: number, text: string) => {
    const newStory = currentStory + ' ' + storyParts[partIndex] + ' ' + text;
    setCurrentStory(newStory.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto ${
          section === 'children'
            ? 'bg-gradient-to-br from-yellow-100 to-green-100'
            : 'bg-gradient-to-br from-purple-900 to-blue-900 text-white'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3
            className={`text-2xl font-bold ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}
          >
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

        {/* Story Preview */}
        <div
          className={`p-4 rounded-xl mb-6 ${
            section === 'children'
              ? 'bg-white border-2 border-yellow-300'
              : 'bg-gray-800 border-2 border-purple-500'
          }`}
        >
          <h4
            className={`font-bold mb-2 ${
              section === 'children' ? 'text-gray-800' : 'text-white'
            }`}
          >
            Your Story:
          </h4>
          <p
            className={`${
              section === 'children' ? 'text-gray-700' : 'text-gray-300'
            }`}
          >
            {currentStory || 'Start building your story by clicking the parts below!'}
          </p>
        </div>

        {/* Parts Input */}
        <div className="space-y-3">
          {storyParts.map((part, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className={`flex-1 p-3 rounded-lg ${
                  section === 'children'
                    ? 'bg-blue-100 text-gray-800'
                    : 'bg-gray-700 text-white'
                }`}
              >
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

        {/* Finish Button */}
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

        {/* Results */}
        {isCompleted && (
          <div
            className={`mt-6 p-4 rounded-xl ${
              section === 'children'
                ? 'bg-yellow-100 border-2 border-yellow-400'
                : 'bg-gray-700 border-2 border-purple-500 text-white'
            }`}
          >
            <h4 className="font-bold mb-2">🎉 Great job!</h4>

            <p className="mb-3">
              <strong>Your Story:</strong> {currentStory || 'No story built yet.'}
            </p>

            <p>
              <strong>Scripture Story:</strong> {devotional.scripture}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
