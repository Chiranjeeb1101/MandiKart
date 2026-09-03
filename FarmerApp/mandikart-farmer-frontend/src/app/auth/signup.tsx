/**
 * MandiKart Farmer App - Create Account
 *
 * Premium farmer-first registration screen with the existing signup flow.
 */

import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe2,
  Headphones,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Sprout,
  Tractor,
  User,
} from 'lucide-react-native';
import { MKBackground } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKShadows } from '@/constants/shadows';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

type OtpMethod = 'sms' | 'whatsapp';
type FieldTone = 'green' | 'orange' | 'neutral';
type IconComponent = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

const FARMER_HERO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDinV_e5owfh89gPtLCA76lilmicdcRz2kVnA2Yc9o1WkX48o_T_n3jQJM14Pd5TzCDO4wlsbaGX0MQobV3MiwbDMh_K5EKRmgf0eI8pRMYw_B6wqagFKWaxqrUJIgxjDZUOYpKdhuUafcuBaY-IYqkRsWsqFJBVqY9DNpM28aWfm0Bx3cC4BIZ7XuRvUVz2QESdXpE_HWcoRfFdn7bX6n8eMifz13XnCsxdFX-ybqll4FE_idueiq4kQ';

const languageLabels: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  mr: 'Marathi',
};

