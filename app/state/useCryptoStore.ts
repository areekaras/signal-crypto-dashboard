import { create } from "zustand";
import { Coin, fetchHistoricalData } from "../api/coingeckoAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCHLIST_STORAGE_KEY = "@crypto_watchlist";

interface CryptoState {
  coins: Coin[];
  watchlist: string[];
  loadingWatchlist: boolean;
  chartDataCache: { [coinId: string]: number[] };
  setCoins: (coins: Coin[]) => void;
  updateCoinPrice: (id: string, price: number, change: number) => void;
  loadWatchlist: () => Promise<void>;
  toggleWatchlist: (coinId: string) => void;
  fetchChartData: (coinId: string) => Promise<void>;
}

export const useCryptoStore = create<CryptoState>((set, get) => ({
  coins: [],
  watchlist: [],
  loadingWatchlist: true,
  chartDataCache: {},
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
      set({ loadingWatchlist: false });
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

  // New action to fetch chart data with caching
  fetchChartData: async (coinId: string) => {
    // If data is already in the cache, do nothing.
    if (get().chartDataCache[coinId]) {
      return;
    }

    try {
      const data = await fetchHistoricalData(coinId);
      // Add the new data to the cache
      set((state) => ({
        chartDataCache: {
          ...state.chartDataCache,
          [coinId]: data,
        },
      }));
    } catch (error) {
      console.error(`Failed to fetch chart data for ${coinId}:`, error);
      // We can optionally cache an empty array to prevent re-fetching on a known failure
      set((state) => ({
        chartDataCache: {
          ...state.chartDataCache,
          [coinId]: [], // Cache an empty array to signify a failed attempt
        },
      }));
    }
  },
}));
