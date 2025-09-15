import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Selection</Text>
      <Text>Selection Screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});