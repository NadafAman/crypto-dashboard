// src/components/CryptoCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState, currencyState } from "../recoil/atoms";

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
  // Recoil state to manage favorites
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const currency = useRecoilValue(currencyState);

  // Currency symbol mapping
  const currencySymbols: { [key: string]: string } = {
    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
  };

  // Check if the current crypto is in favorites
  const isFavorite = favorites.some((fav) => fav.id === id);

  // Toggle favorite status
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } else {
      // Add to favorites
      setFavorites([...favorites, { id, name, symbol, currentPrice, image }]);
    }
  };

  return (
    <Link href={`/crypto/${id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
        {/* Favorite Toggle Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 z-10"
        >
          <Star
            fill={isFavorite ? "gold" : "none"}
            color={isFavorite ? "gold" : "gray"}
          />
        </button>

        {/* Crypto Info */}
        <div className="flex items-center mb-4">
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className="mr-4 rounded-3xl"
          />
          <div>
            <h3 className="font-bold text-lg dark:text-white">{name}</h3>
            <p className="text-gray-500 dark:text-gray-400 uppercase">
              {symbol}
            </p>
          </div>
        </div>

        {/* Price and Price Change */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-xl dark:text-white">
            {currencySymbols[currency] || "$"}
            {currentPrice.toLocaleString()}
          </span>
          <span
            className={`font-medium ${
              priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"
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
