import React, { useState } from 'react';
import { Trophy, Star, Target, Zap, Puzzle, Music } from 'lucide-react';
import QuizGame from './games/QuizGame';
import MemoryGame from './games/MemoryGame';
import WordPuzzleGame from './games/WordPuzzleGame';
import CrosswordGame from './games/CrosswordGame';
import StoryBuilderGame from './games/StoryBuilderGame';
import ColoringGame from './games/ColoringGame';
import RhythmGame from './games/RhythmGame';

interface InteractiveElementsProps {
  devotional: {
    title: string;
    scripture: string;
    content: string;
  };
  section: 'children' | 'teenagers';
}

export default function InteractiveElements({ devotional, section }: InteractiveElementsProps) {
  const [activeGame, setActiveGame] = useState<'quiz' | 'memory' | 'puzzle' | 'crossword' | 'story' | 'coloring' | 'rhythm' | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

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
  section: 'children' | 'teenagers';
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