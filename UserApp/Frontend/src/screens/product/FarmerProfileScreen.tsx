import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme';

export default function FarmerProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Farmer Profile (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, color: Colors.textSecondary },
});

