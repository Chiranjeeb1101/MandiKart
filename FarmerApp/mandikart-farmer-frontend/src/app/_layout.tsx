/**
 * MandiKart Farmer App — Root Navigation Layout (Per-Screen Custom Animations)
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A1A0D' },
          animation: 'slide_from_right',
          animationDuration: 320,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="language-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="auth/login" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="auth/verify-otp" options={{ animation: 'flip' }} />
        <Stack.Screen name="onboarding/farmer-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/farm-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="more/documents" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="more/bank-details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="more/notifications" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="more/help-support" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="more/terms-privacy" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="more/settings" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
