import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { theme } from '../theme/theme';
import MarketsScreen from '../state/screens/MarketsScreen';

const Tab = createBottomTabNavigator();

const WatchlistScreen = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />; // Placeholder

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Markets') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Watchlist') {
            iconName = focused ? 'star' : 'star-outline';
          } else {
            iconName = 'help-circle-outline'; // Fallback icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.colors.tabBarBg,
          borderTopWidth: 0, // Remove top border
        },
        headerStyle: {
          backgroundColor: theme.colors.tabBarBg,
          borderBottomWidth: 0, // Remove bottom border
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        headerTintColor: theme.colors.text, // Set header text color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Markets" component={MarketsScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;
