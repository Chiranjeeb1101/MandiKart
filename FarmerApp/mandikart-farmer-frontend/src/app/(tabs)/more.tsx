import React, { useCallback, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
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
  User,
  WalletCards,
} from 'lucide-react-native';
import { MKBackground } from '@/components/ui';
import { MKColors } from '@/constants/colors';
import { MKShadows } from '@/constants/shadows';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

type IconComponent = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface MenuItem {
  title: string;
  subtitle?: string;
  icon: IconComponent;
  onPress: () => void;
  rightText?: string;
  iconTone?: 'green' | 'orange' | 'neutral';
}

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

  // Never invent account data: show profile details only after an authenticated
  // session provides them. The values below are intentionally derived from state.
  const profile = isAuthenticated ? farmer ?? user : null;
  const name = farmer?.fullName ?? user?.fullName ?? user?.name;
  const location = [user?.district, user?.state].filter(Boolean).join(', ');
  const isVerified = farmer?.isVerified === true;
  const hasFarmDetails = Boolean(user?.farmSize || user?.farmSizeAcres || user?.crops?.length);

  const completeProfile = useCallback(() => {
    router.push(hasFarmDetails ? '/onboarding/farmer-profile' : '/onboarding/farm-details');
  }, [hasFarmDetails, router]);

  const accountItems: MenuItem[] = [
    { title: 'Profile', subtitle: 'Personal information', icon: User, onPress: () => router.push('/onboarding/farmer-profile') },
    { title: 'Farm Details', subtitle: 'Farm, land and location', icon: Sprout, onPress: () => router.push('/onboarding/farm-details'), iconTone: 'green' },
    { title: 'Documents', subtitle: 'Verification documents', icon: FileText, onPress: () => router.push('/more/documents'), iconTone: 'orange' },
    { title: 'Bank & Payment Details', subtitle: 'Manage payment information', icon: WalletCards, onPress: () => router.push('/more/bank-details') },
  ];
  const preferenceItems: MenuItem[] = [
    { title: 'Notifications', subtitle: 'Orders, payments and market updates', icon: Bell, rightText: 'On', onPress: () => router.push('/more/notifications'), iconTone: 'orange' },
    { title: 'Language', subtitle: languageLabels[language] ?? 'English', icon: Languages, onPress: () => router.push('/language-select') },
    { title: 'App Settings', subtitle: 'App preferences and controls', icon: Settings, onPress: () => router.push('/more/settings') },
  ];
  const helpItems: MenuItem[] = [
    { title: 'Help Center', subtitle: 'Find answers to common questions', icon: CircleHelp, onPress: () => router.push('/more/help-support') },
    { title: 'Contact Support', subtitle: 'Talk to MandiKart support', icon: Headphones, onPress: () => router.push('/more/help-support'), iconTone: 'green' },
    { title: 'Report an Issue', subtitle: 'Report a problem with the app', icon: Flag, onPress: () => Alert.alert('Report an issue', 'Support reporting will be available here shortly.'), iconTone: 'orange' },
  ];
  const aboutItems: MenuItem[] = [
    { title: 'About MandiKart', subtitle: 'About the platform', icon: Info, onPress: () => router.push('/more/terms-privacy') },
    { title: 'Terms & Conditions', icon: FileCheck, onPress: () => router.push('/more/terms-privacy') },
    { title: 'Privacy Policy', icon: ShieldCheck, onPress: () => router.push('/more/terms-privacy'), iconTone: 'green' },
    { title: 'App Version', icon: Smartphone, rightText: 'v1.0.0', onPress: () => undefined },
  ];

  return (
    <MKBackground>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360)} style={styles.header}>
          <View>
            <Text style={styles.screenTitle}>More</Text>
            <Text style={styles.screenSubtitle}>Manage your account, farm and preferences</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open notifications" hitSlop={8} style={styles.headerButton} onPress={() => router.push('/more/notifications')}>
            <Bell size={20} color={MKColors.primaryGreenDark} />
          </Pressable>
        </Animated.View>

        {isOffline && (
          <View style={styles.offlineNotice} accessibilityRole="alert">
            <Text style={styles.offlineTitle}>No internet connection</Text>
            <Text style={styles.offlineText}>Some account information may be unavailable.</Text>
          </View>
        )}

        <Animated.View entering={FadeInUp.duration(420).delay(70)}>
          {profile && name ? (
            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatar} accessibilityLabel="Farmer profile avatar">
                  <User size={27} color={MKColors.primaryGreenDark} strokeWidth={2.1} />
                </View>
                <View style={styles.profileText}>
                  <Text numberOfLines={1} style={styles.profileName}>{name}</Text>
                  {isVerified ? (
                    <View style={styles.verifiedLine}><CheckCircle2 size={14} color={MKColors.primaryGreen} fill={MKColors.primaryGreen} /><Text style={styles.verifiedText}>Verified Farmer</Text></View>
                  ) : <Text style={styles.pendingText}>Account verification pending</Text>}
                  {location ? <View style={styles.locationLine}><MapPin size={13} color={MKColors.textSecondary} /><Text numberOfLines={1} style={styles.locationText}>{location}</Text></View> : null}
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Edit profile" style={styles.editButton} onPress={completeProfile}>
                  <Pencil size={17} color={MKColors.primaryGreenDark} />
                </Pressable>
              </View>
              <View style={styles.profileMeta}><Text style={styles.metaLabel}>Farmer account</Text><View style={styles.metaStatus}><CheckCircle2 size={12} color={MKColors.primaryGreen} /><Text style={styles.metaStatusText}>{isVerified ? 'Verified' : 'Pending verification'}</Text></View></View>
            </View>
          ) : (
            <View style={styles.incompleteCard}>
              <View style={styles.incompleteIcon}><Sprout size={22} color={MKColors.primaryGreenDark} /></View>
              <View style={styles.incompleteText}><Text style={styles.incompleteTitle}>Complete your profile</Text><Text style={styles.incompleteSub}>Add your farm details to get better selling opportunities.</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel="Complete profile" onPress={completeProfile}><Text style={styles.completeLink}>Complete</Text></Pressable>
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(420).delay(120)}><MenuSection title="Your Account" items={accountItems} /></Animated.View>
        <Animated.View entering={FadeInUp.duration(420).delay(160)}><MenuSection title="Preferences" items={preferenceItems} /></Animated.View>
        <Animated.View entering={FadeInUp.duration(420).delay(200)}><MenuSection title="Help & Support" items={helpItems} /></Animated.View>
        <Animated.View entering={FadeInUp.duration(420).delay(240)}><MenuSection title="About MandiKart" items={aboutItems} /></Animated.View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          android_ripple={{ color: '#F4D9D6' }}
          style={styles.logoutButton}
          onPress={() => setLogoutOpen(true)}
        >
          <LogOut size={19} color="#B84B4B" /><Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <View style={styles.footer}><View style={styles.brandMark}><Sprout size={14} color={MKColors.accentOrange} /></View><Text style={styles.brandName}>MandiKart</Text><Text style={styles.tagline}>Smart selling for better opportunities.</Text><Text style={styles.madeFor}>Made for farmers</Text></View>
      </ScrollView>

      <Modal transparent visible={logoutOpen} animationType="fade" onRequestClose={() => setLogoutOpen(false)}>
        <View style={styles.modalBackdrop}>
          <Animated.View entering={FadeInUp.duration(220)} style={styles.modalCard}>
            <View style={styles.modalIcon}><LogOut size={22} color="#B84B4B" /></View>
            <Text style={styles.modalTitle}>Log out of MandiKart?</Text>
            <Text style={styles.modalMessage}>You can sign back in anytime using your verified account.</Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.cancelButton} onPress={() => setLogoutOpen(false)}><Text style={styles.cancelText}>Cancel</Text></Pressable>
              <Pressable style={styles.confirmButton} onPress={() => { setLogoutOpen(false); logout(); router.replace('/auth/login'); }}><Text style={styles.confirmText}>Log Out</Text></Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </MKBackground>
  );
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.groupCard}>{items.map((item, index) => <MenuRow key={item.title} item={item} isLast={index === items.length - 1} />)}</View></View>;
}

