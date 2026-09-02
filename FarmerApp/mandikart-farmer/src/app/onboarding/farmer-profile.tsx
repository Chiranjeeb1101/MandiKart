/**
 * MandiKart Farmer App — Screen 6: Tell Us About You (Farmer Profile Setup)
 * 
 * Implements the approved Stitch visual design:
 * Hero with smiling farmer artwork, role selection (Individual Farmer vs FPO),
 * profile photo picker, full name inputs, trust & security info card,
 * 3D CONTINUE CTA, and progress step indicators.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Users,
  Building2,
  Camera,
  ShieldCheck,
  ArrowRight,
  Check,
} from 'lucide-react-native';
import { MKBackground, MKButton, MKInput, MKHeader } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

const HERO_FARMER_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD1zzhHh18hq6LjVAEMcfI1k12J0wlMdsFGAsFBuOiP5lBJXehLGTX1y-lNH0zNqgeliS2rp8oUniLoZbHYXO416Uyk7_flx0esjTeOUNF8JrxJTCmgoborz3nvLbqY_fHF_1qVEOQeJI6GW4jrq1xbDkIyaAlhSGQ8E04XPP4CSwhWSRj9UEAlPUIqUgo0YsA8CppJgXMJkMEslewucIJV55eKiFwwdcMypkvdpixHou1z-zkWqzWM2w';

const AVATAR_PLACEHOLDER_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCt_2-uyTSWqni0gL3Ex7_Rtw8iBT7iAzP0jwrSLSYb7w-kRyA7dtkDrIWjibN6Cky_2P32YV2e4V3d2qw803N-_D5l3_AYMFTh8OMxHzlWbF5VTcdgCVUup9BBHTHb-ZOYLRYkkzOb5ZDGQvM5-fcLOsHUaBdmRJkI7r4PD3lunURNeGTMR3Q1y9o4wFl3iMd0gP2iVEASAPtpyWkGI8yJ1nzDTb98yUhM8XWo40qJtL7d74M073HltQ';

export default function FarmerProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [role, setRole] = useState<'INDIVIDUAL' | 'FPO'>('INDIVIDUAL');
  const [fullName, setFullName] = useState(user?.name || 'Ramesh Patil');
  const [contactName, setContactName] = useState('');
  const [experienceYears, setExperienceYears] = useState('12');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;

    if (user) {
      setUser({
        ...user,
        name: fullName,
        role: role === 'INDIVIDUAL' ? 'FARMER' : 'FPO_MANAGER',
      });
    }

    router.push('/onboarding/farm-details');
  };

  return (
    <MKBackground disableSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Hero Section */}
          <View style={styles.heroSection}>
            <MKHeader
              showBack={true}
              step={{ current: 1, total: 2, label: 'Profile' }}
              style={styles.headerAbsolute}
            />

            {/* Farmer Illustration Overlay */}
            <Image
              source={{ uri: HERO_FARMER_URI }}
              style={styles.heroFarmerImage}
              resizeMode="contain"
            />

            {/* Hero Titles */}
            <View style={styles.heroTitles}>
              <Text style={styles.heroMainTitle}>
                Tell Us <Text style={styles.heroTitleGreen}>About You</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                This helps us personalize your MandiKart experience
              </Text>
            </View>
          </View>

          {/* Main Card Content */}
          <View style={styles.mainCard}>
            {/* Section 1: Role Selection */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionIconBadge}>
                  <Users size={16} color="#1E5A2A" strokeWidth={2.2} />
                </View>
                <Text style={styles.sectionTitle}>How will you use MandiKart?</Text>
              </View>

              <View style={styles.rolesGrid}>
                {/* Individual Farmer Option */}
                <Pressable
                  onPress={() => setRole('INDIVIDUAL')}
                  style={[
                    styles.roleCard,
                    role === 'INDIVIDUAL' ? styles.roleCardActive : styles.roleCardInactive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === 'INDIVIDUAL' }}
                >
                  {role === 'INDIVIDUAL' && (
                    <View style={styles.roleCheckBadge}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View style={styles.roleIconCircle}>
                    <User size={24} color="#1E5A2A" strokeWidth={2} />
                  </View>
                  <Text style={styles.roleTitleActive}>Individual{'\n'}Farmer</Text>
                  <Text style={styles.roleSubtext}>Sell your own farm produce</Text>
                </Pressable>

                {/* FPO Option */}
                <Pressable
                  onPress={() => setRole('FPO')}
                  style={[
                    styles.roleCard,
                    role === 'FPO' ? styles.roleCardActive : styles.roleCardInactive,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === 'FPO' }}
                >
                  {role === 'FPO' && (
                    <View style={styles.roleCheckBadge}>
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  )}
                  <View style={[styles.roleIconCircle, { backgroundColor: '#FFF3E0' }]}>
                    <Building2 size={24} color="#EF7D1A" strokeWidth={2} />
                  </View>
                  <Text style={styles.roleTitleInactive}>FPO / Group</Text>
                  <Text style={styles.roleSubtext}>Manage for your farmer group</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Section 2: Profile Details */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIconBadge, { backgroundColor: '#FFF3E0' }]}>
                  <User size={16} color="#EF7D1A" strokeWidth={2.2} />
                </View>
                <Text style={styles.sectionTitle}>Your Profile</Text>
              </View>

              {/* Photo & Input Row */}
              <View style={styles.profileRow}>
                {/* Photo Uploader */}
                <View style={styles.photoContainer}>
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={{ uri: AVATAR_PLACEHOLDER_URI }}
                      style={styles.avatarImage}
                    />
                    <View style={styles.cameraBadge}>
                      <Camera size={14} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                  </View>
                  <Text style={styles.addPhotoText}>Change Photo</Text>
                </View>

                {/* Input Fields */}
                <View style={styles.inputsColumn}>
                  <MKInput
                    label="FULL NAME *"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    error={errors.fullName}
                  />

                  <MKInput
                    label="CONTACT PERSON (OPTIONAL)"
                    placeholder="E.g. Son / Manager"
                    value={contactName}
                    onChangeText={setContactName}
                  />
                </View>
              </View>

              <MKInput
                label="FARMING EXPERIENCE (YEARS)"
                placeholder="E.g. 10"
                value={experienceYears}
                onChangeText={setExperienceYears}
                keyboardType="numeric"
                helperText="Helps build trust with high-volume buyers"
              />
            </View>

            {/* Trust Info Box */}
            <View style={styles.trustBox}>
              <ShieldCheck size={24} color="#1E5A2A" strokeWidth={2} />
              <View style={styles.trustTextContainer}>
                <Text style={styles.trustTitle}>Why do we ask for this?</Text>
                <Text style={styles.trustDescription}>
                  Verified farmer identities ensure instant payment escrow and reliable direct buyer connections.
                </Text>
              </View>
            </View>

            {/* Action CTA & Progress */}
            <View style={styles.actionArea}>
              <MKButton
                title="CONTINUE"
                onPress={handleContinue}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />}
              />

              {/* Step dots (Step 2 of 4) */}
              <View style={styles.progressDotsRow}>
                <View style={[styles.dot, styles.dotDone]} />
                <View style={[styles.dot, styles.dotActive]} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>

              <Text style={styles.securityNote}>
                🔒 Your information is safe and secure with MandiKart
              </Text>
            </View>
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
  },
  heroSection: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 48,
    position: 'relative',
    minHeight: 220,
  },
  headerAbsolute: {
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  heroFarmerImage: {
    position: 'absolute',
    top: 40,
    right: -10,
    width: 170,
    height: 180,
    opacity: 0.85,
    zIndex: 1,
  },
  heroTitles: {
    maxWidth: '65%',
    marginTop: 12,
    zIndex: 2,
  },
  heroMainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1C1E',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  heroTitleGreen: {
    color: '#1E5A2A',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#5F6368',
    lineHeight: 20,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
    marginTop: -20,
    flex: 1,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1C1E',
  },
  rolesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardActive: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#1E5A2A',
  },
  roleCardInactive: {
    backgroundColor: '#FAF9F6',
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
  },
  roleCheckBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  roleIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  roleTitleActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E5A2A',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleTitleInactive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B2B2B',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleSubtext: {
    fontSize: 11,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECE4',
    marginVertical: 20,
  },
  profileRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  photoContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#E8F5E9',
    position: 'relative',
    overflow: 'visible',
    marginBottom: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1E5A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  addPhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  inputsColumn: {
    flex: 1,
  },
  trustBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  trustTextContainer: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E5A2A',
    marginBottom: 2,
  },
  trustDescription: {
    fontSize: 12,
    color: '#2B2B2B',
    lineHeight: 17,
  },
  actionArea: {
    paddingTop: 8,
    alignItems: 'center',
  },
  progressDotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5D5C5',
  },
  dotDone: {
    backgroundColor: '#1E5A2A',
  },
  dotActive: {
    backgroundColor: '#1E5A2A',
    width: 18,
  },
  securityNote: {
    fontSize: 12,
    color: '#7A7A7A',
  },
});
