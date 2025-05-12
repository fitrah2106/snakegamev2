'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SnakeGame from '@/components/SnakeGame';
import Image from 'next/image';
import { playSound } from '@/lib/sounds';

interface User {
  username: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    playSound('click');
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-24 relative">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/ChatGPT Image May 12, 2025, 09_11_57 AM.png"
          alt="Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8 bg-white/80 p-4 rounded-lg backdrop-blur-sm">
          <div>
            <h1 className="text-4xl font-bold">Snake Game</h1>
            <p className="text-gray-600">Welcome, {user.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
        <div className="bg-white/80 p-6 rounded-lg backdrop-blur-sm">
          <SnakeGame />
        </div>
      </div>
    </main>
  );
}
