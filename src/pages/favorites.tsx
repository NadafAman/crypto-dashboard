// pages/favorites.tsx
import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import CryptoCard from "../components/CryptoCard";
import Navbar from "../components/Navbar";
import { fetchCryptocurrencies } from "../utils/fetchers";
import { Link } from "lucide-react";

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
}

const FavoritesPage: NextPage = () => {
  const [favorites, setFavorites] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        
        // Get favorite crypto IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");
        console.log("Favorite IDs from localStorage:", favoriteIds); // Debug log

        if (favoriteIds.length === 0) {
          setFavorites([]);
          setIsLoading(false);
          return;
        }

        // Fetch cryptocurrency data
        const cryptoData = await fetchCryptocurrencies(1, 'market_cap_desc', 50, 'usd');
        console.log("Fetched crypto data:", cryptoData); // Debug log

        // Filter only the favorited cryptocurrencies
        const favoriteCryptos = cryptoData.filter((crypto: Cryptocurrency) => 
          favoriteIds.includes(crypto.id)
        );
        console.log("Filtered favorites:", favoriteCryptos); // Debug log

        setFavorites(favoriteCryptos);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load favorites when the component mounts
    loadFavorites();

    // Add event listener for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl m-7 font-bold text-center text-gray-100">
          Favorite Cryptocurrencies
        </h1>

        {isLoading ? (
          <div className="text-center text-gray-300 my-8">
            Loading your favorites...
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-300 my-8">
            <p className="mb-4">You have not added any cryptocurrencies to your favorites yet.</p>
            <Link
              href="/"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              Go to the homepage to add some favorites
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
            {favorites.map((crypto) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                currentPrice={crypto.current_price}
                priceChangePercentage24h={crypto.price_change_percentage_24h}
                image={crypto.image}
              />
            ))}
          </div>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default FavoritesPage;