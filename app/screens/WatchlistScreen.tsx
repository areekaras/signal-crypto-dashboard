import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "../theme/theme";
import { useCryptoStore } from "../state/useCryptoStore";
import { useWatchlist } from "../hooks/useWatchlist";
import PriceTicker from "../components/PriceTicker";

const WatchlistScreen = () => {
  const { coins } = useCryptoStore();
  const { watchlist, loading } = useWatchlist();

  // Use React.useMemo to efficiently filter the coins.
  // This will only re-calculate when the 'coins' or 'watchlist' arrays change.
  const favoritedCoins = React.useMemo(() => {
    return coins.filter((coin) => watchlist.includes(coin.id));
  }, [coins, watchlist]);

  if (loading) {
    return <View style={styles.container} />;
  }

  if (favoritedCoins.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>Your watchlist is empty.</Text>
        <Text style={styles.emptySubText}>
          Tap the star on a coin's detail page to add it.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritedCoins}
        renderItem={({ item }) => (
          <PriceTicker
            id={item.id}
            name={item.name}
            symbol={item.symbol}
            price={item.current_price}
            priceChangePercentage={item.price_change_percentage_24h}
            iconUrl={item.image}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptySubText: {
    color: theme.colors.subtext,
    fontSize: 14,
    textAlign: "center",
    marginTop: theme.spacing.s,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.foreground,
    marginLeft: theme.spacing.m,
  },
});

export default WatchlistScreen;
