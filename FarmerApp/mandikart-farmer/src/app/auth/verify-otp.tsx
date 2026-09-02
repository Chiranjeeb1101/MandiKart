/**
 * MandiKart Farmer App — Screen 5: Verify Your Account (Soft Glass Slider / OTP)
 * 
 * Implements the approved Stitch visual design:
 * Header with basket brand icon, 6-digit OTP boxes with auto-shift, phone number
 * summary with EDIT action, countdown timer, security guarantee, and 3D CONTINUE CTA.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, ArrowRight, ShieldCheck, ShoppingBasket } from 'lucide-react-native';
import { MKBackground, MKButton, MKHeader } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string; name?: string }>();
  const { setPhoneNumber, setIsAuthenticated, user, setUser } = useAuthStore();

  const displayPhone = params.phone || '+91 98765 43210';
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(45);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    // Success -> authenticate and navigate to profile onboarding
    setIsAuthenticated(true);
    setPhoneNumber(displayPhone);
    if (!user) {
      setUser({
        id: `farmer_${Date.now()}`,
        name: params.name || 'Ramesh Patil',
        phone: displayPhone,
        language: 'en',
        state: 'Maharashtra',
        district: 'Nashik',
        village: 'Dindori',
        farmSizeAcres: 5,
        isVerified: true,
        role: 'FARMER',
      });
    }

    router.push('/onboarding/farmer-profile');
  };

  return (
    <MKBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <MKHeader
          showBack={true}
          rightAction={
            <View style={styles.headerBasketBadge}>
              <ShoppingBasket size={22} color="#8A4A1C" strokeWidth={2.2} />
            </View>
          }
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Title */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>
              Verify Your <Text style={styles.titleGreen}>Account</Text>
            </Text>
            <Text style={styles.subtitle}>
              Secure your MandiKart profile to continue.
            </Text>
          </View>

          {/* Verification Card */}
          <View style={styles.card}>
            <View style={styles.stepTitleRow}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepTitle}>Verify Mobile Number</Text>
            </View>

            {/* Phone Number Display Box */}
            <View style={styles.phoneBox}>
              <View>
                <Text style={styles.phoneLabel}>Phone Number</Text>
                <Text style={styles.phoneValue}>{displayPhone}</Text>
              </View>
              <Pressable
                onPress={() => router.back()}
                style={styles.editButton}
                accessibilityRole="button"
              >
                <Text style={styles.editText}>EDIT</Text>
              </Pressable>
            </View>

            {/* OTP Section */}
            <View style={styles.otpSection}>
              <Text style={styles.otpLabel}>Enter 6-digit OTP</Text>
              <View style={styles.otpBoxesRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    style={[
                      styles.otpBox,
                      Boolean(digit) && styles.otpBoxFilled,
                      Boolean(error) && styles.otpBoxError,
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Timer & Resend */}
              <View style={styles.resendRow}>
                <Text style={styles.timerText}>
                  {timer > 0
                    ? `Resend OTP in 00:${timer < 10 ? `0${timer}` : timer}`
                    : 'Did not receive code?'}
                </Text>
                <Pressable
                  onPress={handleResend}
                  disabled={!canResend}
                  style={[styles.resendBtn, !canResend && styles.resendBtnDisabled]}
                >
                  <Text
                    style={[
                      styles.resendBtnText,
                      canResend ? styles.resendBtnTextActive : styles.resendBtnTextDisabled,
                    ]}
                  >
                    RESEND OTP
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Security Note & Primary Continue CTA */}
          <View style={styles.footerArea}>
            <View style={styles.securityRow}>
              <ShieldCheck size={16} color="#1E5A2A" strokeWidth={2} />
              <Text style={styles.securityText}>Your information is safe and secure</Text>
            </View>

            <MKButton
              title="CONTINUE"
              onPress={handleVerify}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MKBackground>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  headerBasketBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEBE2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerBlock: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1C1E',
    marginBottom: 6,
    textAlign: 'center',
  },
  titleGreen: {
    color: '#1E5A2A',
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0ECE4',
    marginBottom: 20,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFEADE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#964900',
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  phoneBox: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginBottom: 2,
  },
  phoneValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1E',
    letterSpacing: 0.5,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E5A2A',
    letterSpacing: 0.5,
  },
  otpSection: {
    width: '100%',
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 12,
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  otpBox: {
    width: 46,
    height: 54,
    backgroundColor: '#FAF9F6',
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    borderRadius: 14,
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C1E',
    textAlign: 'center',
  },
  otpBoxFilled: {
    borderColor: '#1E5A2A',
    backgroundColor: '#FFFFFF',
  },
  otpBoxError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginBottom: 8,
    fontWeight: '500',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 13,
    color: '#5F6368',
  },
  resendBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  resendBtnDisabled: {
    opacity: 0.5,
  },
  resendBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resendBtnTextActive: {
    color: '#1E5A2A',
  },
  resendBtnTextDisabled: {
    color: '#9AA0A6',
  },
  footerArea: {
    width: '100%',
    paddingTop: 8,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '500',
  },
});
