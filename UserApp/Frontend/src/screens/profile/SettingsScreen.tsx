import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import { useLanguage, SupportedLanguage } from '../../context/LanguageContext';

export default function SettingsScreen({ navigation }: any) {
  const { currentLanguageOption, setLanguage, t } = useLanguage();

  const handleLanguagePress = () => {
    Alert.alert(
      t('selectLanguage', 'Select Language 🌐'),
      t('chooseLanguage', 'Choose your preferred app language:'),
      [
        { text: 'English (IN)', onPress: () => setLanguage('en') },
        { text: 'ଓଡ଼ିଆ (Odia)', onPress: () => setLanguage('or') },
        { text: 'हिंदी (Hindi)', onPress: () => setLanguage('hi') },
        { text: 'मराठी (Marathi)', onPress: () => setLanguage('mr') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sections = [
    {
      title: 'Preferences',
      items: [
        { label: 'Push Notifications', icon: 'notifications-outline', value: 'On' },
        { label: t('appLanguage', 'Language'), icon: 'language-outline', value: currentLanguageOption.nativeName, onPress: handleLanguagePress },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Terms of Service', icon: 'document-text-outline' },
        { label: 'Privacy Policy', icon: 'shield-checkmark-outline' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={Colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {sections.map((sec) => (
          <View key={sec.title} style={styles.section}>
            <Text style={styles.secTitle}>{sec.title}</Text>
            <View style={styles.card}>
              {sec.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.itemRow, i < sec.items.length - 1 && styles.border]}
                  onPress={(item as any).onPress}
                >
                  <Ionicons name={item.icon as any} size={20} color={Colors.textSecondary} />
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {(item as any).value && <Text style={styles.itemValue}>{(item as any).value}</Text>}
                  <Ionicons name="chevron-forward" size={16} color={Colors.textDisabled} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: 'transparent', borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  title: { fontSize: 18, fontWeight: '700' },
  content: { padding: Spacing.md, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  secTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginLeft: 4 },
  card: { backgroundColor: 'transparent', borderRadius: 8, borderWidth: 1, borderColor: Colors.borderLight },
  itemRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  itemLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary, marginLeft: 12 },
  itemValue: { fontSize: 14, color: Colors.textSecondary },
});

