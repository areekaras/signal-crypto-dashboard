import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Import the types

// Define the component's props
interface PriceTickerProps {
  id: string; // We need the id to navigate
  name: string;
  symbol: string;
  price: number;
  priceChangePercentage: number;
  iconUrl: string;
}

// Define the navigation prop type
type NavigationProps = StackNavigationProp<RootStackParamList, 'Details'>;

const PriceTicker: React.FC<PriceTickerProps> = ({ id, name, symbol, price, priceChangePercentage, iconUrl }) => {
  const navigation = useNavigation<NavigationProps>();

  const priceChangeStyle =
    priceChangePercentage >= 0 ? styles.positiveChange : styles.negativeChange;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
  }).format(price);

  const handlePress = () => {
    navigation.navigate('Details', { coinId: id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.symbol}>{symbol.toUpperCase()}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formattedPrice}</Text>
        <Text style={priceChangeStyle}>{priceChangePercentage.toFixed(2)}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: theme.spacing.m,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbol: {
    color: theme.colors.subtext,
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveChange: {
    color: theme.colors.success,
  },
  negativeChange: {
    color: theme.colors.error,
  },
});

export default PriceTicker;