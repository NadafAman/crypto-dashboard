import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { currencyState } from "../recoil/atoms";
import Navbar from "../components/Navbar";
import axios from "axios";
import { motion } from "framer-motion";

// Dynamically import components
const CurrencySelector = dynamic(() =>
  import("../components/CurrencySelector").then((mod) => mod.CurrencySelector),
  { ssr: false }
);

const CryptoCard = dynamic(() => import("../components/CryptoCard"), {
  ssr: false,
});

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
  try {
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets`,
      {
        params: {
          vs_currency: currency.toLowerCase(),
          order:
            sortBy === "price"
              ? "current_price_desc"
              : sortBy === "market_cap"
              ? "market_cap_desc"
              : "price_change_24h_desc",
          per_page: perPage,
          page: page,
          sparkline: false,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    return [];
  }
};

const HomePage: NextPage = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "market_cap" | "change">(
    "price"
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useRecoilState(currencyState);

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    setPage(1);
    setSearchTerm(""); // Reset search when currency changes
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadCryptocurrencies = async () => {
      try {
        const data = await fetchCryptocurrencies(page, sortBy, 50, currency);
        if (isMounted) {
          setCryptocurrencies(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch cryptocurrencies", error);
          setError("Failed to load cryptocurrencies. Please try again later.");
          setIsLoading(false);
        }
      }
    };

    loadCryptocurrencies();

    return () => {
      isMounted = false;
    };
  }, [page, sortBy, currency]);

  const filteredCryptocurrencies = React.useMemo(() => {
    if (!cryptocurrencies || cryptocurrencies.length === 0) return [];

    return cryptocurrencies
      .filter((crypto) => {
        const searchLower = searchTerm.toLowerCase().trim();
        return (
          crypto.name.toLowerCase().includes(searchLower) ||
          crypto.symbol.toLowerCase().includes(searchLower)
        );
      })
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
  }, [cryptocurrencies, searchTerm, sortBy]);

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
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 p-2 rounded-lg border text-black bg-white"
          />
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "price" | "market_cap" | "change")
            }
            className="w-full sm:w-48 p-2 rounded-lg border text-black bg-white"
          >
            <option value="price">Sort by Price</option>
            <option value="market_cap">Sort by Market Cap</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>

        {isLoading && (
          <div className="text-center text-gray-300 my-8">
            Loading cryptocurrencies...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 my-8">{error}</div>
        )}

        {!isLoading && !error && (
          <>
            {filteredCryptocurrencies.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCryptocurrencies.map((crypto, index) => (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                    }}
                  >
                    <CryptoCard
                      id={crypto.id}
                      name={crypto.name}
                      symbol={crypto.symbol}
                      currentPrice={crypto.current_price}
                      priceChangePercentage24h={
                        crypto.price_change_percentage_24h
                      }
                      image={crypto.image}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-gray-300 my-8">
                {searchTerm
                  ? "No cryptocurrencies found matching your search."
                  : "No cryptocurrencies available."}
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-200">Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading || filteredCryptocurrencies.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
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
