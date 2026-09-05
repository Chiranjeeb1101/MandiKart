import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, StatusBar, Animated, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';
import AuthBackground from '../../components/AuthBackground';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

const OTP_LENGTH = 4;

export default function OTPScreen({ navigation, route }: Props) {
  const { phone = '9876543210', mode } = route.params || {};
  const { signInWithPhoneOtp } = useAuth();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [focusedIdx, setFocusedIdx] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  // Entrance & Scale animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const boxScales = useRef(Array(OTP_LENGTH).fill(0).map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const animateBoxPop = (idx: number) => {
    Animated.sequence([
      Animated.timing(boxScales[idx], {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(boxScales[idx], {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    const char = val.slice(-1);
    newOtp[idx] = char;
    setOtp(newOtp);

    if (char) {
      animateBoxPop(idx);
      if (idx < OTP_LENGTH - 1) {
        inputs.current[idx + 1]?.focus();
      }
    }

    // Auto verify when 4 digits are completed
    if (newOtp.filter(Boolean).length === OTP_LENGTH) {
      verifyOtp(newOtp);
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const verifyOtp = async (currentOtp: string[]) => {
    const code = currentOtp.join('');
    if (code.length < OTP_LENGTH) return;
    setLoading(true);
    try {
      if (mode === 'forgot') {
        setLoading(false);
        navigation.navigate('Login');
      } else {
        const res = await signInWithPhoneOtp(phone, code);
        setLoading(false);
        if (!res.success) {
          Alert.alert('Verification Failed', res.error || 'Invalid OTP code. Please check and try again.');
        }
      }
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Verification Error', e?.message || 'Failed to verify code.');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputs.current[0]?.focus();
    try {
      await apiClient.auth.sendOtp(phone);
      Alert.alert('Code Dispatched', `A new verification code was sent to +91 ${phone}`);
    } catch (e: any) {
      Alert.alert('Notice', 'Failed to resend code. Please check your connection.');
    }
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

        {/* Top Navigation */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Badge Icon */}
          <View style={styles.iconCircle}>
            <View style={styles.iconInner}>
              <Ionicons name="shield-checkmark" size={34} color={Colors.primary} />
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            We sent a 4-digit verification code to
          </Text>

          {/* Phone Badge with Edit */}
          <View style={styles.phoneBadge}>
            <Ionicons name="call-outline" size={15} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.phoneText}>+91 {phone}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="pencil" size={13} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* 4 OTP Input Boxes */}
          <View style={styles.otpRow}>
            {otp.map((val, idx) => {
              const isFocused = focusedIdx === idx;
              const isFilled = Boolean(val);

              return (
                <Animated.View
                  key={idx}
                  style={[
                    styles.boxWrapper,
                    { transform: [{ scale: boxScales[idx] }] },
                  ]}
                >
                  <TextInput
                    ref={(r) => { inputs.current[idx] = r; }}
                    style={[
                      styles.otpBox,
                      isFilled && styles.otpBoxFilled,
                      isFocused && styles.otpBoxFocused,
                    ]}
                    value={val}
                    onChangeText={(v) => handleChange(v, idx)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                    onFocus={() => setFocusedIdx(idx)}
                    onBlur={() => setFocusedIdx(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    autoFocus={idx === 0}
                    editable={!loading}
                    selectTextOnFocus
                  />
                </Animated.View>
              );
            })}
          </View>

          {/* Primary Action Button */}
          <PrimaryButton
            title="Verify & Proceed"
            onPress={() => verifyOtp(otp)}
            loading={loading}
            disabled={otp.join('').length < OTP_LENGTH}
            style={styles.btn}
          />

          {/* Resend Section */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {timer > 0 ? (
              <View style={styles.timerBadge}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.timerText}>Resend in {timer}s</Text>
              </View>
            ) : (
              <TouchableOpacity onPress={handleResend} style={styles.resendBtn}>
                <Text style={styles.resendLink}>Resend OTP</Text>
                <Ionicons name="refresh" size={14} color={Colors.primary} style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  iconInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: 6,
  },
  editBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  boxWrapper: {
    width: 58,
    height: 64,
  },
  otpBox: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    textAlign: 'center',
    ...Shadows.sm,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: '#F0FDF4',
    color: Colors.primary,
  },
  otpBoxFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  demoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  btn: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
});
