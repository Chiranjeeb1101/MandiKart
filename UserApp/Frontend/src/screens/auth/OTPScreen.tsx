import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import AuthBackground from '../../components/AuthBackground';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const OTP_LENGTH = 6;

export default function OTPScreen({ navigation, route }: Props) {
  const { phone, mode } = route.params;
  const { signIn } = useAuth();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    if (val && idx < OTP_LENGTH - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.join('').length < OTP_LENGTH) return;
    setLoading(true);
    // TODO: Verify OTP with real API
    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        navigation.navigate('Login');
      } else {
        // Sign in — RootNavigator will switch to Main automatically
        signIn();
      }
    }, 1500);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="phone-portrait-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>+91 {phone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {otp.map((val, idx) => (
            <TextInput
              key={idx}
              ref={(r) => { inputs.current[idx] = r; }}
              style={[styles.otpBox, val ? styles.otpBoxFilled : null]}
              value={val}
              onChangeText={(v) => handleChange(v, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={idx === 0}
            />
          ))}
        </View>

        <PrimaryButton
          title="Verify OTP"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.join('').length < OTP_LENGTH}
          style={styles.btn}
        />

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>Didn't receive code? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(30)}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', paddingHorizontal: Spacing.lg, paddingTop: 56 },
  backBtn: { marginBottom: Spacing.xl },
  content: { alignItems: 'center', gap: Spacing.md },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  phone: { fontWeight: '600', color: Colors.textPrimary },
  otpRow: { flexDirection: 'row', gap: 10, marginVertical: Spacing.lg },
  otpBox: {
    width: 48, height: 56, borderWidth: 2, borderColor: Colors.border,
    borderRadius: BorderRadius.md, fontSize: 22, fontWeight: '700', color: Colors.textPrimary,
    backgroundColor: Colors.gray50,
  },
  otpBoxFilled: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  btn: { width: '100%' },
  resendRow: { flexDirection: 'row' },
  resendText: { fontSize: 14, color: Colors.textSecondary },
  timerText: { fontSize: 14, color: Colors.textDisabled },
  resendLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});

