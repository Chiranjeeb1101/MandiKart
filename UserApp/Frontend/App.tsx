import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { LocationProvider } from './src/context/LocationContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <SafeAreaProvider>
                {/* Global faded green + orange background — applied to every screen */}
                <View style={styles.root}>
                  <LinearGradient
                    colors={['rgba(35,134,54,0.14)', 'rgba(35,134,54,0.0)']}
                    style={styles.blobTopLeft}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <LinearGradient
                    colors={['rgba(245,158,11,0.13)', 'rgba(245,158,11,0.0)']}
                    style={styles.blobBottomRight}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <NavigationContainer>
                    <StatusBar style="dark" />
                    <RootNavigator />
                  </NavigationContainer>
                </View>
              </SafeAreaProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  blobTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    zIndex: 0,
  },
  blobBottomRight: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    zIndex: 0,
  },
});
