import React, { useState, useEffect } from 'react';
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

export default function ColoringGame({
  devotional,
  section,
  onComplete,
  onClose,
}: ColoringGameProps) {
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [coloredPaths, setColoredPaths] = useState<{ [key: string]: string }>({});
  const [selectedSvg, setSelectedSvg] = useState<number>(0);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  ];

  const handlePathClick = (pathId: string) => {
    setColoredPaths((prev) => ({
      ...prev,
      [pathId]: selectedColor,
    }));
  };

  // Pick random SVG when game starts
  useEffect(() => {
    setSelectedSvg(Math.floor(Math.random() * 5)); // now 5 SVGs
  }, []);

  // Define different SVG templates
  const svgs = [
    // 1. House
    <svg key="house" viewBox="0 0 200 200" className="w-full h-48">
      <path d="M50 150 L50 100 L100 50 L150 100 L150 150 Z"
        fill={coloredPaths['house'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('house')} className="cursor-pointer hover:opacity-80"/>
      <rect x="90" y="120" width="20" height="30"
        fill={coloredPaths['door'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('door')} className="cursor-pointer hover:opacity-80"/>
      <rect x="65" y="110" width="15" height="15"
        fill={coloredPaths['window'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('window')} className="cursor-pointer hover:opacity-80"/>
      <circle cx="170" cy="30" r="15"
        fill={coloredPaths['sun'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('sun')} className="cursor-pointer hover:opacity-80"/>
    </svg>,

    // 2. Flower
    <svg key="flower" viewBox="0 0 200 200" className="w-full h-48">
      <circle cx="100" cy="100" r="20"
        fill={coloredPaths['center'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('center')} className="cursor-pointer hover:opacity-80"/>
      {['p1', 'p2', 'p3', 'p4'].map((id, i) => (
        <circle key={id}
          cx={100 + 40 * Math.cos((i * Math.PI) / 2)}
          cy={100 + 40 * Math.sin((i * Math.PI) / 2)}
          r="20"
          fill={coloredPaths[id] || 'white'} stroke="#333" strokeWidth="2"
          onClick={() => handlePathClick(id)} className="cursor-pointer hover:opacity-80"/>
      ))}
    </svg>,

    // 3. Fish
    <svg key="fish" viewBox="0 0 200 200" className="w-full h-48">
      <ellipse cx="100" cy="100" rx="60" ry="30"
        fill={coloredPaths['body'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('body')} className="cursor-pointer hover:opacity-80"/>
      <polygon points="160,100 190,80 190,120"
        fill={coloredPaths['tail'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('tail')} className="cursor-pointer hover:opacity-80"/>
      <circle cx="80" cy="95" r="5"
        fill={coloredPaths['eye'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('eye')} className="cursor-pointer hover:opacity-80"/>
    </svg>,

    // 4. Star
    <svg key="star" viewBox="0 0 200 200" className="w-full h-48">
      <polygon
        points="100,20 120,80 180,80 130,120 150,180 100,140 50,180 70,120 20,80 80,80"
        fill={coloredPaths['star'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('star')} className="cursor-pointer hover:opacity-80"/>
    </svg>,

    // 5. Butterfly
    <svg key="butterfly" viewBox="0 0 200 200" className="w-full h-48">
      {/* Left Wing */}
      <ellipse cx="70" cy="100" rx="40" ry="60"
        fill={coloredPaths['leftWing'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('leftWing')} className="cursor-pointer hover:opacity-80"/>
      {/* Right Wing */}
      <ellipse cx="130" cy="100" rx="40" ry="60"
        fill={coloredPaths['rightWing'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('rightWing')} className="cursor-pointer hover:opacity-80"/>
      {/* Body */}
      <rect x="95" y="60" width="10" height="80"
        fill={coloredPaths['body'] || 'white'} stroke="#333" strokeWidth="2"
        onClick={() => handlePathClick('body')} className="cursor-pointer hover:opacity-80"/>
      {/* Antennas */}
      <line x1="100" y1="60" x2="85" y2="30" stroke="#333" strokeWidth="2"/>
      <line x1="100" y1="60" x2="115" y2="30" stroke="#333" strokeWidth="2"/>
    </svg>,
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-yellow-100 to-green-100 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">🎨 Color & Learn</h3>
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

        {/* Random SVG Coloring Page */}
        <div className="bg-white p-4 rounded-xl mb-6">
          {svgs[selectedSvg]}
        </div>

        <button
          onClick={() => onComplete()}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
        >
          Finish Coloring
        </button>
      </div>
    </div>
  );
}
