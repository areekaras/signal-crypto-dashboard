import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { theme } from "../theme/theme";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LineChart } from "react-native-chart-kit";
import { useCryptoStore } from "../state/useCryptoStore";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
type NavigationProps = StackNavigationProp<RootStackParamList>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { coinId } = route.params;

  // Use granular selectors to prevent unnecessary re-renders.
  // Each of these will only trigger a re-render if its specific value changes.
  const coin = useCryptoStore((state) =>
    state.coins.find((c) => c.id === coinId)
  );
  const chartData = useCryptoStore((state) => state.chartDataCache[coinId]);
  const isinWatchlist = useCryptoStore((state) =>
    state.watchlist.includes(coinId)
  );
  const toggleWatchlist = useCryptoStore((state) => state.toggleWatchlist);
  const fetchChartData = useCryptoStore((state) => state.fetchChartData);

  // Determine loading state based on whether chart data is available yet.
  const isLoading = chartData === undefined;

  // Memoize the onPress handler so it has a stable reference.
  const handleToggleWatchlist = React.useCallback(() => {
    toggleWatchlist(coinId);
  }, [coinId, toggleWatchlist]);

  // This effect now has stable dependencies and will not cause an infinite loop.
  React.useLayoutEffect(() => {
    if (coin) {
      navigation.setOptions({
        title: coin.name,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleToggleWatchlist}
            style={{ marginRight: 15 }}
          >
            <Ionicons
              name={isinWatchlist ? "star" : "star-outline"}
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, isinWatchlist, coin?.name, handleToggleWatchlist]);

  // This effect is fine as its dependencies are stable.
  React.useEffect(() => {
    fetchChartData(coinId);
  }, [coinId, fetchChartData]);

  if (!coin) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Coin not found.</Text>
      </View>
    );
  }

  const renderChart = () => {
    if (isLoading) {
      return (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.chartStatus}
        />
      );
    }
    if (chartData && chartData.length === 0) {
      return (
        <Text style={[styles.text, styles.chartStatus]}>
          Could not load chart data.
        </Text>
      );
    }
    if (chartData) {
      return (
        <LineChart
          data={{
            labels: [],
            datasets: [{ data: chartData }],
          }}
          width={Dimensions.get("window").width}
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
            color: (opacity = 1) =>
              coin.price_change_percentage_24h >= 0
                ? theme.colors.success
                : theme.colors.error,
            labelColor: (opacity = 1) => theme.colors.text,
          }}
          style={styles.chart}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.price}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(coin.current_price)}
      </Text>
      {renderChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  text: {
    color: theme.colors.text,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartStatus: {
    height: 220,
    marginTop: 8,
    textAlign: "center",
    paddingTop: 100,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default DetailsScreen;