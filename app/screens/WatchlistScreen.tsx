import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import { theme } from "../theme/theme";
import { useCryptoStore } from "../state/useCryptoStore";
import PriceTicker from "../components/PriceTicker";
import { Coin } from "../api/coingeckoAPI";

const WatchlistScreen = () => {
  const { coins, watchlist, loadingWatchlist, toggleWatchlist } =
    useCryptoStore();

  const isInitialRender = React.useRef(true);

  const favoritedCoins = React.useMemo(() => {
    return coins.filter((coin) => watchlist.includes(coin.id));
  }, [coins, watchlist]);

  const renderItem = React.useCallback(
    ({ item }: { item: Coin }) => (
      <PriceTicker
        id={item.id}
        name={item.name}
        symbol={item.symbol}
        price={item.current_price}
        priceChangePercentage={item.price_change_percentage_24h}
        iconUrl={item.image}
        onRemove={toggleWatchlist}
      />
    ),
    [toggleWatchlist]
  );

  React.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [favoritedCoins.length]);

  if (loadingWatchlist) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 72 + 1,
          offset: (72 + 1) * index,
          index,
        })}
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
