import { useEffect, useState } from 'react';  
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { exchangesState, searchQueryState, sortCriteriaState, filteredExchangesSelector } from '@/recoil/exchangeAtoms';
import { Exchange } from '../types/exchange'; 
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';

export default function ExchangeList() {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [sortCriteria, setSortCriteria] = useRecoilState(sortCriteriaState);
  const setExchanges = useSetRecoilState(exchangesState);
  const filteredExchanges = useRecoilValue(filteredExchangesSelector);

  // Adding local state to manage hydration fix
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/exchanges');
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data: Partial<Exchange>[] = await response.json();

        // Sanitize fetched data
        const sanitizedData = data.map((exchange): Exchange => ({
          id: exchange.id || '',
          name: exchange.name || 'Unknown Exchange',
          number_of_coins: exchange.number_of_coins || 0,
          trade_volume_24h_btc: exchange.trade_volume_24h_btc || 0,
          trust_score: exchange.trust_score ?? null,
          url: exchange.url ?? '',
        }));

        setExchanges(sanitizedData);
        setIsHydrated(true);  // Mark hydration as complete
      } catch (error) {
        console.error('Error fetching exchanges:', error);
      }
    };

    fetchExchanges();
  }, [setExchanges]);

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split('-');
    setSortCriteria({
      field: field as keyof Exchange,
      direction: direction as 'asc' | 'desc',
    });
  };

  // Only render content after hydration is complete
  if (!isHydrated) {
    return <div>Loading...</div>;  // Fallback loading UI
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl m-7 font-bold text-center text-gray-100">Cryptocurrency Exchanges</h1>
        <div className="flex justify-center  gap-4 flex-col md:flex-row items-center">
          <Input
            placeholder="Search exchanges..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm p-2 bg-gray-800 text-white rounded-lg border-violet-50 focus:ring-2 focus:ring-blue-500"
          />
          <Select
            value={`${sortCriteria.field || ''}-${sortCriteria.direction || ''}`}
            onValueChange={handleSortChange}
            className="text-black bg-gray-400 rounded-lg"
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue>
                {sortCriteria.field ? `${sortCriteria.field} (${sortCriteria.direction})` : 'Sort by...'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="trade_volume_24h_btc-desc">Volume (High to Low)</SelectItem>
              <SelectItem value="trade_volume_24h_btc-asc">Volume (Low to High)</SelectItem>
              <SelectItem value="number_of_coins-desc">Coins (High to Low)</SelectItem>
              <SelectItem value="number_of_coins-asc">Coins (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExchanges.map((exchange) => (
          <Card key={exchange.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{exchange.name}</h2>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">24h Volume (BTC):</span>
                  <span className="font-medium">
                    {exchange.trade_volume_24h_btc.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Listed Coins:</span>
                  <span className="font-medium">{exchange.number_of_coins.toLocaleString()}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Navbar />
    </div>
  );
}
