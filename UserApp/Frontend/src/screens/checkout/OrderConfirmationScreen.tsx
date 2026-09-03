import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

export default function OrderConfirmationScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.success} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.white} />
        </View>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your order #MK-123456 has been successfully placed and is awaiting confirmation.</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton title="View Order" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Orders' } }] })} style={styles.btn} variant="outline" />
        <PrimaryButton title="Back to Home" onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Home' } }] })} style={styles.btn} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.success },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing['2xl'] },
  iconWrap: { marginBottom: Spacing.lg },
  title: { fontSize: 28, fontWeight: '800', color: Colors.white, marginBottom: Spacing.sm },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 24 },
  footer: { padding: Spacing.xl, backgroundColor: 'transparent', borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: Spacing.md },
  btn: { width: '100%' },
});

