import { create } from "zustand";
import { Coin } from "../api/coingeckoAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_STORAGE_KEY = "@crypto_watchlist";

interface CryptoState {
  coins: Coin[];
  watchlist: string[];
  loadingWatchlist: boolean;
  setCoins: (coins: Coin[]) => void;
  updateCoinPrice: (id: string, price: number, change: number) => void;
  loadWatchlist: () => Promise<void>;
  toggleWatchlist: (coinId: string) => void;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  coins: [],
  watchlist: [],
  loadingWatchlist: true, // Default to true
  setCoins: (coins) => set({ coins }),
  updateCoinPrice: (id, price, change) =>
    set((state) => ({
      coins: state.coins.map((coin) =>
        coin.id === id
          ? {
              ...coin,
              current_price: price,
              price_change_percentage_24h: change,
            }
          : coin
      ),
    })),

  loadWatchlist: async () => {
    try {
      const storedWatchlist = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (storedWatchlist !== null) {
        set({ watchlist: JSON.parse(storedWatchlist) });
      }
    } catch (error) {
      console.error("Failed to load watchlist from storage", error);
    } finally {
      set({ loadingWatchlist: false }); // Set loading to false after trying
    }
  },

  toggleWatchlist: async (coinId: string) => {
    const currentWatchlist = get().watchlist;
    const newWatchlist = currentWatchlist.includes(coinId)
      ? currentWatchlist.filter((id) => id !== coinId)
      : [...currentWatchlist, coinId];

    set({ watchlist: newWatchlist });

    try {
      await AsyncStorage.setItem(
        WATCHLIST_STORAGE_KEY,
        JSON.stringify(newWatchlist)
      );
    } catch (error) {
      console.error("Failed to save watchlist to storage", error);
    }
  },
}));
