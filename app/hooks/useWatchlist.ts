import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_STORAGE_KEY = '@crypto_watchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load the watchlist from storage on initial hook use
  React.useEffect(() => {
    const loadWatchlist = async () => {
      try {
        const storedWatchlist = await AsyncStorage.getItem(WATCHLIST_STORAGE_KEY);
        if (storedWatchlist !== null) {
          setWatchlist(JSON.parse(storedWatchlist));
        }
      } catch (error) {
        console.error('Failed to load watchlist from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  // Save the watchlist to storage whenever it changes
  const saveWatchlist = async (newWatchlist: string[]) => {
    try {
      await AsyncStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(newWatchlist));
    } catch (error) {
      console.error('Failed to save watchlist to storage', error);
    }
  };

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prevWatchlist) => {
      const newWatchlist = prevWatchlist.includes(coinId)
        ? prevWatchlist.filter((id) => id !== coinId)
        : [...prevWatchlist, coinId];
      
      saveWatchlist(newWatchlist);
      return newWatchlist;
    });
  };

  return { watchlist, toggleWatchlist, loading };
};