export default function SignUpScreen() {
  const router = useRouter();
  const { language } = useAppStore();
  const { setPhoneNumber, setUser } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpMethod, setOtpMethod] = useState<OtpMethod>('whatsapp');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLanguage = languageLabels[language] ?? 'English';
  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const trimmedMobile = mobile.trim();

    if (!fullName.trim()) nextErrors.fullName = 'Please enter your full name';
    if (!/^[6-9]\d{9}$/.test(trimmedMobile)) nextErrors.mobile = 'Enter a valid 10 digit Indian mobile number';
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) nextErrors.email = 'Enter a valid email address';
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match';
    if (!agreedToTerms) nextErrors.terms = 'Please accept Terms & Privacy Policy';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) return;

    const normalizedPhone = `+91${mobile.trim()}`;
    setPhoneNumber(normalizedPhone);
    setUser({
      id: `farmer_${Date.now()}`,
      name: fullName.trim(),
      fullName: fullName.trim(),
      phone: normalizedPhone,
      email: email.trim() || undefined,
      language,
      isVerified: false,
      role: 'FARMER',
    });

    router.push({
      pathname: '/auth/verify-otp',
      params: { phone: `+91 ${mobile.trim()}`, name: fullName.trim(), method: otpMethod },
    });
  };

  return (
    <MKBackground>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.duration(420)} style={styles.topBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={() => router.back()}
              style={styles.roundButton}
            >
              <ArrowLeft size={23} color={MKColors.primaryGreenDark} strokeWidth={2.4} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change language"
              onPress={() => router.push('/language-select')}
              style={styles.languagePill}
            >
              <Globe2 size={18} color={MKColors.primaryGreenDark} strokeWidth={2.3} />
              <Text numberOfLines={1} style={styles.languageText}>{selectedLanguage}</Text>
              <ChevronDown size={16} color={MKColors.primaryGreenDark} strokeWidth={2.3} />
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(520).delay(70)} style={styles.hero}>
            <View style={styles.heroCopy}>
              <View style={styles.kickerRow}>
                <View style={styles.kickerIcon}>
                  <ShieldCheck size={15} color={MKColors.primaryGreenDark} strokeWidth={2.6} />
                </View>
                <Text style={styles.kickerText}>Verified farmer commerce</Text>
              </View>
              <Text style={styles.heroTitle}>
                Create Your{'\n'}
                <Text style={styles.heroTitleGreen}>MandiKart</Text> Account
              </Text>
              <Text style={styles.heroSubtitle}>
                Join trusted farmers selling produce with secure payments and better market access.
              </Text>
            </View>

            <View style={styles.heroVisual}>
              <FieldLines />
              <Image source={{ uri: FARMER_HERO_URI }} style={styles.farmerImage} />
              <View style={styles.farmBadge}>
                <Tractor size={16} color={MKColors.accentOrangeDark} strokeWidth={2.4} />
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(520).delay(140)} style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Let's get started</Text>
              <Text style={styles.cardSubtitle}>Enter your details to create a secure farmer account.</Text>
            </View>

            <AuthField
              icon={User}
              placeholder="Full Name"
              helper="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              autoCapitalize="words"
            />
            <AuthField
              icon={Phone}
              placeholder="Mobile Number"
              helper="10 digit mobile number"
              value={mobile}
              onChangeText={setMobile}
              error={errors.mobile}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <View style={styles.otpPanel}>
              <Text style={styles.otpTitle}>Verification OTP</Text>
              <View style={styles.otpRow}>
                <OtpChoice
                  active={otpMethod === 'whatsapp'}
                  icon={MessageCircle}
                  label="WhatsApp"
                  onPress={() => setOtpMethod('whatsapp')}
                />
                <OtpChoice
                  active={otpMethod === 'sms'}
                  icon={Smartphone}
                  label="SMS"
                  onPress={() => setOtpMethod('sms')}
                />
              </View>
            </View>

            <AuthField
              icon={Mail}
              placeholder="Email Address (Optional)"
              helper="Enter your email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              tone="orange"
            />
            <AuthField
              icon={Lock}
              placeholder="Create Password"
              helper="Minimum 6 characters"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              secureTextEntry={!showPassword}
              rightIcon={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={8}
                  onPress={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={19} color={MKColors.textPrimary} /> : <Eye size={19} color={MKColors.textPrimary} />}
                </Pressable>
              }
            />
            {password.length > 0 && (
              <View style={styles.strengthWrap}>
                <View style={styles.strengthTrack}>
                  <View
                    style={[
                      styles.strengthFill,
                      { width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}
            <AuthField
              icon={Lock}
              placeholder="Confirm Password"
              helper="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              rightIcon={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  hitSlop={8}
                  onPress={() => setShowConfirmPassword((value) => !value)}
                >
                  {showConfirmPassword ? <EyeOff size={19} color={MKColors.textPrimary} /> : <Eye size={19} color={MKColors.textPrimary} />}
                </Pressable>
              }
            />

            <LinearGradient
              colors={['#F8FFF5', '#FFFFFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.securityCard}
            >
              <View style={styles.securityShield}>
                <ShieldCheck size={31} color={MKColors.primaryGreenDark} strokeWidth={2.3} />
              </View>
              <View style={styles.securityTextBlock}>
                <Text style={styles.securityTitle}>Your data is safe with us</Text>
                <Text style={styles.securityText}>We protect account details with secure verification and privacy controls.</Text>
              </View>
              <Sprout size={42} color="#BBDDBE" strokeWidth={1.8} />
            </LinearGradient>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: agreedToTerms }}
              onPress={() => setAgreedToTerms((value) => !value)}
              style={styles.termsRow}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
                {agreedToTerms && <Check size={15} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </Pressable>
            {errors.terms ? <Text style={styles.termsError}>{errors.terms}</Text> : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Create account"
              onPress={handleSignUp}
              style={styles.createButton}
            >
              <LinearGradient
                colors={['#FFB13B', '#F57C00', '#E65100']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createButtonGradient}
              >
                <Text style={styles.createButtonText}>Create Account</Text>
                <View style={styles.createButtonIcon}>
                  <ArrowRight size={21} color={MKColors.accentOrangeDark} strokeWidth={2.6} />
                </View>
              </LinearGradient>
            </Pressable>

            <View style={styles.signInRow}>
              <View style={styles.signInLine} />
              <Text style={styles.signInText}>Already have an account?</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Sign in" onPress={() => router.push('/auth/login')}>
                <Text style={styles.signInLink}> Sign In</Text>
              </Pressable>
              <View style={styles.signInLine} />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(520).delay(210)} style={styles.trustGrid}>
            <TrustMetric icon={ShieldCheck} title="100% Secure" subtitle="Protected account data" />
            <TrustMetric icon={Check} title="Verified Farmers" subtitle="Built for real sellers" tone="orange" />
            <TrustMetric icon={Headphones} title="24/7 Support" subtitle="Help when you need it" />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MKBackground>
  );
}

function getPasswordStrength(password: string) {
  if (password.length === 0) return { score: 0, label: '', color: MKColors.textMuted };
  if (password.length < 6) return { score: 34, label: 'Weak password', color: MKColors.error };
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return { score: 68, label: 'Good password', color: MKColors.accentOrangeDark };
  }
  return { score: 100, label: 'Strong password', color: MKColors.primaryGreenDark };
}

function AuthField({
  icon: Icon,
  helper,
  error,
  rightIcon,
  tone = 'green',
  ...inputProps
}: TextInputProps & {
  icon: IconComponent;
  helper: string;
  error?: string;
  rightIcon?: React.ReactNode;
  tone?: FieldTone;
}) {
  const iconColor = tone === 'orange' ? MKColors.accentOrangeDark : tone === 'neutral' ? MKColors.textSecondary : MKColors.primaryGreenDark;
  const iconBg = tone === 'orange' ? styles.fieldIconOrange : tone === 'neutral' ? styles.fieldIconNeutral : styles.fieldIconGreen;

  return (
    <View style={styles.fieldWrap}>
      <View style={[styles.field, Boolean(error) && styles.fieldError]}>
        <View style={[styles.fieldIcon, iconBg]}>
          <Icon size={20} color={iconColor} strokeWidth={2.25} />
        </View>
        <View style={styles.fieldBody}>
          <TextInput
            {...inputProps}
            placeholderTextColor={MKColors.textSecondary}
            underlineColorAndroid="transparent"
            multiline={false}
            style={styles.input}
          />
          <Text numberOfLines={1} style={styles.fieldHelper}>{helper}</Text>
        </View>
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.fieldErrorText}>{error}</Text> : null}
    </View>
  );
}

