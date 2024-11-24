import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { currencyState } from "../recoil/atoms";
import Navbar from "../components/Navbar";
import axios from "axios";

// Dynamically import components
const CurrencySelector = dynamic(() => 
  import("../components/CurrencySelector").then((mod) => mod.CurrencySelector),
  { ssr: false }
);

const CryptoCard = dynamic(() => 
  import("../components/CryptoCard"),
  { ssr: false }
);

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
  market_cap: number;
}

const fetchCryptocurrencies = async (
  page: number,
  sortBy: "price" | "market_cap" | "change",
  perPage: number,
  currency: string
): Promise<Cryptocurrency[]> => {
  const order = sortBy === "price" ? "market_cap_desc" : sortBy;
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
    params: {
      vs_currency: currency,
      order: order,
      per_page: perPage,
      page: page,
      sparkline: false,
    },
  });
  return data;
};

const HomePage: NextPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "market_cap" | "change">("price");
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useRecoilState(currencyState);

  // Handle currency change
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setPage(1); // Reset to first page when currency changes
  };

  // Fetch cryptocurrencies whenever dependencies change
  useEffect(() => {
    const loadCryptocurrencies = async () => {
      try {
        const data = await fetchCryptocurrencies(page, sortBy, 50, currency);
        setCryptocurrencies(data);
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies", error);
      }
    };
    loadCryptocurrencies();
  }, [page, sortBy, currency]);

  // Filter and sort cryptocurrencies based on search term and sorting criteria
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
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl m-7 font-bold text-center text-gray-100">
          Cryptocurrency Market
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <CurrencySelector 
            value={currency}
            onChange={handleCurrencyChange}
            className="dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "price" | "market_cap" | "change")
            }
            className="w-full sm:w-48 p-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          >
            <option value="price">Sort by Price</option>
            <option value="market_cap">Sort by Market Cap</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>

        {cryptocurrencies.length === 0 && (
          <div className="text-center text-gray-300 my-8">
            Loading cryptocurrencies...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {filteredCryptocurrencies.length === 0 && cryptocurrencies.length > 0 && (
          <div className="text-center text-gray-300 my-8">
            No cryptocurrencies found matching your search.
          </div>
        )}

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-200">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
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