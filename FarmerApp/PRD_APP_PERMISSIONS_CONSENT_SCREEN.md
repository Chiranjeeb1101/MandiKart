# MandiKart — PRD & System Design: App Permissions, Cookie Sessions & Consent Screen

This document is the official **Product Requirement Document (PRD)** and **Frontend Implementation Guide** for the MandiKart Frontend Developer to integrate the **Legal Consent & App Permissions Onboarding Screen**.

---

## 1. Executive Summary & Why It's Needed

Currently, when a user boots the app locally, it immediately directs them to the Main Dashboard without prompting for mandatory legal acceptance or device hardware permissions. 

To comply with **Digital Personal Data Protection (DPDP) Act 2023**, Google Play Store guidelines, and iOS App Store policies, the app must present an **"Accept & Agree" Legal Consent & Device Permissions Screen** before granting access to dashboard features.

---

## 2. Backend API Contract (Already Deployed & Live)

### A. Auth Response Flag
When calling `POST /api/v1/auth/login` or `POST /api/v1/auth/verify-otp`, the backend returns:
```json
{
  "data": {
    "token": "mks_eyJzZXNzaW9uSWQiOiJzZXNzX...",
    "sessionId": "sess_31ebb507...",
    "expiresAt": "2026-09-18T08:09:12.000Z",
    "farmer": {
      "id": "farmer_ramesh_01",
      "fullName": "Ramesh Patil",
      "phone": "+919876543210",
      "role": "FARMER",
      "hasAcceptedConsent": false,
      "requiresConsent": true
    }
  }
}
```

### B. Consent Status API
- **Endpoint**: `GET /api/v1/consent/status`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "data": {
    "hasAcceptedConsent": false,
    "requiresConsent": true,
    "termsAndConditions": false,
    "privacyPolicy": false,
    "cookiesConsent": false,
    "permissions": {
      "location": false,
      "camera": false,
      "notifications": false,
      "storage": false
    },
    "version": "1.0"
  }
}
```

### C. Consent Agree API
- **Endpoint**: `POST /api/v1/consent/agree`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "termsAndConditions": true,
  "privacyPolicy": true,
  "cookiesConsent": true,
  "permissions": {
    "location": true,
    "camera": true,
    "notifications": true,
    "storage": true
  },
  "version": "1.0"
}
```
- **Response**: `200 OK` (Also sets `Set-Cookie: mks_session=...; HttpOnly; Secure; SameSite=Strict; Max-Age=15d`).

---

## 3. Screen UI & UX Design Specifications

### A. Screen Layout & Visual Hierarchy
- **Header**:
  - MandiKart Logo + Green Shield Icon 🛡️
  - Title: *"Welcome to MandiKart"*
  - Subtitle: *"To provide you seamless mandi rates, crop grading, and buyer dispatches, please review and accept our platform permissions."*

- **Section 1: Mandatory Legal Terms & Cookies**:
  1. **Terms & Conditions**: Checkbox with clickable green link *"Read Terms of Service"*.
  2. **Privacy Policy**: Checkbox with clickable green link *"Read Privacy Policy"*.
  3. **15-Day Rolling Cookie & Data Session**: Checkbox (pre-selected): *"Remember my login on this device for 15 days of active use."*

- **Section 2: Device Hardware Permissions (With One-Tap System Permission Prompts)**:
  1. **📍 Location Access**:
     - *Why we need it*: "To detect your nearest APMC Mandi, calculate mandi distance, and coordinate transport pickups."
     - Action: Triggers `Location.requestForegroundPermissionsAsync()`.
  2. **📷 Camera & Photos**:
     - *Why we need it*: "To photograph your harvest for AI quality grading and upload weighbridge slips."
     - Action: Triggers `Camera.requestCameraPermissionsAsync()`.
  3. **🔔 Push & Pop Notifications**:
     - *Why we need it*: "To send real-time popup notifications when buyers place orders, accept lots, or counter offer."
     - Action: Triggers `Notifications.requestPermissionsAsync()` and registers push token via `POST /api/v1/notifications/device-token`.

- **Footer CTA**:
  - Big Primary Button: **`Agree & Continue`** (Disabled until mandatory checkboxes are checked).

---

## 4. Frontend Code Implementation Guide for Teammate

