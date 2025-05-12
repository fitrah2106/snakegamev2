'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { playSound } from '@/lib/sounds';

export default function MainMenu() {
  const [isMounted, setIsMounted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initializeAudio = () => {
    if (!audioInitialized) {
      playSound('background');
      setAudioInitialized(true);
    }
  };

  const handleClick = () => {
    if (isMounted) {
      playSound('click');
      initializeAudio();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-pulse">
          Snake Game
        </h1>
        <p className="text-xl text-gray-300">Welcome to the classic Snake Game!</p>
      </div>

      {!audioInitialized && (
        <button
          onClick={initializeAudio}
          className="mb-8 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl text-xl font-bold hover:from-yellow-600 hover:to-orange-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
        >
          Start Game
        </button>
      )}

      <div className="grid gap-6 w-full max-w-md">
        <Link 
          href="/game" 
          onClick={handleClick}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-xl font-bold hover:from-purple-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/50 text-center"
        >
          New Game
        </Link>

        <Link 
          href="/load-game" 
          onClick={handleClick}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-purple-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/50 text-center"
        >
          Load Game
        </Link>

        <div className="flex gap-4">
          <Link 
            href="/login" 
            onClick={handleClick}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-xl font-bold hover:from-green-600 hover:to-emerald-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/50 text-center"
          >
            Login
          </Link>

          <Link 
            href="/register" 
            onClick={handleClick}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-xl font-bold hover:from-emerald-600 hover:to-green-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-emerald-500/50 text-center"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="mt-12 text-gray-400 text-sm">
        <p>Use arrow keys or swipe to control the snake</p>
        <p className="mt-2">Collect food to grow and earn points!</p>
      </div>
    </div>
  );
}