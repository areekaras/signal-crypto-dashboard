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
import { fetchHistoricalData } from "../api/coingeckoAPI";
import { LineChart } from "react-native-chart-kit";
import { useCryptoStore } from "../state/useCryptoStore";
import { useWatchlist } from "../hooks/useWatchlist";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
type NavigationProps = StackNavigationProp<RootStackParamList>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { coinId } = route.params;

  const coin = useCryptoStore((state) =>
    state.coins.find((c) => c.id === coinId)
  );
  const { watchlist, toggleWatchlist } = useWatchlist();

  const [chartData, setChartData] = React.useState<number[]>([]);
  const [loadingChart, setLoadingChart] = React.useState(true);

  const isinWatchlist = watchlist.includes(coinId);

  // Use useLayoutEffect to set navigation options BEFORE the screen renders
  React.useLayoutEffect(() => {
    if (coin) {
      navigation.setOptions({
        title: coin.name,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => toggleWatchlist(coinId)}
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
  }, [navigation, isinWatchlist, coin]);

  React.useEffect(() => {
    const getChartData = async () => {
      try {
        const data = await fetchHistoricalData(coinId);
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoadingChart(false);
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
      <Text style={styles.price}>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "SGD",
        }).format(coin.current_price)}
      </Text>

      {loadingChart ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 50 }}
        />
      ) : (
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
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  text: {
    color: theme.colors.text,
  },
});

export default DetailsScreen;