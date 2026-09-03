/**
 * MandiKart Farmer App — Settings & Preferences
 *
 * Unique Design:
 * - Language shortcut tile with regional indicator
 * - Offline mode simulation for low-connectivity Mandi yards
 * - Data Saver mode for 2G/3G networks
 * - Local storage cache management with memory breakdown
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import {
  Settings,
  Globe,
  WifiOff,
  HardDrive,
  Trash2,
  ChevronRight,
  Database,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MKBackground, MKHeader } from '@/components/ui';
import { useAppStore } from '@/store/appStore';

export default function SettingsScreen() {
  const router = useRouter();
  const { isOffline, setOffline, language } = useAppStore();

  const [dataSaver, setDataSaver] = useState(false);
  const [cacheSize, setCacheSize] = useState('14.2 MB');

  const languageLabels: Record<string, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    or: 'ଓଡ଼ିଆ (Odia)',
    mr: 'मराठी (Marathi)',
    pa: 'ਪੰਜਾਬੀ (Punjabi)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    bn: 'বাংলা (Bengali)',
    gu: 'ગુજરાતી (Gujarati)',
    kn: 'ಕನ್ನಡ (Kannada)',
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Offline Cache',
      'This will free up local storage by removing cached mandi price histories and thumbnail images. Your account data remains safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0.0 MB');
            Alert.alert('Success', 'Local storage cache cleared successfully!');
          },
        },
      ]
    );
  };

  return (
    <MKBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MKHeader showBack title="System & App Settings" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Banner */}
          <Animated.View entering={FadeInDown.duration(450)} style={styles.headerBox}>
            <View style={styles.gearCircle}>
              <Settings size={24} color="#1E5A2A" />
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.headerTitle}>Device & Data Preferences</Text>
              <Text style={styles.headerSub}>
                Optimize network usage, offline syncing, and regional language preferences.
              </Text>
            </View>
          </Animated.View>

          {/* Section 1: Regional & Language */}
          <Text style={styles.sectionTitle}>REGIONAL PREFERENCES</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(100)} style={styles.card}>
            <Pressable
              onPress={() => router.push('/language-select')}
              style={({ pressed }) => [styles.menuRow, styles.noBorder, pressed && styles.rowPressed]}
            >
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Globe size={20} color="#1565C0" />
              </View>
              <View style={styles.menuMeta}>
                <Text style={styles.menuTitle}>App Language / ଭାଷା</Text>
                <Text style={styles.menuSub}>Current: {languageLabels[language] || 'English'}</Text>
              </View>
              <View style={styles.changeBadge}><Text style={styles.changeBadgeText}>Change</Text></View>
              <ChevronRight size={18} color="#9AA0A6" />
            </Pressable>
          </Animated.View>

          {/* Section 2: Network & Offline */}
          <Text style={styles.sectionTitle}>NETWORK & SYNC</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(150)} style={styles.card}>
            {/* Offline Toggle */}
            <View style={styles.menuRow}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <WifiOff size={20} color="#1E5A2A" />
              </View>
              <View style={styles.menuMeta}>
                <Text style={styles.menuTitle}>Offline Mode</Text>
                <Text style={styles.menuSub}>Enable listing crops even in low-signal Mandi yards</Text>
              </View>
              <Switch
                value={isOffline}
                onValueChange={setOffline}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={isOffline ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>

            {/* Low Data Mode */}
            <View style={[styles.menuRow, styles.noBorder]}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <HardDrive size={20} color="#E65100" />
              </View>
              <View style={styles.menuMeta}>
                <Text style={styles.menuTitle}>Low Data Mode (2G/3G)</Text>
                <Text style={styles.menuSub}>Compresses crop images to save cellular data</Text>
              </View>
              <Switch
                value={dataSaver}
                onValueChange={setDataSaver}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={dataSaver ? '#1E5A2A' : '#9E9E9E'}
              />
            </View>
          </Animated.View>

          {/* Section 3: Storage & Cache */}
          <Text style={styles.sectionTitle}>STORAGE & CACHE</Text>
          <Animated.View entering={FadeInUp.duration(550).delay(200)} style={styles.card}>
            <View style={styles.storageInfoRow}>
              <View style={styles.storageLeft}>
                <Database size={18} color="#555" />
                <Text style={styles.storageLabel}>Local Cached Storage</Text>
              </View>
              <Text style={styles.storageVal}>{cacheSize}</Text>
            </View>

            <Pressable
              onPress={handleClearCache}
              style={({ pressed }) => [styles.clearCacheBtn, pressed && styles.clearCachePressed]}
            >
              <Trash2 size={16} color="#D32F2F" />
              <Text style={styles.clearCacheText}>Clear Storage Cache</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 14,
  },
  gearCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  headerMeta: { flex: 1, gap: 2 },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#1E5A2A' },
  headerSub: { fontSize: 12, color: '#5F6368', lineHeight: 16 },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7A7A7A',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0ECE4',
    gap: 12,
  },
  noBorder: { borderBottomWidth: 0 },
  rowPressed: { backgroundColor: '#FAF9F6' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuMeta: { flex: 1, gap: 2 },
  menuTitle: { fontSize: 14, fontWeight: '700', color: '#1A1C1E' },
  menuSub: { fontSize: 11, color: '#5F6368', lineHeight: 15 },
  changeBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  changeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1565C0',
  },

  storageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F2EC',
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storageLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1C1E',
  },
  storageVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E5A2A',
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    marginVertical: 10,
  },
  clearCachePressed: { backgroundColor: '#FFEBEE' },
  clearCacheText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D32F2F',
  },
});
