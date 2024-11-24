
import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center pb-20">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          404
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Page Not Found
        </p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed or does not exist.
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/" 
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Home
          </Link>
          <Link 
            href="/favorites" 
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Favorites
          </Link>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default NotFoundPage;