function OtpChoice({
  active,
  icon: Icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: IconComponent;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.otpChoice, active && styles.otpChoiceActive]}
    >
      <Icon size={17} color={active ? MKColors.primaryGreenDark : MKColors.textSecondary} strokeWidth={2.4} />
      <Text style={[styles.otpChoiceText, active && styles.otpChoiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function TrustMetric({
  icon: Icon,
  title,
  subtitle,
  tone = 'green',
}: {
  icon: IconComponent;
  title: string;
  subtitle: string;
  tone?: FieldTone;
}) {
  const iconStyle = tone === 'orange' ? styles.metricIconOrange : styles.metricIconGreen;
  const iconColor = tone === 'orange' ? MKColors.accentOrangeDark : MKColors.primaryGreenDark;

  return (
    <View style={styles.metric}>
      <View style={[styles.metricIcon, iconStyle]}>
        <Icon size={22} color={iconColor} strokeWidth={2.4} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricSubtitle}>{subtitle}</Text>
    </View>
  );
}

function FieldLines() {
  return (
    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 152 132" pointerEvents="none">
      <Path d="M5 108 C42 82 85 82 147 105" stroke="#B6DDB4" strokeWidth="1.4" fill="none" opacity="0.58" />
      <Path d="M4 120 C47 92 94 93 151 118" stroke="#F4C27B" strokeWidth="1.2" fill="none" opacity="0.42" />
      <Path d="M18 96 C55 70 92 72 133 91" stroke="#D9EBCF" strokeWidth="1.1" fill="none" opacity="0.7" />
      <Circle cx="118" cy="28" r="18" fill="#FFF3E0" opacity="0.85" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roundButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    ...MKShadows.sm,
  },
  languagePill: {
    minWidth: 132,
    maxWidth: 170,
    height: 50,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E4DA',
    ...MKShadows.sm,
  },
  languageText: {
    flexShrink: 1,
    color: MKColors.primaryGreenDark,
    fontSize: 14,
    fontWeight: '800',
  },
  hero: {
    minHeight: 252,
    marginBottom: 18,
  },
  heroCopy: {
    maxWidth: '74%',
    zIndex: 2,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 18,
  },
  kickerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MKColors.primaryGreenSurface,
  },
  kickerText: {
    flexShrink: 1,
    color: MKColors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  heroTitle: {
    color: MKColors.textPrimary,
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '800',
    letterSpacing: 0,
  },
  heroTitleGreen: {
    color: MKColors.primaryGreen,
  },
  heroSubtitle: {
    marginTop: 14,
    color: MKColors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
  },
  heroVisual: {
    position: 'absolute',
    right: -30,
    bottom: 6,
    width: 156,
    height: 150,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  farmerImage: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 5,
    borderColor: '#FFFFFF',
    backgroundColor: '#F2F4ED',
  },
  farmBadge: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    width: 35,
    height: 35,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  formCard: {
    borderRadius: 28,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    ...MKShadows.lg,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    color: MKColors.primaryGreen,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
  },
  cardSubtitle: {
    marginTop: 6,
    color: MKColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  fieldWrap: {
    marginBottom: 12,
  },
  field: {
    minHeight: 68,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E7E4DC',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
  },
  fieldError: {
    borderColor: MKColors.error,
    backgroundColor: '#FFFCFC',
  },
  fieldIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldIconGreen: {
    backgroundColor: '#EAF5E7',
  },
  fieldIconOrange: {
    backgroundColor: '#FFF1E0',
  },
  fieldIconNeutral: {
    backgroundColor: '#F1F3F1',
  },
  input: {
    flex: 0,
    width: '100%',
    height: 29,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    includeFontPadding: true,
    textAlignVertical: 'center',
    color: MKColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  fieldBody: {
    flex: 1,
    minWidth: 0,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fieldHelper: {
    color: MKColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginTop: 2,
  },
  rightIcon: {
    width: 34,
    minHeight: 44,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldErrorText: {
    marginTop: 5,
    marginLeft: 8,
    color: MKColors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  otpPanel: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#FAFBF7',
    borderWidth: 1,
    borderColor: '#EEECE5',
  },
  otpTitle: {
    color: MKColors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 9,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 10,
  },
  otpChoice: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E0D8',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  otpChoiceActive: {
    borderColor: '#B7DDB9',
    backgroundColor: MKColors.primaryGreenSurface,
  },
  otpChoiceText: {
    color: MKColors.textSecondary,
    fontSize: 12,
    fontWeight: '800',
  },
  otpChoiceTextActive: {
    color: MKColors.primaryGreenDark,
  },
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -4,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 5,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#E8E5DD',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
  },
  strengthText: {
    width: 104,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'right',
  },
  securityCard: {
    minHeight: 96,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CDE6C8',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 15,
  },
  securityShield: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8EBD5',
    marginRight: 12,
  },
  securityTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  securityTitle: {
    color: MKColors.primaryGreenDark,
    fontSize: 14,
    fontWeight: '800',
  },
  securityText: {
    color: MKColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 1.6,
    borderColor: '#BDB8AE',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    marginRight: 11,
  },
  checkboxActive: {
    backgroundColor: MKColors.primaryGreen,
    borderColor: MKColors.primaryGreen,
  },
  termsText: {
    flex: 1,
    color: MKColors.textPrimary,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  termsLink: {
    color: MKColors.primaryGreen,
    fontWeight: '800',
  },
  termsError: {
    color: MKColors.error,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 5,
    marginLeft: 36,
  },
  createButton: {
    height: 58,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 18,
    ...MKShadows.button,
  },
  createButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  createButtonIcon: {
    position: 'absolute',
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  signInRow: {
    marginTop: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  signInLine: {
    flex: 1,
    minWidth: 28,
    height: 1,
    backgroundColor: '#EEECE5',
  },
  signInText: {
    marginLeft: 12,
    color: MKColors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  signInLink: {
    marginRight: 12,
    color: MKColors.primaryGreen,
    fontSize: 13,
    fontWeight: '800',
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 24,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricIcon: {
    width: 50,
    height: 50,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricIconGreen: {
    backgroundColor: MKColors.primaryGreenSurface,
  },
  metricIconOrange: {
    backgroundColor: '#FFE6C4',
  },
  metricTitle: {
    color: MKColors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  metricSubtitle: {
    marginTop: 4,
    color: MKColors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
