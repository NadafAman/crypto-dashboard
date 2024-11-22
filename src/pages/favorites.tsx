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
}

const HomePage: NextPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "market_cap" | "change">(
    "price"
  );
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

  const filteredCryptocurrencies = cryptocurrencies.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 dark:text-white">
          Cryptocurrency Market
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="flex mb-4 space-x-4">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "price" | "market_cap" | "change")
            }
            className="p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          >
            <option value="price">Sort by Price</option>
            <option value="market_cap">Sort by Market Cap</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
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
