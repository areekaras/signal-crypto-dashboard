import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../theme/theme';

interface PriceTickerProps {
  name: string;
  symbol: string;
  price: number;
  priceChangePercentage: number;
  iconUrl: string;
}

const PriceTicker: React.FC<PriceTickerProps> = ({
  name,
  symbol,
  price,
  priceChangePercentage,
  iconUrl,
}) => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const priceChangeColor =
    priceChangePercentage >= 0 ? theme.colors.success : theme.colors.error;

  const formattedPriceChange = `${priceChangePercentage >= 0 ? '+' : ''}${priceChangePercentage.toFixed(2)}%`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>{symbol.toUpperCase()}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={[styles.priceChange, { color: priceChangeColor }]}>
          {formattedPriceChange}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  symbol: {
    fontSize: 14,
    color: theme.colors.subtext,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  priceChange: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default PriceTicker;