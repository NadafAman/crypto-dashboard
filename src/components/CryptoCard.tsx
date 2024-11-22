import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { favoritesState } from '../recoil/atoms';

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceChangePercentage24h: number;
  image: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  name,
  symbol,
  currentPrice,
  priceChangePercentage24h,
  image,
}) => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  
  const isFavorite = favorites.some(fav => fav.id === id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.id !== id));
    } else {
      // Add to favorites
      setFavorites([...favorites, { id, name, symbol, currentPrice, image }]);
    }
  };

  return (
    <Link href={`/crypto/${id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
        <button 
          onClick={toggleFavorite} 
          className="absolute top-2 right-2 z-10"
        >
          <Star 
            fill={isFavorite ? 'gold' : 'none'} 
            color={isFavorite ? 'gold' : 'gray'} 
          />
        </button>
        
        <div className="flex items-center mb-4 ">
          <Image 
            src={image} 
            alt={name} 
            width={40} 
            height={40} 
            className="mr-4 " 
          />
          <div>
            <h3 className="font-bold text-lg dark:text-white">{name}</h3>
            <p className="text-gray-500 dark:text-gray-400 uppercase">{symbol}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl dark:text-white">
            ${currentPrice.toLocaleString()}
          </span>
          <span 
            className={`font-medium ${
              priceChangePercentage24h >= 0 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}
          >
            {priceChangePercentage24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;