import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!phone) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { phone, mode: 'forgot' });
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="lock-closed-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your registered phone number and we'll send you an OTP to reset your password.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <View style={styles.cc}><Text style={styles.ccText}>🇮🇳 +91</Text></View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <PrimaryButton title="Send OTP" onPress={handleSend} loading={loading} disabled={phone.length < 10} style={styles.btn} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLogin}>
          <Ionicons name="arrow-back" size={14} color={Colors.primary} />
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: Spacing.lg, paddingTop: 56 },
  backBtn: { marginBottom: Spacing.lg },
  content: { alignItems: 'center', gap: Spacing.md },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  field: { gap: 6, width: '100%', marginTop: Spacing.sm },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: BorderRadius.md, overflow: 'hidden', height: 50,
  },
  cc: { paddingHorizontal: Spacing.sm, borderRightWidth: 1, borderRightColor: Colors.border, backgroundColor: Colors.gray50, height: '100%', justifyContent: 'center' },
  ccText: { fontSize: 13, fontWeight: '500' },
  input: { flex: 1, paddingHorizontal: Spacing.md, fontSize: 15, color: Colors.textPrimary },
  btn: { width: '100%', marginTop: Spacing.sm },
  backToLogin: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  backToLoginText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
});

