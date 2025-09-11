import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

interface ColoringGameProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'teenagers';
  onComplete: () => void;
  onClose: () => void;
}

export default function ColoringGame({ devotional, section, onComplete, onClose }: ColoringGameProps) {
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