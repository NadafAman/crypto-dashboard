import axios from 'axios';

interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  image: string;
  price_change_percentage_24h: number;
  total_volume: number;
}

interface MarketChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

interface Exchange {
  id: string;
  name: string;
  trust_score: number;
  trade_volume_24h_btc: number;
  url: string;
}

interface CryptoDetailsParams {
  vs_currency?: string;
  days?: number;
}

const BASE_URL = 'https://api.coingecko.com/api/v3';

// export const fetchCryptocurrencies = async (
//   page: number = 1, 
//   sortBy: string = 'market_cap_desc', // Default sorting by market_cap_desc
//   perPage: number = 50, 
//   vsCurrency: string = 'usd'
// ): Promise<Cryptocurrency[]> => {
//   try {
//     const { data } = await axios.get<Cryptocurrency[]>(`${BASE_URL}/coins/markets`, {
//       params: {
//         vs_currency: vsCurrency,
//         order: sortBy, // Use sortBy instead of the fixed 'market_cap_desc'
//         per_page: perPage,
//         page: page,
//         sparkline: false
//       },
//     });
//     return data;
//   } catch (error) {
//     console.error('Error fetching cryptocurrencies:', error);
//     throw error;
//   }
// };

export const fetchCryptoDetails = async (
  id: string, 
  params: CryptoDetailsParams = {}
): Promise<MarketChartData> => {
  try {
    const { data } = await axios.get<MarketChartData>(`${BASE_URL}/coins/${id}/market_chart`, {
      params: { 
        vs_currency: params.vs_currency || 'usd', 
        days: params.days || 30 
      },
    });
    return data;
  } catch (error) {
    console.error(`Error fetching details for crypto ${id}:`, error);
    throw error;
  }
};

export const fetchExchanges = async (): Promise<Exchange[]> => {
  try {
    const { data } = await axios.get<Exchange[]>(`${BASE_URL}/exchanges`);
    return data;
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    throw error;
  }
};

export const fetchSingleCryptocurrency = async (id: string): Promise<Cryptocurrency | null> => {
  try {
    const { data } = await axios.get<Cryptocurrency[]>(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: id,
        order: 'market_cap_desc',
        per_page: 1,
        sparkline: false
      },
    });
    return data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error);
    throw error;
  }
};

export const fetchCryptoHistoricalData = async (id: string, days: number = 30): Promise<[number, number][]> => {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await response.json();
    return data.prices; // Returns an array of tuples [timestamp, price]
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};
// src/utils/fetchers.ts
export const fetchCryptocurrencies = async (
  page: number = 1, 
  sortBy: string = 'market_cap_desc', 
  perPage: number = 50, 
  vsCurrency: string = 'usd' // Add currency parameter with default USD
): Promise<Cryptocurrency[]> => {
  try {
    const { data } = await axios.get<Cryptocurrency[]>(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: vsCurrency, // Use the passed currency
        order: sortBy,
        per_page: perPage,
        page: page,
        sparkline: false
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching cryptocurrencies:', error);
    throw error;
  }
};