import axios from 'axios';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const fetchTop100Coins = async (): Promise<Coin[]> => {
  try {
    const response = await axios.get<Coin[]>(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'sgd',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching top 100 coins:', error);
    return [];
  }
};

// Add this to coingeckoAPI.ts
export const fetchHistoricalData = async (coinId: string): Promise<number[]> => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
    params: {
      vs_currency: 'usd',
      days: '7', // Get data for the last 7 days
    },
  });
  // The API returns an array of [timestamp, price] pairs. We only need the prices.
  return response.data.prices.map((priceData: [number, number]) => priceData[1]);
};