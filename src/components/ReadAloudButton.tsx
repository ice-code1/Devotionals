import React, { useState } from 'react';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAnalyticsContext } from './AnalyticsProvider';

interface ReadAloudButtonProps {
  text: string;
  section: 'children' | 'teenagers';
}

export default function ReadAloudButton({ text, section }: ReadAloudButtonProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { trackReadAloud } = useAnalyticsContext();
  const {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    rate,
    pitch,
    toggle,
    stop,
    setSelectedVoice,
    setRate,
    setPitch,
  } = useTextToSpeech();

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (isPlaying) {
      trackReadAloud(isPaused ? 'resume' : 'pause');
    } else {
      trackReadAloud('start');
    }
    toggle(text);
  };

  const handleStop = () => {
    trackReadAloud('complete');
    stop();
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 ${
            section === 'children'
              ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          title={isPlaying ? (isPaused ? 'Resume reading' : 'Pause reading') : 'Read aloud'}
        >
          {isPlaying ? (
            isPaused ? (
              <Play className="h-5 w-5" />
            ) : (
              <Pause className="h-5 w-5" />
            )
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          <span>
            {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Read Aloud'}
          </span>
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className={`p-2 rounded-xl transition-all hover:scale-105 ${
              section === 'children'
                ? 'bg-red-200 text-red-800 hover:bg-red-300'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
            title="Stop reading"
          >
            <Square className="h-5 w-5" />
          </button>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl transition-all hover:scale-105 ${
            section === 'children'
              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title="Voice settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-full left-0 mt-2 p-4 rounded-xl shadow-lg z-50 w-80 ${
          section === 'children'
            ? 'bg-white border-2 border-gray-200'
            : 'bg-gray-800 border-2 border-gray-600'
        }`}>
          <h4 className={`font-bold mb-3 ${
            section === 'children' ? 'text-gray-800' : 'text-white'
          }`}>
            Voice Settings
          </h4>

          {/* Voice Selection */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              section === 'children' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Voice
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                if (voice) setSelectedVoice(voice);
              }}
              className={`w-full p-2 rounded-lg border ${
                section === 'children'
                  ? 'bg-white border-gray-300 text-gray-800'
                  : 'bg-gray-700 border-gray-600 text-white'
              }`}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              section === 'children' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Speed: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Pitch Control */}
          <div className="mb-4">
            <label className={`block text-sm font-medium mb-2 ${
              section === 'children' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              section === 'children'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}