import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { theme } from '../theme/theme';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchHistoricalData } from '../api/coingeckoAPI';
import { LineChart } from 'react-native-chart-kit';
import { useCryptoStore } from '../state/useCryptoStore';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const { coinId } = route.params;
  
  // Find the coin data from our global store
  const coin = useCryptoStore((state) => state.coins.find((c) => c.id === coinId));

  const [chartData, setChartData] = React.useState<number[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getChartData = async () => {
      try {
        const data = await fetchHistoricalData(coinId);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    getChartData();
  }, [coinId]);

  if (!coin) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Coin not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{coin.name} ({coin.symbol.toUpperCase()})</Text>
      <Text style={styles.price}>
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SGD' }).format(coin.current_price)}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <LineChart
          data={{
            labels: [], // Hide labels for a sparkline look
            datasets: [{ data: chartData }],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={false}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundColor: theme.colors.background,
            backgroundGradientFrom: theme.colors.background,
            backgroundGradientTo: theme.colors.background,
            decimalPlaces: 2,
            color: (opacity = 1) => coin.price_change_percentage_24h >= 0 ? theme.colors.success : theme.colors.error,
            labelColor: (opacity = 1) => theme.colors.text,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0',
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  price: {
    fontSize: 20,
    color: theme.colors.subtext,
  },
  text: {
    color: theme.colors.text,
  },
});

export default DetailsScreen;