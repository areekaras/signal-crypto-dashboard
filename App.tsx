import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./app/navigation/AppNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useCryptoStore } from "./app/state/useCryptoStore";

export default function App() {
  // Get the loadWatchlist action from the store
  const { loadWatchlist } = useCryptoStore();

  // On initial app load, call the action to load data from AsyncStorage
  React.useEffect(() => {
    loadWatchlist();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