Copy and paste this drop-in component into `components/ConsentModal.tsx` or `app/(auth)/consent.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConsentModalProps {
  visible: boolean;
  onConsentAccepted: () => void;
  apiBaseUrl: string; // e.g. 'http://<YOUR_IP>:4000/api/v1'
}

export const ConsentPermissionsModal: React.FC<ConsentModalProps> = ({
  visible,
  onConsentAccepted,
  apiBaseUrl,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);
  const [cookieAccepted, setCookieAccepted] = useState(true);

  // Hardware permissions toggles
  const [locationPerm, setLocationPerm] = useState(true);
  const [cameraPerm, setCameraPerm] = useState(true);
  const [notifPerm, setNotifPerm] = useState(true);

  const [loading, setLoading] = useState(false);

  const handleAgreeAndContinue = async () => {
    if (!termsAccepted || !privacyAccepted) {
      Alert.alert('Required', 'Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setLoading(true);
    try {
      // 1. Request OS Device Permissions
      if (locationPerm) {
        await Location.requestForegroundPermissionsAsync();
      }
      if (cameraPerm) {
        await Camera.requestCameraPermissionsAsync();
      }
      if (notifPerm) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
          const pushTokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
          if (pushTokenData?.data) {
            // Register device push token with backend
            const token = await AsyncStorage.getItem('user_token');
            await fetch(`${apiBaseUrl}/notifications/device-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                token: pushTokenData.data,
                deviceType: 'android',
              }),
            });
          }
        }
      }

      // 2. Submit Consent to Backend
      const token = await AsyncStorage.getItem('user_token');
      const response = await fetch(`${apiBaseUrl}/consent/agree`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          termsAndConditions: termsAccepted,
          privacyPolicy: privacyAccepted,
          cookiesConsent: cookieAccepted,
          permissions: {
            location: locationPerm,
            camera: cameraPerm,
            notifications: notifPerm,
            storage: true,
          },
          version: '1.0',
        }),
      });

      if (response.ok) {
        await AsyncStorage.setItem('has_accepted_consent', 'true');
        onConsentAccepted();
      } else {
        Alert.alert('Error', 'Failed to record permissions. Please try again.');
      }
    } catch (err) {
      console.error('Consent error:', err);
      Alert.alert('Network Error', 'Could not reach backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.badge}>🛡️ MANDIKART PRIVACY & ACCESS</Text>
          <Text style={styles.title}>Permissions & Agreement</Text>
          <Text style={styles.subtitle}>
            Please review the permissions and terms required to provide you daily APMC rates, AI crop grading, and fast buyer dispatches.
          </Text>
        </View>

        {/* Legal Agreements */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Mandatory Policies</Text>

          <View style={styles.row}>
            <Switch value={termsAccepted} onValueChange={setTermsAccepted} thumbColor="#16a34a" />
            <Text style={styles.rowLabel}>
              I agree to the <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </View>

          <View style={styles.row}>
            <Switch value={privacyAccepted} onValueChange={setPrivacyAccepted} thumbColor="#16a34a" />
            <Text style={styles.rowLabel}>
              I agree to the <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          <View style={styles.row}>
            <Switch value={cookieAccepted} onValueChange={setCookieAccepted} thumbColor="#16a34a" />
            <Text style={styles.rowLabel}>
              Keep my session active for 15 days on this device (Cookie & Session Data)
            </Text>
          </View>
        </View>

        {/* Hardware Permissions */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Device Hardware Permissions</Text>

          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>📍 Location Access</Text>
              <Text style={styles.permDesc}>Find nearest APMC mandis & calculate transport logistics.</Text>
            </View>
            <Switch value={locationPerm} onValueChange={setLocationPerm} thumbColor="#16a34a" />
          </View>

          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>📷 Camera & Photos</Text>
              <Text style={styles.permDesc}>Take harvest pictures for AI crop grading & weighbridge slips.</Text>
            </View>
            <Switch value={cameraPerm} onValueChange={setCameraPerm} thumbColor="#16a34a" />
          </View>

          <View style={styles.permRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.permTitle}>🔔 Push & Pop Notifications</Text>
              <Text style={styles.permDesc}>Instant phone popup alerts when buyers place orders or negotiate.</Text>
            </View>
            <Switch value={notifPerm} onValueChange={setNotifPerm} thumbColor="#16a34a" />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, (!termsAccepted || !privacyAccepted || loading) && styles.buttonDisabled]}
          onPress={handleAgreeAndContinue}
          disabled={!termsAccepted || !privacyAccepted || loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Agree & Continue 🌾'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#f8fafc', flexGrow: 1, justifyContent: 'center' },
  header: { marginBottom: 20 },
  badge: { fontSize: 12, fontWeight: '700', color: '#16a34a', letterSpacing: 1, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, gap: 12 },
  rowLabel: { fontSize: 13, color: '#334155', flex: 1 },
  link: { color: '#16a34a', fontWeight: '600' },
  permRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, justifyContent: 'space-between' },
  permTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  permDesc: { fontSize: 12, color: '#64748b', marginTop: 2, paddingRight: 10 },
  button: { backgroundColor: '#16a34a', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonDisabled: { backgroundColor: '#94a3b8' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
```

---

## 5. How to Wire it into the App's Root Layout

In the root layout (`app/_layout.tsx` or `app/(tabs)/_layout.tsx`), simply check:
```tsx
const [showConsent, setShowConsent] = useState(false);

useEffect(() => {
  async function checkConsent() {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) return;

    // Check backend status
    const res = await fetch('http://<YOUR_IP>:4000/api/v1/consent/status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (json.data?.requiresConsent || !json.data?.hasAcceptedConsent) {
      setShowConsent(true);
    }
  }
  checkConsent();
}, []);

return (
  <>
    <Stack ... />
    <ConsentPermissionsModal
      visible={showConsent}
      onConsentAccepted={() => setShowConsent(false)}
      apiBaseUrl="http://<YOUR_IP>:4000/api/v1"
    />
  </>
);
```
