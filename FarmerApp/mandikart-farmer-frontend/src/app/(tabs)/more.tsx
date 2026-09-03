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
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
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
  Upload,
  User,
  WalletCards,
  Camera,
  X,
} from 'lucide-react-native';
import { MKScreen, MKSection, MKCard, MKRow } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKSpacing } from '@/constants/spacing';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { pickImageFromGallery, takePhotoWithCamera } from '@/services/imagePickerService';

const FARMER_PORTRAIT_URI =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop';

const languageLabels: Record<string, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  or: 'ଓଡ଼ିଆ',
};

export default function MoreScreen() {
  const router = useRouter();
  const { farmer, user, setUser, isAuthenticated, logout } = useAuthStore();
  const { language, isOffline } = useAppStore();
  const { t } = useTranslation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const profile = isAuthenticated ? farmer ?? user : null;
  const name = farmer?.fullName ?? user?.fullName ?? user?.name;
  const location = [user?.village, user?.district, user?.state].filter(Boolean).join(', ') || [user?.district, user?.state].filter(Boolean).join(', ');
  const isVerified = farmer?.isVerified === true;
  const hasFarmDetails = Boolean(user?.farmSize || user?.farmSizeAcres || user?.crops?.length);

  async function handlePickFromGallery() {
    setPhotoModalVisible(false);
    const res = await pickImageFromGallery();
    if (!res.cancelled && res.uri) {
      if (user) {
        setUser({ ...user, avatarUri: res.uri });
      }
      Alert.alert('Profile Photo Updated', 'Your new photo has been applied.');
    }
  }

  async function handleTakePhoto() {
    setPhotoModalVisible(false);
    const res = await takePhotoWithCamera();
    if (!res.cancelled && res.uri) {
      if (user) {
        setUser({ ...user, avatarUri: res.uri });
      }
      Alert.alert('Profile Photo Updated', 'Your new photo has been applied.');
    }
  }

  const completeProfile = useCallback(() => {
    router.push(hasFarmDetails ? '/onboarding/farmer-profile' : '/onboarding/farm-details');
  }, [hasFarmDetails, router]);

  return (
    <MKScreen>
      {/* ── 1. Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.screenTitle}>{t.moreTitle}</Text>
          <Text style={styles.screenSubtitle}>{t.moreSubtitle}</Text>
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

      {/* ── 2. Profile Hero Card (Stitch) ── */}
      <View style={styles.profileSectionWrapper}>
        <MKCard style={styles.stitchProfileCard}>
          <View style={styles.profileTopRow}>
            <Pressable
              onPress={() => setPhotoModalVisible(true)}
              style={styles.avatarPickerWrapper}
            >
              <Image
                source={{ uri: user?.avatarUri || FARMER_PORTRAIT_URI }}
                style={styles.profileHeroImage}
              />
              <View style={styles.avatarCameraBadge}>
                <Camera size={12} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </Pressable>
            <View style={styles.profileInfoCol}>
              <Text numberOfLines={1} style={styles.profileNameText}>
                {name || 'Ravi Kumar'}
              </Text>
              <View style={styles.profileLocationRow}>
                <MapPin size={13} color="#6B7280" />
                <Text numberOfLines={1} style={styles.profileLocationText}>
                  {location || 'Nashik, Maharashtra'}
                </Text>
              </View>
              <View style={styles.profileCompleteBadge}>
                <CheckCircle2 size={12} color="#1B6D24" fill="#E8F5E9" />
                <Text style={styles.profileCompleteText}>{t.profileComplete || 'Profile Complete'}</Text>
              </View>
            </View>
          </View>

          <Pressable
            onPress={() => router.push('/more/profile')}
            style={({ pressed }) => [
              styles.viewProfileRow,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Text style={styles.viewProfileText}>{t.viewProfile || 'View & Edit Profile'}</Text>
            <ChevronRight size={18} color="#1B6D24" />
          </Pressable>
        </MKCard>
      </View>

      {/* ── 3. Section: Your Account ── */}
      <MKSection title="Your Account">
        <MKCard padding="none">
          <MKRow
            title="Profile Details & Edit"
            icon={<User size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            onPress={() => router.push('/more/profile')}
          />
          <MKRow
            title="Earnings & Payouts"
            icon={<WalletCards size={20} color="#1B6D24" strokeWidth={2.1} />}
            iconBgColor="#E8F5E9"
            onPress={() => router.push('/earnings')}
          />
          <MKRow
            title="Farm Details"
            icon={<Sprout size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            onPress={() => router.push('/onboarding/farm-details')}
          />
          <MKRow
            title="Documents"
            icon={<FileText size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            rightText="2 of 3 verified"
            onPress={() => router.push('/more/documents')}
          />
          <MKRow
            title="Bank & Payment"
            icon={<WalletCards size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            rightText="•••• 4521"
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
            icon={<Bell size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            rightText="3"
            onPress={() => router.push('/more/notifications')}
          />
          <MKRow
            title="Language"
            icon={<Languages size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            rightText={languageLabels[language] ?? 'English'}
            onPress={() => router.push('/language-select')}
          />
          <MKRow
            title="Settings"
            icon={<Settings size={20} color="#964900" strokeWidth={2.1} />}
            iconBgColor="#FFF3E5"
            isLast
            onPress={() => router.push('/more/settings')}
          />
        </MKCard>
      </MKSection>

      {/* ── 5. Section: Help & Support ── */}
      <MKSection title="Help & Support">
        {/* Stitch Help Callout Card */}
        <View style={styles.helpCalloutCard}>
          <View style={styles.helpIconCircle}>
            <Headphones size={22} color="#1B6D24" />
          </View>
          <View style={styles.helpTextCol}>
            <Text style={styles.helpCardTitle}>
              Need help? Talk to us about orders, pickup or account
            </Text>
            <Pressable
              onPress={() => router.push('/more/help-support')}
              style={({ pressed }) => [
                styles.getHelpBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
              ]}
            >
              <Text style={styles.getHelpBtnText}>Get Help</Text>
            </Pressable>
          </View>
        </View>

        <MKCard padding="none">
          <MKRow
            title="Help Center"
            icon={<CircleHelp size={20} color="#564336" strokeWidth={2.1} />}
            iconBgColor="#F3DED3"
            onPress={() => router.push('/more/help-support')}
          />
          <MKRow
            title="Contact Support"
            icon={<Headphones size={20} color="#564336" strokeWidth={2.1} />}
            iconBgColor="#F3DED3"
            onPress={() => router.push('/more/help-support')}
          />
          <MKRow
            title="Report an Issue"
            icon={<Flag size={20} color="#564336" strokeWidth={2.1} />}
            iconBgColor="#F3DED3"
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
      <View style={{ width: '100%', marginTop: MKSpacing.lg, marginBottom: MKSpacing.md, paddingHorizontal: MKSpacing.md }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          android_ripple={{ color: '#FCA5A5' }}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
          ]}
          onPress={() => setLogoutOpen(true)}
        >
          <LogOut size={20} color="#DC2626" strokeWidth={2.2} />
          <Text style={styles.logoutText}>Log Out of Account</Text>
        </Pressable>
      </View>

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
          <View style={styles.modalCard}>
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
          </View>
        </View>
      </Modal>

      {/* Photo Picker Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable
          style={styles.photoModalOverlay}
          onPress={() => setPhotoModalVisible(false)}
        >
          <View style={styles.photoModalCard}>
            <View style={styles.photoModalHeader}>
              <Text style={styles.photoModalTitle}>Change Profile Photo</Text>
              <Pressable onPress={() => setPhotoModalVisible(false)}>
                <X size={20} color="#666" />
              </Pressable>
            </View>
            <Text style={styles.photoModalSubtitle}>
              Update your photo across your MandiKart profile.
            </Text>

            <Pressable style={styles.photoOptionBtn} onPress={handleTakePhoto}>
              <Camera size={20} color="#1B6D24" strokeWidth={2.2} />
              <Text style={styles.photoOptionText}>Take Photo with Camera</Text>
            </Pressable>

            <Pressable style={styles.photoOptionBtn} onPress={handlePickFromGallery}>
              <Upload size={20} color="#EF7D1A" strokeWidth={2.2} />
              <Text style={styles.photoOptionText}>Choose from Gallery</Text>
            </Pressable>

            <Pressable
              style={styles.photoCancelBtn}
              onPress={() => setPhotoModalVisible(false)}
            >
              <Text style={styles.photoCancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
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

  /* ── Profile Section (Stitch) ── */
  profileSectionWrapper: {
    width: '100%',
    marginBottom: MKSpacing.xl,
  },
  stitchProfileCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: '#EFEAE0',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#1A1C1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  profileHeroImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 14,
  },
  profileInfoCol: {
    flex: 1,
  },
  profileNameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#212121',
  },
  profileLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 4,
  },
  profileLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  profileCompleteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  profileCompleteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B6D24',
    marginLeft: 4,
  },
  viewProfileRow: {
    width: '100%',
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#F0ECE4',
    paddingTop: 14,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B6D24',
  },

  /* Stitch Help Callout Card */
  helpCalloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1EA',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#FFDAD6',
    marginBottom: MKSpacing.md,
  },
  helpIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpTextCol: {
    flex: 1,
  },
  helpCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#564336',
    lineHeight: 17,
    marginBottom: 8,
  },
  getHelpBtn: {
    backgroundColor: '#964900',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  getHelpBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
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
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#DC2626',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  logoutText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
    flexShrink: 1,
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

  // Avatar picker and photo modal
  avatarPickerWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E5A2A',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  photoModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  photoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  photoModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#241913',
  },
  photoModalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 18,
  },
  photoOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECEAE3',
    gap: 12,
    marginBottom: 12,
  },
  photoOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#241913',
  },
  photoCancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  photoCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
});
