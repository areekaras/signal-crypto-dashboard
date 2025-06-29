import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { theme } from "../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";

interface PriceTickerProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChangePercentage: number;
  iconUrl: string;
}

type NavigationProps = StackNavigationProp<RootStackParamList, "Details">;

const PriceTickerComponent: React.FC<PriceTickerProps> = ({
  id,
  name,
  symbol,
  price,
  priceChangePercentage,
  iconUrl,
}) => {
  const navigation = useNavigation<NavigationProps>();

  const priceChangeStyle =
    priceChangePercentage >= 0 ? styles.positiveChange : styles.negativeChange;

  const formattedPrice = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(price);

  const handlePress = () => {
    navigation.navigate("Details", { coinId: id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.symbol}>{symbol.toUpperCase()}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={priceChangeStyle}>
          {priceChangePercentage.toFixed(2)}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const PriceTicker = React.memo(PriceTickerComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.m,
  },
  nameContainer: {
    flex: 1,
    paddingRight: theme.spacing.s,
  },
  name: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  symbol: {
    color: theme.colors.subtext,
    fontSize: 15,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  positiveChange: {
    color: theme.colors.success,
    fontSize: 14,
    marginTop: 2,
  },
  negativeChange: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 2,
  },
});

export default PriceTicker;