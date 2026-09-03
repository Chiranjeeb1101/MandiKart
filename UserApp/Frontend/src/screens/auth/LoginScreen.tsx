import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import PrimaryButton from '../../components/PrimaryButton';
import AuthBackground from '../../components/AuthBackground';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type LoginMode = 'password' | 'otp';

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const [mode, setMode] = useState<LoginMode>('password');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (mode === 'password' && !password) {
      Alert.alert('Required Field', 'Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn(); // Triggers global auth state to navigate to Main app
    }, 1000);
  };

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP Sent! 📱', `A 4-digit verification code has been sent to +91 ${phone}. (Demo OTP: 1234)`);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn();
    }, 600);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <Text style={styles.logoText}>M</Text>
              </View>
              <Text style={styles.brandName}>MandiKart</Text>
            </View>

            <View style={styles.taglineBadge}>
              <Ionicons name="leaf-outline" size={14} color={Colors.primary} />
              <Text style={styles.taglineText}>Direct From Indian Farmers To Your Doorstep</Text>
            </View>

            <Text style={styles.title}>Welcome back! 👋</Text>
            <Text style={styles.subtitle}>Sign in to access fresh produce & daily mandi prices</Text>
          </View>

          {/* Quick Demo Login Pill */}
          {/* <TouchableOpacity style={styles.demoBanner} onPress={handleDemoLogin} activeOpacity={0.85}>
            <Ionicons name="flash" size={16} color={Colors.primary} />
            <Text style={styles.demoText}>Quick Demo Login as <Text style={styles.demoBold}>Ramesh Sharma</Text></Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity> */}

          {/* Login Method Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, mode === 'password' && styles.tabBtnActive]}
              onPress={() => setMode('password')}
            >
              <Ionicons name="key-outline" size={16} color={mode === 'password' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, mode === 'password' && styles.tabTextActive]}>Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, mode === 'otp' && styles.tabBtnActive]}
              onPress={() => setMode('otp')}
            >
              <Ionicons name="phone-portrait-outline" size={16} color={mode === 'otp' ? Colors.white : Colors.textSecondary} />
              <Text style={[styles.tabText, mode === 'otp' && styles.tabTextActive]}>Mobile OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Phone Input */}
            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number *</Text>
              <View style={styles.inputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter 10-digit number"
                  placeholderTextColor={Colors.textDisabled}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>

            {mode === 'password' ? (
              <>
                {/* Password Input */}
                <View style={styles.field}>
                  <Text style={styles.label}>Password *</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor={Colors.textDisabled}
                      secureTextEntry={!showPass}
                    />
                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                      <Ionicons
                        name={showPass ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remember & Forgot Row */}
                <View style={styles.rememberRow}>
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <Ionicons
                      name={rememberMe ? 'checkbox' : 'square-outline'}
                      size={18}
                      color={rememberMe ? Colors.primary : Colors.textSecondary}
                    />
                    <Text style={styles.rememberText}>Remember me</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <PrimaryButton
                  title="Sign In to MandiKart"
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.submitBtn}
                />
              </>
            ) : (
              <>
                {/* OTP Mode */}
                {otpSent ? (
                  <View style={styles.field}>
                    <Text style={styles.label}>Enter 4-Digit OTP *</Text>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      value={otpCode}
                      onChangeText={setOtpCode}
                      placeholder="e.g. 1234"
                      placeholderTextColor={Colors.textDisabled}
                      keyboardType="number-pad"
                      maxLength={4}
                    />
                  </View>
                ) : null}

                {otpSent ? (
                  <PrimaryButton
                    title="Verify OTP & Sign In"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={!otpCode}
                    style={styles.submitBtn}
                  />
                ) : (
                  <PrimaryButton
                    title="Get OTP on SMS / WhatsApp"
                    onPress={handleSendOTP}
                    style={styles.submitBtn}
                  />
                )}
              </>
            )}

            {/* Social Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR LOGIN WITH</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn} onPress={handleDemoLogin}>
                <Ionicons name="logo-google" size={18} color="#EA4335" />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.socialBtn} onPress={handleDemoLogin}>
                <Ionicons name="logo-apple" size={18} color="#000000" />
                <Text style={styles.socialText}>Apple</Text>
              </TouchableOpacity> */}
            </View>
          </View>

          {/* Footer Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don't have a MandiKart account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingTop: 48, paddingBottom: Spacing.xl, gap: Spacing.md },
  // Header
  header: { alignItems: 'center', gap: 6 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  logoMark: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    ...Shadows.sm,
  },
  logoText: { fontSize: 20, fontWeight: '800', color: Colors.white },
  brandName: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  taglineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: 4,
  },
  taglineText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, textAlign: 'center' },
  // Demo Banner
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    ...Shadows.sm,
  },
  demoText: { fontSize: 12, color: Colors.textPrimary },
  demoBold: { fontWeight: '800', color: Colors.primary },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
  },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  // Form Card
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    height: 48,
  },
  countryCode: {
    paddingHorizontal: Spacing.sm + 2,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
    justifyContent: 'center',
  },
  countryCodeText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  input: { flex: 1, paddingHorizontal: Spacing.md, fontSize: 14, color: Colors.textPrimary },
  otpInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.md,
    height: 48,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 8,
  },
  eyeBtn: { padding: Spacing.sm },
  rememberRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rememberText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  forgotText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  submitBtn: { width: '100%', marginTop: 4 },
  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginVertical: 4 },
  divider: { flex: 1, height: 1, backgroundColor: Colors.borderLight },
  dividerText: { fontSize: 10, fontWeight: '700', color: Colors.textDisabled },
  // Social
  socialRow: { flexDirection: 'row', gap: Spacing.md },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  socialText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  // Register
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerText: { fontSize: 13, color: Colors.textSecondary },
  registerLink: { fontSize: 13, color: Colors.primary, fontWeight: '800' },
});
