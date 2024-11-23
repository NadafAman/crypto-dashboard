import Link from 'next/link';
import { Home, Star, TrendingUp } from 'lucide-react';

const Navbar: React.FC = () => {


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 py-3 z-50 shadow-lg transform transition-all ease-in-out duration-300">
      <div className="flex justify-around items-center max-w-4xl mx-auto space-x-8">
        <Link href="/" className="flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
          <Home className="text-gray-600 dark:text-gray-300 text-2xl hover:scale-110 transform transition-all" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/favorites" className="flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
          <Star className="text-gray-600 dark:text-gray-300 text-2xl hover:scale-110 transform transition-all" />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        
        <Link href="/exchanges" className="flex flex-col items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
          <TrendingUp className="text-gray-600 dark:text-gray-300 text-2xl hover:scale-110 transform transition-all" />
          <span className="text-xs mt-1">Exchanges</span>
        </Link>
        

      </div>
    </nav>
  );
};

export default Navbar;
