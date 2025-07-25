import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { theme } from "../theme/theme";
import { fetchTop100Coins, Coin } from "../api/coingeckoAPI";
import PriceTicker from "../components/PriceTicker";
import { useCryptoStore } from "../state/useCryptoStore";
import { WebSocketService } from "../api/websocketService";

const renderItem = ({ item }: { item: Coin }) => (
  <PriceTicker
    id={item.id}
    name={item.name}
    symbol={item.symbol}
    price={item.current_price}
    priceChangePercentage={item.price_change_percentage_24h}
    iconUrl={item.image}
  />
);

const MarketsScreen = () => {
  const { coins, setCoins, updateCoinPrice } = useCryptoStore();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const loadCoins = React.useCallback(async () => {
    try {
      const initialCoins = await fetchTop100Coins();
      setCoins(initialCoins);
    } catch (error) {
      console.error("Failed to fetch coins:", error);
    }
  }, [setCoins]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadCoins();
    setRefreshing(false);
  }, [loadCoins]);

  React.useEffect(() => {
    const ws = new WebSocketService();
    const getInitialDataAndConnect = async () => {
      setLoading(true);
      await loadCoins();
      setLoading(false);
      const productIds = useCryptoStore
        .getState()
        .coins.map((coin) => `${coin.symbol.toUpperCase()}-SGD`);
      ws.connect(productIds, (productId, price, change) => {
        const symbol = productId.split("-")[0].toLowerCase();
        const coinToUpdate = useCryptoStore
          .getState()
          .coins.find((c) => c.symbol === symbol);
        if (coinToUpdate) {
          updateCoinPrice(
            coinToUpdate.id,
            parseFloat(price),
            parseFloat(change)
          );
        }
      });
    };
    getInitialDataAndConnect();
    return () => {
      ws.disconnect();
    };
  }, [loadCoins, updateCoinPrice]);

  const filteredCoins = React.useMemo(() => {
    if (!searchQuery) {
      return coins;
    }
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coins, searchQuery]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Coins..."
          placeholderTextColor={theme.colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredCoins}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
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
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.foreground,
  },
  searchInput: {
    backgroundColor: theme.colors.foreground,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: 8,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.foreground,
    marginLeft: theme.spacing.m,
  },
});

export default MarketsScreen;
