// In src/types/exchange.ts
export type Exchange = {
  id: string;
  name: string;
  number_of_coins: number;
  trade_volume_24h_btc: number;
  trust_score: number | null; // Ensure consistency here
  url: string;
};
