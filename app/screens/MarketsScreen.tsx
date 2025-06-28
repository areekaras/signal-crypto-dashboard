import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import { theme } from '../theme/theme';
import { fetchTop100Coins, Coin } from '../api/coingeckoAPI';
import PriceTicker from '../components/PriceTicker';

const MarketsScreen = () => {
  const [coins, setCoins] = React.useState<Coin[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getCoins = async () => {
      try {
        const data = await fetchTop100Coins();
        setCoins(data);
      } catch (error) {
        console.error("Failed to fetch coins:", error);
        // Here you could set an error state to show a message to the user
      } finally {
        setLoading(false);
      }
    };

    getCoins();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Coin }) => (
    <PriceTicker
      name={item.name}
      symbol={item.symbol}
      price={item.current_price}
      priceChangePercentage={item.price_change_percentage_24h}
      iconUrl={item.image}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={coins}
        renderItem={renderItem}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.foreground,
    marginLeft: theme.spacing.m,
  }
});

export default MarketsScreen;