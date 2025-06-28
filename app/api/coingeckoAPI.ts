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
