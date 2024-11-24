import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Home, Star, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const navItemVariants = {
    hover: { 
      scale: 1.1,
      y: -5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  const navContainerVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const NavLink: React.FC<{
    href: string;
    icon: React.ReactNode;
    label: string;
  }> = ({ href, icon, label }) => (
    <motion.div
      variants={navItemVariants}
      whileHover="hover"
      className="flex flex-col items-center"
    >
      <Link href={href} className="flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400">
        <motion.div
          className="text-gray-600 dark:text-gray-300 text-2xl"
          whileTap={{ scale: 0.9 }}
        >
          {icon}
        </motion.div>
        <motion.span
          className="text-xs mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navContainerVariants}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-3 z-50 shadow-lg"
    >
      <div className="flex justify-around items-center max-w-4xl mx-auto space-x-8">
        <NavLink href="/" icon={<Home />} label="Home" />
        <NavLink href="/favorites" icon={<Star />} label="Favorites" />
        <NavLink href="/exchanges" icon={<TrendingUp />} label="Exchanges" />
        
        <motion.div
          variants={navItemVariants}
          whileHover="hover"
          className="flex flex-col items-center"
        >
          <motion.button 
            onClick={toggleTheme} 
            className="flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ 
                  opacity: 1, 
                  rotateY: 0,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  rotateY: 90,
                  transition: {
                    duration: 0.3,
                    ease: "easeIn"
                  }
                }}
                className="text-gray-600 dark:text-gray-300 text-2xl"
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </motion.div>
            </AnimatePresence>
            <motion.span
              className="text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Theme
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;