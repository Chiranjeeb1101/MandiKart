/**
 * MandiKart Farmer App — Screen 12: More (Settings, Account & Support)
 *
 * Built using MandiKart production layout primitives (MKScreen, MKSection, MKCard, MKRow).
 * Eliminates all vertical stacking/alignment issues on settings rows forever.
 * Icon (shrink-0) + Text (flex-1 min-w-0) + Chevron/Status (shrink-0).
 */

import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import {
  Bell,
  CheckCircle2,
  CircleHelp,
  FileCheck,
  FileText,
  Flag,
  Headphones,
  Info,
  Languages,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  ShieldCheck,
  Smartphone,
  Sprout,
  User,
  WalletCards,
} from 'lucide-react-native';
import { MKScreen, MKSection, MKCard, MKRow } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

const languageLabels: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

export default function MoreScreen() {
  const router = useRouter();
  const { farmer, user, isAuthenticated, logout } = useAuthStore();
  const { language, isOffline } = useAppStore();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const profile = isAuthenticated ? farmer ?? user : null;
  const name = farmer?.fullName ?? user?.fullName ?? user?.name;
  const location = [user?.district, user?.state].filter(Boolean).join(', ');
  const isVerified = farmer?.isVerified === true;
  const hasFarmDetails = Boolean(user?.farmSize || user?.farmSizeAcres || user?.crops?.length);

  const completeProfile = useCallback(() => {
    router.push(hasFarmDetails ? '/onboarding/farmer-profile' : '/onboarding/farm-details');
  }, [hasFarmDetails, router]);

  return (
    <MKScreen>
      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.screenTitle}>More</Text>
          <Text style={styles.screenSubtitle}>Manage your account, farm and preferences</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          hitSlop={8}
          style={({ pressed }) => [
            styles.headerButton,
            pressed && { transform: [{ scale: 0.90 }], opacity: 0.85 },
          ]}
          onPress={() => router.push('/more/notifications')}
        >
          <Bell size={20} color={MKColors.primaryGreenDark} />
        </Pressable>
      </View>

      {/* Offline notice */}
      {isOffline && (
        <View style={styles.offlineNotice} accessibilityRole="alert">
          <Text style={styles.offlineTitle}>No internet connection</Text>
          <Text style={styles.offlineText}>Some account information may be unavailable.</Text>
        </View>
      )}

      {/* ── 2. Profile Card ── */}
      <View style={styles.profileSectionWrapper}>
        {profile && name ? (
          <MKCard padding="lg">
            <View style={styles.profileTop}>
              <View style={styles.avatar}>
                <User size={27} color={MKColors.primaryGreenDark} strokeWidth={2.1} />
              </View>
              <View style={styles.profileText}>
                <Text numberOfLines={1} style={styles.profileName}>
                  {name}
                </Text>
                {isVerified ? (
                  <View style={styles.verifiedLine}>
                    <CheckCircle2 size={14} color={MKColors.primaryGreen} fill={MKColors.primaryGreen} />
                    <Text style={styles.verifiedText}>Verified Farmer</Text>
                  </View>
                ) : (
                  <Text style={styles.pendingText}>Account verification pending</Text>
                )}
                {location ? (
                  <View style={styles.locationLine}>
                    <MapPin size={13} color={MKColors.textSecondary} />
                    <Text numberOfLines={1} style={styles.locationText}>
                      {location}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit profile"
                style={({ pressed }) => [
                  styles.editButton,
                  pressed && { transform: [{ scale: 0.90 }], opacity: 0.8 },
                ]}
                onPress={completeProfile}
              >
                <Pencil size={17} color={MKColors.primaryGreenDark} />
              </Pressable>
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.metaLabel}>Farmer account</Text>
              <View style={styles.metaStatus}>
                <CheckCircle2 size={12} color={MKColors.primaryGreen} />
                <Text style={styles.metaStatusText}>
                  {isVerified ? 'Verified' : 'Pending verification'}
                </Text>
              </View>
            </View>
          </MKCard>
        ) : (
          <MKCard padding="md" style={styles.incompleteCard}>
            <View style={styles.incompleteRow}>
              <View style={styles.incompleteIcon}>
                <Sprout size={22} color={MKColors.primaryGreenDark} />
              </View>
              <View style={styles.incompleteText}>
                <Text style={styles.incompleteTitle}>Complete your profile</Text>
                <Text style={styles.incompleteSub}>Add your farm details to get better selling opportunities.</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={completeProfile}>
                <Text style={styles.completeLink}>Complete</Text>
              </Pressable>
            </View>
          </MKCard>
        )}
      </View>

      {/* ── 3. Section: Your Account ── */}
      <MKSection title="Your Account">
        <MKCard padding="none">
          <MKRow
            title="Profile"
            subtitle="Personal information"
            icon={<User size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/onboarding/farmer-profile')}
          />
          <MKRow
            title="Farm Details"
            subtitle="Farm, land and location"
            icon={<Sprout size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/onboarding/farm-details')}
          />
          <MKRow
            title="Documents"
            subtitle="Verification documents"
            icon={<FileText size={20} color={MKColors.accentOrangeDark} strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            onPress={() => router.push('/more/documents')}
          />
          <MKRow
            title="Bank & Payment Details"
            subtitle="Manage payment information"
            icon={<WalletCards size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            isLast
            onPress={() => router.push('/more/bank-details')}
          />
        </MKCard>
      </MKSection>

      {/* ── 4. Section: Preferences ── */}
      <MKSection title="Preferences">
        <MKCard padding="none">
          <MKRow
            title="Notifications"
            subtitle="Orders, payments and market updates"
            icon={<Bell size={20} color={MKColors.accentOrangeDark} strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            rightText="On"
            onPress={() => router.push('/more/notifications')}
          />
          <MKRow
            title="Language"
            subtitle={languageLabels[language] ?? 'English'}
            icon={<Languages size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/language-select')}
          />
          <MKRow
            title="App Settings"
            subtitle="App preferences and controls"
            icon={<Settings size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            isLast
            onPress={() => router.push('/more/settings')}
          />
        </MKCard>
      </MKSection>

      {/* ── 5. Section: Help & Support ── */}
      <MKSection title="Help & Support">
        <MKCard padding="none">
          <MKRow
            title="Help Center"
            subtitle="Find answers to common questions"
            icon={<CircleHelp size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/more/help-support')}
          />
          <MKRow
            title="Contact Support"
            subtitle="Talk to MandiKart support"
            icon={<Headphones size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/more/help-support')}
          />
          <MKRow
            title="Report an Issue"
            subtitle="Report a problem with the app"
            icon={<Flag size={20} color={MKColors.accentOrangeDark} strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            isLast
            onPress={() => Alert.alert('Report an issue', 'Support reporting will be available here shortly.')}
          />
        </MKCard>
      </MKSection>

      {/* ── 6. Section: About MandiKart ── */}
      <MKSection title="About MandiKart">
        <MKCard padding="none">
          <MKRow
            title="About MandiKart"
            subtitle="About the platform"
            icon={<Info size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/more/terms-privacy')}
          />
          <MKRow
            title="Terms & Conditions"
            icon={<FileCheck size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/more/terms-privacy')}
          />
          <MKRow
            title="Privacy Policy"
            icon={<ShieldCheck size={20} color={MKColors.primaryGreenDark} strokeWidth={2.1} />}
            iconBgColor="#EAF5EB"
            onPress={() => router.push('/more/terms-privacy')}
          />
          <MKRow
            title="App Version"
            icon={<Smartphone size={20} color={MKColors.textSecondary} strokeWidth={2.1} />}
            iconBgColor="#F1F3F1"
            rightText="v1.0.0"
            showChevron={false}
            isLast
          />
        </MKCard>
      </MKSection>

      {/* ── 7. Logout Button ── */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        android_ripple={{ color: '#F4D9D6' }}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && { transform: [{ scale: 0.97 }], opacity: 0.88 },
        ]}
        onPress={() => setLogoutOpen(true)}
      >
        <LogOut size={19} color="#B84B4B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      {/* ── 8. Footer Brand Mark ── */}
      <View style={styles.footer}>
        <View style={styles.brandMark}>
          <Sprout size={14} color={MKColors.accentOrange} />
        </View>
        <Text style={styles.brandName}>MandiKart</Text>
        <Text style={styles.tagline}>Smart selling for better opportunities.</Text>
        <Text style={styles.madeFor}>Made for farmers</Text>
      </View>

      {/* Logout Modal */}
      <Modal
        transparent
        visible={logoutOpen}
        animationType="fade"
        onRequestClose={() => setLogoutOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View entering={FadeInUp.duration(220)} style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <LogOut size={22} color="#B84B4B" />
            </View>
            <Text style={styles.modalTitle}>Log out of MandiKart?</Text>
            <Text style={styles.modalMessage}>
              You can sign back in anytime using your verified account.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setLogoutOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.confirmButton}
                onPress={() => {
                  setLogoutOpen(false);
                  logout();
                  router.replace('/auth/login');
                }}
              >
                <Text style={styles.confirmText}>Log Out</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </MKScreen>
  );
}

const styles = StyleSheet.create({
  /* ── Header ── */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: MKSpacing.lg,
    width: '100%',
  },
  headerTextCol: {
    flex: 1,
    marginRight: MKSpacing.md,
  },
  screenTitle: {
    color: MKColors.textPrimary,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  screenSubtitle: {
    color: MKColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#FFFDF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0ECE4',
    elevation: 2,
    flexShrink: 0,
  },

  /* ── Offline notice ── */
  offlineNotice: {
    marginBottom: MKSpacing.md,
    padding: 13,
    borderRadius: 16,
    backgroundColor: '#FFF7E9',
    borderWidth: 1,
    borderColor: '#F9E3B3',
    width: '100%',
  },
  offlineTitle: {
    color: '#865C12',
    fontSize: 13,
    fontWeight: '700',
  },
  offlineText: {
    color: '#8A734D',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },

  /* ── Profile Section ── */
  profileSectionWrapper: {
    width: '100%',
    marginBottom: MKSpacing.xl,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F3E8',
    flexShrink: 0,
  },
  profileText: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
    minWidth: 0,
  },
  profileName: {
    color: MKColors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  verifiedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  verifiedText: {
    color: MKColors.primaryGreenDark,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  pendingText: {
    color: MKColors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    flex: 1,
    color: MKColors.textSecondary,
    fontSize: 12,
    marginLeft: 3,
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECF6ED',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  profileMeta: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEECE6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 15,
    width: '100%',
  },
  metaLabel: {
    color: MKColors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  metaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaStatusText: {
    color: MKColors.primaryGreenDark,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },

  /* ── Incomplete Profile Card ── */
  incompleteCard: {
    backgroundColor: '#FFFCF5',
    borderColor: '#F2E8D3',
  },
  incompleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  incompleteIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    flexShrink: 0,
  },
  incompleteText: {
    flex: 1,
    marginLeft: 11,
    marginRight: 11,
    minWidth: 0,
  },
  incompleteTitle: {
    color: MKColors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  incompleteSub: {
    color: MKColors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  completeLink: {
    color: MKColors.primaryGreenDark,
    fontSize: 12,
    fontWeight: '800',
    flexShrink: 0,
  },

  /* ── Logout Button ── */
  logoutButton: {
    width: '100%',
    height: 52,
    borderRadius: 17,
    marginTop: MKSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7F6',
    borderWidth: 1,
    borderColor: '#F8E5E3',
  },
  logoutText: {
    color: '#B84B4B',
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 9,
  },

  /* ── Footer ── */
  footer: {
    alignItems: 'center',
    marginTop: MKSpacing['3xl'],
    marginBottom: MKSpacing.md,
    width: '100%',
  },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1E2',
  },
  brandName: {
    color: MKColors.primaryGreenDark,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  tagline: {
    color: MKColors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  madeFor: {
    color: MKColors.textMuted,
    fontSize: 10,
    marginTop: 7,
  },

  /* ── Logout Modal ── */
  modalBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(24, 29, 25, 0.38)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: MKColors.backgroundCard,
    padding: 22,
    alignItems: 'center',
    elevation: 8,
  },
  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF1F0',
  },
  modalTitle: {
    color: MKColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
  },
  modalMessage: {
    color: MKColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 7,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 22,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F1',
    marginRight: 10,
  },
  cancelText: {
    color: MKColors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C95B57',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
