import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import CryptoCard from "../components/CryptoCard";
import Navbar from "../components/Navbar";
import { fetchCryptocurrencies } from "../utils/fetchers";

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
}

const HomePage: NextPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "market_cap" | "change">("price");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadCryptocurrencies = async () => {
      try {
        const data = await fetchCryptocurrencies(page, sortBy);
        setCryptocurrencies(data);
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies", error);
      }
    };

    loadCryptocurrencies();
  }, [page, sortBy]);

  // Filter cryptocurrencies based on search term
  const filteredCryptocurrencies = cryptocurrencies
    .filter((crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return b.current_price - a.current_price;
        case "market_cap":
          return b.market_cap - a.market_cap;
        case "change":
          return (
            b.price_change_percentage_24h - a.price_change_percentage_24h
          );
        default:
          return 0;
      }
    });

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "price" | "market_cap" | "change";
    setSortBy(value);
    setPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl m-7 font-bold text-center text-gray-100">
          Cryptocurrency Market
        </h1>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full sm:w-48 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            >
              <option value="price">Sort by Price</option>
              <option value="market_cap">Sort by Market Cap</option>
              <option value="change">Sort by 24h Change</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {cryptocurrencies.length === 0 && (
          <div className="text-center text-gray-300 my-8">
            Loading cryptocurrencies...
          </div>
        )}

        {/* Displaying cryptocurrency cards in a responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-8">
          {filteredCryptocurrencies.map((crypto) => (
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

        {/* No results message */}
        {filteredCryptocurrencies.length === 0 && cryptocurrencies.length > 0 && (
          <div className="text-center text-gray-300 my-8">
            No cryptocurrencies found matching your search.
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default HomePage;