import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Reusable auth screen background with faded green → white → faded orange gradient.
 * Wrap any auth screen content with this component.
 */
export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.root}>
      {/* Top-left green blob */}
      <LinearGradient
        colors={['rgba(35,134,54,0.18)', 'rgba(35,134,54,0.0)']}
        style={styles.blobTopLeft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Bottom-right orange blob */}
      <LinearGradient
        colors={['rgba(245,158,11,0.16)', 'rgba(245,158,11,0.0)']}
        style={styles.blobBottomRight}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
      {/* Content sits on top */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  blobTopLeft: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  content: {
    flex: 1,
  },
});
