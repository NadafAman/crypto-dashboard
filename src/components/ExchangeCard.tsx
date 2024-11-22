import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Home, Star, TrendingUp } from 'lucide-react';

const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-3 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center">
          <Home className="text-gray-600 dark:text-gray-300" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/favorites" className="flex flex-col items-center">
          <Star className="text-gray-600 dark:text-gray-300" />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        
        <Link href="/exchanges" className="flex flex-col items-center">
          <TrendingUp className="text-gray-600 dark:text-gray-300" />
          <span className="text-xs mt-1">Exchanges</span>
        </Link>
        
        <button 
          onClick={toggleTheme} 
          className="flex flex-col items-center"
        >
          {theme === 'light' ? (
            <Moon className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="text-gray-600 dark:text-gray-300" />
          )}
          <span className="text-xs mt-1">Theme</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;