'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 20;
  const canvasSize = 400;

  const snake = useRef([{ x: 9, y: 9 }]);
  const direction = useRef({ x: 0, y: 0 });
  const fruit = useRef({ x: 5, y: 5 });

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = 'green';
    snake.current.forEach((part) => {
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = 'red';
    ctx.fillRect(fruit.current.x * gridSize, fruit.current.y * gridSize, gridSize - 2, gridSize - 2);
  };

  const update = () => {
    const head = { ...snake.current[0] };
    head.x += direction.current.x;
    head.y += direction.current.y;

    // Nembus kiri-kanan
    if (head.x < 0) head.x = canvasSize / gridSize - 1;
    if (head.x >= canvasSize / gridSize) head.x = 0;
    if (head.y < 0 || head.y >= canvasSize / gridSize) {
      setGameOver(true);
      return;
    }

    // Game over kalau kena badan sendiri
    if (snake.current.some((seg, i) => i !== 0 && seg.x === head.x && seg.y === head.y)) {
      setGameOver(true);
      return;
    }

    snake.current.unshift(head);

    // Makan buah
    if (head.x === fruit.current.x && head.y === fruit.current.y) {
      setScore((s) => s + 1);
      fruit.current = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)),
        y: Math.floor(Math.random() * (canvasSize / gridSize)),
      };
    } else {
      snake.current.pop();
    }
  };

  const loop: () => void = useCallback(() => {
    if (canvasRef.current && !gameOver) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        update();
        draw(ctx);
      }
      setTimeout(() => requestAnimationFrame(loop), 100);
    } else if (gameOver) {
      postScore(score);
    }
  }, [gameOver, score]);

  const postScore = async (score: number) => {
    await fetch('/api/report', {
      method: 'POST',
      body: JSON.stringify({ score }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp': direction.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': direction.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': direction.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': direction.current = { x: 1, y: 0 }; break;
      }
    });
    requestAnimationFrame(loop);
  }, [loop]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Snake Game</h1>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="border border-black bg-white"
      />
      <p className="mt-4 text-lg">Score: {score}</p>
      {gameOver && <p className="text-red-600 font-bold">Game Over</p>}
    </div>
  );
}
