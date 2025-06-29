import React from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { theme } from "../theme/theme";
import { fetchTop100Coins, Coin } from "../api/coingeckoAPI";
import PriceTicker from "../components/PriceTicker";
import { useCryptoStore } from "../state/useCryptoStore";
import { WebSocketService } from "../api/websocketService";

// THE FIX: Define renderItem outside the component.
// This ensures the function reference is stable and not re-created on every render.
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
  // Get state and actions from the Zustand store
  const { coins, setCoins, updateCoinPrice } = useCryptoStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const ws = new WebSocketService();

    const getInitialDataAndConnect = async () => {
      try {
        setLoading(true);
        const initialCoins = await fetchTop100Coins();
        setCoins(initialCoins);

        // Convert coin symbols to Coinbase product_ids (e.g., 'bitcoin' -> 'BTC-SGD')
        const productIds = initialCoins.map(
          (coin) => `${coin.symbol.toUpperCase()}-SGD`
        );

        // Connect to WebSocket with the list of product IDs
        ws.connect(productIds, (productId, price, change) => {
          // The ID from WebSocket is 'BTC-SGD', we need to find the coin by its symbol 'btc'
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
      } catch (error) {
        console.error("Failed to fetch coins:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialDataAndConnect();

    // Disconnect when the component unmounts
    return () => {
      ws.disconnect();
    };
  }, [setCoins, updateCoinPrice]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={coins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          // Height of one row (PriceTicker) + height of one separator
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
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.foreground,
    marginLeft: theme.spacing.m,
  },
});

export default MarketsScreen;