function MenuRow({ item, isLast }: { item: MenuItem; isLast: boolean }) {
  const Icon = item.icon;
  const tone = item.iconTone === 'orange' ? styles.orangeIcon : item.iconTone === 'neutral' ? styles.neutralIcon : styles.greenIcon;
  const iconColor = item.iconTone === 'orange' ? MKColors.accentOrangeDark : item.iconTone === 'neutral' ? MKColors.textSecondary : MKColors.primaryGreenDark;
  // Use a concrete StyleSheet array here. In the affected Android runtime the
  // Pressable style callback was not applied, leaving its default column layout.
  return <Pressable
    accessibilityRole="button"
    accessibilityLabel={item.title}
    android_ripple={{ color: '#E7F0E8', borderless: false }}
    style={[styles.menuRow, !isLast && styles.rowDivider]}
    onPress={item.onPress}
  >
    <View style={[styles.iconBox, tone]}><Icon size={20} color={iconColor} strokeWidth={2.1} /></View>
    <View style={styles.rowText}><Text style={styles.rowTitle}>{item.title}</Text>{item.subtitle ? <Text numberOfLines={1} style={styles.rowSubtitle}>{item.subtitle}</Text> : null}</View>
    {item.rightText ? <Text style={[styles.rightText, item.rightText === 'On' && styles.onText]}>{item.rightText}</Text> : null}
    {item.title !== 'App Version' && <ChevronRight size={19} color="#A0A5A3" />}
  </Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 },
  screenTitle: { color: MKColors.textPrimary, fontSize: 27, fontWeight: '800', letterSpacing: -0.5 },
  screenSubtitle: { color: MKColors.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 3 },
  headerButton: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#FFFDF9', alignItems: 'center', justifyContent: 'center', ...MKShadows.sm },
  offlineNotice: { marginBottom: 14, padding: 13, borderRadius: 16, backgroundColor: '#FFF7E9', borderWidth: 1, borderColor: '#F9E3B3' },
  offlineTitle: { color: '#865C12', fontSize: 13, fontWeight: '700' }, offlineText: { color: '#8A734D', fontSize: 12, lineHeight: 17, marginTop: 2 },
  profileCard: { backgroundColor: MKColors.backgroundCard, borderRadius: 24, padding: 17, borderWidth: 1, borderColor: '#F1EEE6', ...MKShadows.md },
  profileTop: { flexDirection: 'row', alignItems: 'center' }, avatar: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E7F3E8' },
  profileText: { flex: 1, marginLeft: 13, minWidth: 0 }, profileName: { color: MKColors.textPrimary, fontSize: 17, fontWeight: '800' }, verifiedLine: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }, verifiedText: { color: MKColors.primaryGreenDark, fontSize: 12, fontWeight: '700' }, pendingText: { color: MKColors.textSecondary, fontSize: 12, marginTop: 3 },
  locationLine: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 }, locationText: { flex: 1, color: MKColors.textSecondary, fontSize: 12 }, editButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ECF6ED', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  profileMeta: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#EEECE6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 15 }, metaLabel: { color: MKColors.textMuted, fontSize: 11, fontWeight: '600' }, metaStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 }, metaStatusText: { color: MKColors.primaryGreenDark, fontSize: 11, fontWeight: '700' },
  incompleteCard: { alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFFCF5', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#F2E8D3', ...MKShadows.sm }, incompleteIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: '#E8F5E9' }, incompleteText: { flex: 1, marginHorizontal: 11 }, incompleteTitle: { color: MKColors.textPrimary, fontSize: 14, fontWeight: '800' }, incompleteSub: { color: MKColors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 }, completeLink: { color: MKColors.primaryGreenDark, fontSize: 12, fontWeight: '800' },
  section: { marginTop: 24 }, sectionTitle: { color: MKColors.textPrimary, fontSize: 17, fontWeight: '800', marginBottom: 10 }, groupCard: { backgroundColor: MKColors.backgroundCard, borderRadius: 21, paddingHorizontal: 5, overflow: 'hidden', ...MKShadows.sm },
  menuRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, paddingVertical: 10 }, rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EEEDE9' }, iconBox: { width: 40, height: 40, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }, greenIcon: { backgroundColor: '#EAF5EB' }, orangeIcon: { backgroundColor: '#FFF3E5' }, neutralIcon: { backgroundColor: '#F1F3F1' }, rowText: { flex: 1, marginLeft: 13, marginRight: 8 }, rowTitle: { color: MKColors.textPrimary, fontSize: 14, fontWeight: '700' }, rowSubtitle: { color: MKColors.textSecondary, fontSize: 12, lineHeight: 16, marginTop: 2 }, rightText: { color: MKColors.textMuted, fontSize: 12, fontWeight: '700', marginRight: 5 }, onText: { color: MKColors.primaryGreen },
  logoutButton: { height: 52, borderRadius: 17, marginTop: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: '#FFF7F6', borderWidth: 1, borderColor: '#F8E5E3' }, logoutText: { color: '#B84B4B', fontSize: 15, fontWeight: '800' },
  footer: { alignItems: 'center', marginTop: 36 }, brandMark: { width: 26, height: 26, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1E2' }, brandName: { color: MKColors.primaryGreenDark, fontSize: 14, fontWeight: '800', marginTop: 6 }, tagline: { color: MKColors.textSecondary, fontSize: 11, marginTop: 3 }, madeFor: { color: MKColors.textMuted, fontSize: 10, marginTop: 7 },
  modalBackdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(24, 29, 25, 0.38)', padding: 24 }, modalCard: { width: '100%', maxWidth: 360, borderRadius: 24, backgroundColor: MKColors.backgroundCard, padding: 22, alignItems: 'center', ...MKShadows.lg }, modalIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF1F0' }, modalTitle: { color: MKColors.textPrimary, fontSize: 18, fontWeight: '800', marginTop: 14 }, modalMessage: { color: MKColors.textSecondary, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 7 }, modalActions: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 22 }, cancelButton: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F1' }, cancelText: { color: MKColors.textPrimary, fontSize: 14, fontWeight: '800' }, confirmButton: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#C95B57' }, confirmText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
