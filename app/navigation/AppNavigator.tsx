import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import DetailsScreen from '../screens/DetailsScreen';
import { theme } from '../theme/theme';

export type RootStackParamList = {
  Main: undefined; // Main refers to the TabNavigator
  Details: { coinId: string }; // Details screen requires a coinId
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.tabBarBg,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          color: theme.colors.text,
        },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator} 
        options={{ headerShown: false }} // Hide the header for the main tab screen
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        // The header title will be set dynamically inside the DetailsScreen
      />
    </Stack.Navigator>
  );
};
