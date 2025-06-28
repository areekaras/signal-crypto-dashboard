import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { theme } from './app/theme/theme';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.colors.background} />
      <AppNavigator />
    </NavigationContainer>
  );
}
