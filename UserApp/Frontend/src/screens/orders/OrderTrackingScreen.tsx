import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, StatusBar, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';
import { SAMPLE_PRODUCTS } from '../../services/mockData';

export default function OrderTrackingScreen({ navigation, route }: any) {
  const orderId = route.params?.orderId || 'MK-2024-001234';
  const order = route.params?.order || {
    id: orderId,
    date: '3 Sep 2026, 02:30 PM',
    status: 'DISPATCHED',
    total: 395,
    itemsPreview: [SAMPLE_PRODUCTS[0], SAMPLE_PRODUCTS[2], SAMPLE_PRODUCTS[7]],
    farmerName: 'Rajan Kumar',
    estimatedDelivery: 'Today by 5:30 PM',
  };

  const [selectedInstruction, setSelectedInstruction] = useState<string>('Ring Bell');
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const handleCallDriver = () => {
    Alert.alert('Call Delivery Executive 📞', 'Calling Suresh Patil (+91 98234 56789)...', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL('tel:+919823456789') },
    ]);
  };

  const handleTip = (amount: number) => {
    setSelectedTip(amount);
    Alert.alert('Thank You! 🙏', `₹${amount} tip added for Suresh Patil. 100% of your tip goes directly to the delivery partner.`);
  };

  const handleInstruction = (inst: string) => {
    setSelectedInstruction(inst);
    Alert.alert('Instruction Saved 📝', `Delivery instruction "${inst}" sent to your delivery partner.`);
  };

  const timelineSteps = [
    { title: 'Order Confirmed', time: '02:30 PM', desc: 'Order received & confirmed by farm', done: true },
    { title: 'Harvested & Packed', time: '03:00 PM', desc: 'Freshly picked by Rajan Kumar from Nashik farm', done: true },
    { title: 'Out for Delivery', time: '03:15 PM', desc: 'Suresh Patil picked up order (1.8 km away)', done: true, active: true },
    { title: 'Delivered', time: 'Est. 03:45 PM', desc: 'Will be delivered to Flat 402, Shivajinagar', done: false },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.title}>Live Order Tracking</Text>
          <Text style={styles.subtitle}>{order.id}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Location Refreshed 🔄', 'Driver location updated to live GPS.')}>
          <Ionicons name="refresh" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Live Hero Countdown Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View>
              <View style={styles.liveTagWrap}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveTagText}>LIVE TRACKING</Text>
              </View>
              <Text style={styles.heroEtaTitle}>Arriving in 25 mins</Text>
              <Text style={styles.heroSub}>Suresh is 1.8 km away • FC Road, Pune</Text>
            </View>

            <View style={styles.timerCircle}>
              <Text style={styles.timerNumber}>25</Text>
              <Text style={styles.timerUnit}>MINS</Text>
            </View>
          </View>

          {/* Freshness Cold-Chain Badge */}
          <View style={styles.coldChainBar}>
            <Ionicons name="snow-outline" size={16} color={Colors.primary} />
            <Text style={styles.coldChainText}>
              <Text style={styles.coldChainHighlight}>Cold-Chain EV Van (4°C):</Text> Farm freshness 100% preserved
            </Text>
          </View>
        </View>

        {/* Visual Map Simulation */}
        <View style={styles.mapCard}>
          <View style={styles.mapBg}>
            <View style={styles.routeLine} />

            {/* Farm Pin */}
            <View style={[styles.pinWrap, { left: 24, top: 40 }]}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinEmoji}>🌾</Text>
              </View>
              <Text style={styles.pinLabel}>Nashik Farm</Text>
            </View>

            {/* Active Van Pin */}
            <View style={[styles.pinWrap, { left: '46%', top: 20 }]}>
              <View style={[styles.pinBubble, styles.activePinBubble]}>
                <Ionicons name="car" size={22} color={Colors.white} />
              </View>
              <View style={styles.activeLabelBubble}>
                <Text style={styles.activePinText}>🚚 Suresh (1.8 km)</Text>
              </View>
            </View>

            {/* Home Pin */}
            <View style={[styles.pinWrap, { right: 24, bottom: 35 }]}>
              <View style={styles.pinBubble}>
                <Text style={styles.pinEmoji}>🏠</Text>
              </View>
              <Text style={styles.pinLabel}>Your Home</Text>
            </View>
          </View>
        </View>

        {/* Delivery Executive Profile */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Delivery Executive</Text>
          
          <View style={styles.driverRow}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverEmoji}>👨‍✈️</Text>
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Suresh Patil</Text>
              <Text style={styles.driverVehicle}>Eco Electric Van • MH 12 AB 4821</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.ratingText}>4.9 Rating (420+ deliveries)</Text>
              </View>
            </View>

            <View style={styles.driverActionBtns}>
              <TouchableOpacity style={styles.callDriverBtn} onPress={handleCallDriver}>
                <Ionicons name="call" size={16} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.msgDriverBtn}
                onPress={() => navigation.navigate('ChatStack', { screen: 'Chat', params: { name: 'Suresh Patil' } })}
              >
                <Ionicons name="chatbubble-ellipses" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tip Delivery Partner */}
          <View style={styles.tipSection}>
            <Text style={styles.tipTitle}>Tip your delivery partner</Text>
            <View style={styles.tipChipsRow}>
              {[20, 30, 50].map((amt) => {
                const active = selectedTip === amt;
                return (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.tipChip, active && styles.tipChipActive]}
                    onPress={() => handleTip(amt)}
                  >
                    <Text style={[styles.tipChipText, active && styles.tipChipTextActive]}>+ ₹{amt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Delivery Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Instructions</Text>
          <View style={styles.instRow}>
            {[
              { label: 'Leave at Door', icon: 'home-outline' },
              { label: 'Ring Bell', icon: 'notifications' },
              { label: "Don't Ring Bell", icon: 'notifications-off' },
              { label: 'Guard Desk', icon: 'shield-checkmark' },
            ].map((inst) => {
              const active = selectedInstruction === inst.label;
              return (
                <TouchableOpacity
                  key={inst.label}
                  style={[styles.instChip, active && styles.instChipActive]}
                  onPress={() => handleInstruction(inst.label)}
                >
                  <Ionicons name={inst.icon as any} size={14} color={active ? Colors.white : Colors.textPrimary} />
                  <Text style={[styles.instText, active && styles.instTextActive]}>{inst.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Delivery Progress Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Progress</Text>
          
          <View style={styles.timelineList}>
            {timelineSteps.map((step, index) => {
              const isLast = index === timelineSteps.length - 1;
              return (
                <View key={step.title} style={styles.timelineRow}>
                  <View style={styles.leftCol}>
                    <View style={[
                      styles.dot,
                      step.done && styles.dotDone,
                      step.active && styles.dotActive,
                    ]}>
                      {step.done && !step.active && (
                        <Ionicons name="checkmark" size={10} color={Colors.white} />
                      )}
                      {step.active && <View style={styles.innerDot} />}
                    </View>
                    {!isLast && <View style={[styles.line, step.done && styles.lineDone]} />}
                  </View>

                  <View style={styles.stepInfo}>
                    <View style={styles.stepHeader}>
                      <Text style={[styles.stepTitle, step.active && styles.activeStepTitle]}>{step.title}</Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Produce Items in Shipment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items in Shipment ({order.itemsPreview.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.itemsList}>
            {order.itemsPreview.map((item: any, i: number) => (
              <View key={`${item.id}-${i}`} style={styles.itemChip}>
                <Image source={{ uri: item.imageUrl }} style={styles.itemThumb} />
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}/{item.unit}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Need Help Button */}
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => Alert.alert('MandKart Support 🎧', 'Connecting you with 24/7 MandiKart Customer Support...')}
        >
          <Ionicons name="headset-outline" size={18} color={Colors.primary} />
          <Text style={styles.helpText}>Need Help with this order?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  headerTitleWrap: { alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  scroll: { padding: Spacing.md, gap: Spacing.md, paddingBottom: 40 },
  // Hero Card
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  liveTagWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  liveTagText: { fontSize: 10, fontWeight: '800', color: '#22c55e', letterSpacing: 0.5 },
  heroEtaTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  heroSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  timerCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  timerNumber: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  timerUnit: { fontSize: 9, fontWeight: '700', color: Colors.primary, marginTop: -2 },
  coldChainBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(35, 134, 54, 0.08)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  coldChainText: { fontSize: 11, color: Colors.textPrimary },
  coldChainHighlight: { fontWeight: '700', color: Colors.primary },
  // Map Simulation
  mapCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.sm,
  },
  mapBg: {
    height: 175,
    backgroundColor: '#F3F4F6',
    position: 'relative',
    justifyContent: 'center',
  },
  routeLine: {
    position: 'absolute',
    left: 40, right: 40, top: 78,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  pinWrap: { position: 'absolute', alignItems: 'center' },
  pinBubble: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.md,
  },
  activePinBubble: { backgroundColor: Colors.primary },
  pinEmoji: { fontSize: 18 },
  pinLabel: { fontSize: 10, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  activeLabelBubble: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.full, marginTop: 4,
  },
  activePinText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  // Common Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  // Driver Row
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  driverAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  driverEmoji: { fontSize: 24 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary },
  driverVehicle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  ratingText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  driverActionBtns: { flexDirection: 'row', gap: 8 },
  callDriverBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  msgDriverBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  // Tip Section
  tipSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: 4,
    gap: 6,
  },
  tipTitle: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  tipChipsRow: { flexDirection: 'row', gap: Spacing.sm },
  tipChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tipChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tipChipText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  tipChipTextActive: { color: Colors.white },
  // Delivery Instructions
  instRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  instChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  instChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  instText: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  instTextActive: { color: Colors.white },
  // Timeline
  timelineList: { gap: 0, marginTop: 4 },
  timelineRow: { flexDirection: 'row', gap: Spacing.md },
  leftCol: { alignItems: 'center', width: 20 },
  dot: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.gray200,
    alignItems: 'center', justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.primary },
  dotActive: { backgroundColor: Colors.primary, borderWidth: 3, borderColor: Colors.primaryLight },
  innerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.white },
  line: { width: 2, flex: 1, backgroundColor: Colors.gray200, marginVertical: 4 },
  lineDone: { backgroundColor: Colors.primary },
  stepInfo: { flex: 1, paddingBottom: 16 },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  activeStepTitle: { color: Colors.primary, fontSize: 14 },
  stepTime: { fontSize: 10, color: Colors.textSecondary },
  stepDesc: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  // Items horizontal
  itemsList: { gap: Spacing.sm },
  itemChip: {
    width: 100,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemThumb: { width: 44, height: 44, borderRadius: BorderRadius.sm, marginBottom: 4 },
  itemName: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  itemPrice: { fontSize: 10, color: Colors.textSecondary },
  // Help Btn
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  helpText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
});
