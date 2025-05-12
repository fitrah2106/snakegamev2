// src/components/Header.tsx
import Link from 'next/link';
import { playSound } from '@/lib/sounds';

export default function Header() {
  const handleClick = () => {
    playSound('click');
  };

  return (
    <header className="w-full p-4 bg-blue-600 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Snake Game</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/" onClick={handleClick}>Home</Link></li>
            <li><Link href="/login" onClick={handleClick}>Login</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
