'use client';

import { useEffect, useState, useCallback } from 'react';
import { playSound, stopSound } from '@/lib/sounds';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  // Start background music when component mounts
  useEffect(() => {
    playSound('background');
    return () => {
      stopSound('background');
    };
  }, []);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const saveGameReport = async (finalScore: number) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('Attempting to save score:', finalScore);

      const response = await fetch('/api/game-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: finalScore }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Save response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save game report');
      }
    } catch (error) {
      console.error('Error saving game report:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save score');
    } finally {
      setIsSaving(false);
    }
  };

  const resetGame = () => {
    playSound('click');
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setSaveError(null);
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    playSound('click');
    switch (event.key) {
      case 'ArrowUp':
        if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [direction]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    playSound('click');

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && direction.x !== -1) {
        setDirection({ x: 1, y: 0 }); // Right
      } else if (deltaX < 0 && direction.x !== 1) {
        setDirection({ x: -1, y: 0 }); // Left
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && direction.y !== -1) {
        setDirection({ x: 0, y: 1 }); // Down
      } else if (deltaY < 0 && direction.y !== 1) {
        setDirection({ x: 0, y: -1 }); // Up
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((currentSnake) => {
        const head = currentSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          playSound('gameOver');
          saveGameReport(score);
          return currentSnake;
        }

        const newSnake = [newHead, ...currentSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          playSound('eat');
          setFood(generateFood());
          const newScore = score + 1;
          setScore(newScore);
          
          // Play score sound every 100 points
          if (newScore % 100 === 0) {
            playSound('score');
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, generateFood, score]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg border-b border-purple-500/30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Snake Game
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              High Score: {highScore}
            </div>
            <button
              onClick={() => {
                playSound('click');
                setIsPaused(!isPaused);
              }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-center mb-4 animate-pulse">
            Score: {score}
          </div>
          <div
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-purple-500/30 mx-auto transform hover:scale-[1.02] transition-transform duration-300"
            style={{
              width: GRID_SIZE * CELL_SIZE,
              height: GRID_SIZE * CELL_SIZE,
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  left: segment.x * CELL_SIZE,
                  top: segment.y * CELL_SIZE,
                }}
              >
                <div className={`w-full h-full rounded-md ${
                  index === 0 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse shadow-lg shadow-purple-500/50' 
                    : 'bg-gradient-to-r from-purple-400 to-blue-400'
                } transform transition-all duration-200 hover:scale-110 relative`}>
                  {index === 0 && (
                    <>
                      {/* Snake Eyes */}
                      <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                      <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
                      {/* Snake Tongue */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-red-500 rounded-full animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            ))}
            {/* Food */}
            <div
              className="absolute"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
              }}
            >
              <div className="w-full h-full relative">
                <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-sm animate-pulse" />
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce" />
                <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full" />
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2" />
                  <div className="absolute top-1/2 right-0 w-1 h-1 bg-white rounded-full transform translate-y-1/2" />
                  <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 w-1 h-1 bg-white rounded-full transform -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="grid grid-cols-3 gap-2 mt-4 max-w-[200px] mx-auto">
            <div className="col-start-2">
              <button
                onClick={() => {
                  playSound('click');
                  if (direction.y !== 1) setDirection({ x: 0, y: -1 });
                }}
                className="w-full aspect-square bg-gradient-to-b from-purple-500 to-blue-500 rounded-lg shadow-lg active:scale-95 transition-transform hover:shadow-purple-500/50 hover:scale-105"
              >
                ↑
              </button>
            </div>
            <div className="col-start-1 row-start-2">
              <button
                onClick={() => {
                  playSound('click');
                  if (direction.x !== 1) setDirection({ x: -1, y: 0 });
                }}
                className="w-full aspect-square bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg active:scale-95 transition-transform hover:shadow-purple-500/50 hover:scale-105"
              >
                ←
              </button>
            </div>
            <div className="col-start-2 row-start-2">
              <button
                onClick={() => {
                  playSound('click');
                  if (direction.y !== -1) setDirection({ x: 0, y: 1 });
                }}
                className="w-full aspect-square bg-gradient-to-t from-purple-500 to-blue-500 rounded-lg shadow-lg active:scale-95 transition-transform hover:shadow-purple-500/50 hover:scale-105"
              >
                ↓
              </button>
            </div>
            <div className="col-start-3 row-start-2">
              <button
                onClick={() => {
                  playSound('click');
                  if (direction.x !== -1) setDirection({ x: 1, y: 0 });
                }}
                className="w-full aspect-square bg-gradient-to-l from-purple-500 to-blue-500 rounded-lg shadow-lg active:scale-95 transition-transform hover:shadow-purple-500/50 hover:scale-105"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg border-t border-purple-500/30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Use arrow keys or swipe to control
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              New Game
            </button>
          </div>
        </div>
      </footer>

      {gameOver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-2xl border-2 border-purple-500/30 max-w-sm w-full transform hover:scale-[1.02] transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent text-center mb-4">
              Game Over!
            </div>
            <div className="text-2xl text-center mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Final Score: {score}
            </div>
            {isSaving ? (
              <div className="text-gray-400 text-center mb-4 animate-pulse">Saving score...</div>
            ) : saveError ? (
              <div className="text-red-400 text-center mb-4">{saveError}</div>
            ) : (
              <div className="text-green-400 text-center mb-4">Score saved!</div>
            )}
            <button
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg font-bold hover:shadow-purple-500/50"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}