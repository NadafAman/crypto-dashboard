// src/recoil/exchangeAtoms.ts
import { atom, selector } from 'recoil';

// Define the Exchange type to match the API response and state structure
export interface Exchange {
  id: string;
  name: string;
  trade_volume_24h_btc: number;
  number_of_coins: number; // Field to reflect the number of listed coins
  trust_score: number | null; // trust_score can be either number or null
  url: string;
}

// Atom to store exchanges state
export const exchangesState = atom<Exchange[]>({
  key: 'exchangesState',
  default: [],
});

// Atom to store search query for filtering exchanges
export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

// Atom to store sorting criteria, which includes the field and direction
export const sortCriteriaState = atom<{
  field: keyof Exchange; // This will restrict the field to only the keys of Exchange
  direction: 'asc' | 'desc'; // Sorting direction
}>({
  key: 'sortCriteriaState',
  default: {
    field: 'trade_volume_24h_btc', // Default sorting by trade volume
    direction: 'desc', // Default to descending order
  },
});

// Selector to filter and sort exchanges based on the search query and sort criteria
export const filteredExchangesSelector = selector<Exchange[]>({
  key: 'filteredExchangesSelector',
  get: ({ get }) => {
    // Get the current exchanges, search query, and sort criteria
    const exchanges = get(exchangesState);
    const searchQuery = get(searchQueryState).toLowerCase();
    const sortCriteria = get(sortCriteriaState);

    // Filter exchanges based on search query (case insensitive)
    const filtered = exchanges.filter((exchange) =>
      exchange.name.toLowerCase().includes(searchQuery)
    );

    // Sort the filtered exchanges based on the selected criteria
    return [...filtered].sort((a, b) => {
      const aValue = a[sortCriteria.field];
      const bValue = b[sortCriteria.field];

      // Handle null or undefined values in sorting
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Compare values based on the sort direction
      const comparison = sortCriteria.direction === 'asc'
        ? (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
        : (aValue < bValue ? 1 : aValue > bValue ? -1 : 0);

      return comparison;
    });
  },
});

// Example usage of the atoms and selector
/*
  // Setting exchanges data
  const [exchanges, setExchanges] = useRecoilState(exchangesState);
  setExchanges(exchangesData);

  // Setting search query
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  setSearchQuery('binance');

  // Setting sort criteria
  const [sortCriteria, setSortCriteria] = useRecoilState(sortCriteriaState);
  setSortCriteria({ field: 'trust_score', direction: 'desc' });

  // Getting filtered and sorted exchanges
  const filteredExchanges = useRecoilValue(filteredExchangesSelector);
*/
