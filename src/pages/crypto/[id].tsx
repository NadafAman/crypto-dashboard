// pages/details/[id].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { fetchCryptoHistoricalData } from "../../utils/fetchers";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Image from "next/image";
import Navbar from "@/components/Navbar";

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HistoricalData {
  timestamp: number;
  price: number;
}

interface CryptoDetailsProps {
  name: string;
  symbol: string;
  market_cap: number;
  image: string;
}

const CryptoDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the cryptocurrency ID from the URL
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetailsProps | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    if (id) {
      // Fetch cryptocurrency details and historical data
      fetchCryptoDetails(id as string);
      fetchHistoricalData(id as string);
    }
  }, [id]);

  // Fetch cryptocurrency details (like market cap, name, symbol, etc.)
  const fetchCryptoDetails = async (cryptoId: string) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${cryptoId}`
      );
      const data = await response.json();
      setCryptoDetails({
        name: data.name,
        symbol: data.symbol,
        market_cap: data.market_data.market_cap.usd,
        image: data.image.large,
      });
    } catch (error) {
      console.error("Error fetching crypto details:", error);
    }
  };

  // Fetch historical price data for the selected cryptocurrency
  const fetchHistoricalData = async (cryptoId: string) => {
    try {
      const prices = await fetchCryptoHistoricalData(cryptoId);
      const formattedData = prices.map(([timestamp, price]) => ({
        timestamp,
        price,
      }));
      setHistoricalData(formattedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  // Prepare chart data for historical prices
  const chartData = {
    labels: historicalData.map(data => new Date(data.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: `${cryptoDetails?.name} Price (USD)`,
        data: historicalData.map(data => data.price),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-6 py-8">
        {cryptoDetails ? (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              {cryptoDetails.name} ({cryptoDetails.symbol.toUpperCase()})
            </h1>
            <div className="flex justify-center mb-6">
              <Image
                src={cryptoDetails.image}
                alt={cryptoDetails.name}
                width={120}
                height={120}
                className="rounded-full shadow-lg"
              />
            </div>
            <p className="text-center text-xl text-gray-700 dark:text-gray-300 mb-4">
              Market Cap: <span className="font-semibold">${cryptoDetails.market_cap.toLocaleString()}</span>
            </p>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Price History (Last 30 Days)
            </h2>
            {historicalData.length > 0 ? (
              <div className="w-full h-80 lg:h-96 xl:h-[500px] mb-8">
                <Line data={chartData} />
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading historical price data...
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading details...</p>
        )}
      </div>
      <Navbar />
    </div>
  );
};

export default CryptoDetails;
