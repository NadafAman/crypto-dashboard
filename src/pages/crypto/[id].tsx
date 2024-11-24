// pages/details/[id].tsx
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { fetchCryptoHistoricalData } from "../../utils/fetchers";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from 'framer-motion';

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
  const { id } = router.query;
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetailsProps | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    if (id) {
      fetchCryptoDetails(id as string);
      fetchHistoricalData(id as string);
    }
  }, [id]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8"
      >
        {cryptoDetails ? (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              {cryptoDetails.name} ({cryptoDetails.symbol.toUpperCase()})
            </h1>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <Image
                src={cryptoDetails.image}
                alt={cryptoDetails.name}
                width={120}
                height={120}
                className="rounded-full shadow-lg"
              />
            </motion.div>
            <p className="text-center text-xl text-gray-700 dark:text-gray-300 mb-4">
              Market Cap: <span className="font-semibold">${cryptoDetails.market_cap.toLocaleString()}</span>
            </p>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Price History (Last 30 Days)
            </h2>
            {historicalData.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-80 lg:h-96 xl:h-[500px] mb-8"
              >
                <Line data={chartData} />
              </motion.div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading historical price data...
              </p>
            )}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading details...</p>
        )}
      </motion.div>
      <Navbar />
    </motion.div>
  );
};

export default CryptoDetails;
