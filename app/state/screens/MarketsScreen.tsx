import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme/theme';

const MarketsScreen = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default MarketsScreen;