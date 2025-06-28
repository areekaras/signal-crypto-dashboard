import { create } from 'zustand';
import { Coin } from '../api/coingeckoAPI';

interface CryptoState {
  coins: Coin[];
  setCoins: (newCoins: Coin[]) => void;
  updateCoinPrice: (
    id: string,
    current_price: number,
    price_change_percentage_24h: number
  ) => void;
}

export const useCryptoStore = create<CryptoState>((set) => ({
  coins: [],
  setCoins: (newCoins) => set({ coins: newCoins }),
  updateCoinPrice: (id, current_price, price_change_percentage_24h) =>
    set((state) => ({
      coins: state.coins.map((coin) =>
        coin.id === id
          ? { ...coin, current_price, price_change_percentage_24h }
          : coin
      ),
    })),
}));
