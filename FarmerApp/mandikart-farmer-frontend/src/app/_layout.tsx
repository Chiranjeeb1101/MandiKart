/**
 * MandiKart Farmer App — Root Navigation Layout (Per-Screen Custom Animations)
 */

import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConsentPermissionsModal } from '@/components/ConsentPermissionsModal';
import { FrontendConsentService } from '@/services/consentService';
import '../global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    // Check if user requires terms, cookies & device permissions onboarding
    FrontendConsentService.checkRequiresConsent().then((needed) => {
      if (needed) {
        setShowConsent(true);
      }
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FAF8F5' },
          animation: 'slide_from_right',
          animationDuration: 320,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="language-select" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="onboarding/permissions" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="auth/login" options={{ animation: 'fade_from_bottom' }} />
        <Stack.Screen name="auth/verify-otp" options={{ animation: 'slide_from_right' }} />
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

      {/* Global Legal Consent, 15-Day Cookies & Hardware Permissions Modal */}
      <ConsentPermissionsModal
        visible={showConsent}
        onConsentAccepted={() => setShowConsent(false)}
      />
    </SafeAreaProvider>
  );
}
