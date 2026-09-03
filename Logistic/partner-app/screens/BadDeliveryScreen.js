import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';

const BAD_DELIVERY_REASONS = [
  {
    id: 'DAMAGED_PRODUCE',
    title: 'Damaged / Spoiled Produce',
    desc: 'Rotten, overripe, crushed crates during transit or bad harvest',
    icon: 'fruit-cherries',
    color: COLORS.error,
    action: 'Partial or Full Return',
  },
  {
    id: 'RECEIVER_REJECTED',
    title: 'Mandi / Buyer Refused Acceptance',
    desc: 'Buyer rejected consignment due to quality dispute or rate mismatch',
    icon: 'close-circle-outline',
    color: '#d97706',
    action: 'Return Consignment to Farm',
  },
  {
    id: 'WEIGHT_MISMATCH',
    title: 'Weigh-Scale Discrepancy',
    desc: 'Weight on Mandi scale is significantly lower than farmer manifest',
    icon: 'scale-balance',
    color: '#2563eb',
    action: 'Record Verified Weight',
  },
  {
    id: 'FARMER_UNAVAILABLE',
    title: 'Farmer Unavailable / Produce Not Ready',
    desc: 'Waited at farm gate over 15 mins with no farmer contact',
    icon: 'account-alert-outline',
    color: '#7c3aed',
    action: 'Cancel Pickup with Wait Pay',
  },
  {
    id: 'VEHICLE_BREAKDOWN',
    title: 'Vehicle Breakdown / Road Blockage',
    desc: 'Flat tyre, EV battery drain, or severe monsoon road flooding',
    icon: 'truck-alert-outline',
    color: COLORS.error,
    action: 'Request Backup Logistics Rider',
  },
];

export default function BadDeliveryScreen({ navigation, route }) {
  const { activeDelivery, advanceDeliveryStep } = usePartner();

  const [selectedReason, setSelectedReason] = useState('DAMAGED_PRODUCE');
  const [damagedCrates, setDamagedCrates] = useState('2');
  const [acceptedCrates, setAcceptedCrates] = useState('4');
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [disputeNotes, setDisputeNotes] = useState('Top layer tomatoes crushed due to bumpy rural bypass road. Mandi inspector accepted 4 crates, rejected 2 crates.');
  const [returnTripRequested, setReturnTripRequested] = useState(true);
  const [resolutionModalVisible, setResolutionModalVisible] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleCapturePhoto = () => {
    Alert.alert('Camera', 'Photo proof of damaged produce captured and timestamped with GPS coordinates.');
    setPhotoUploaded(true);
  };

  const handleSubmitReport = () => {
    if (!disputeNotes.trim()) {
      Alert.alert('Details Required', 'Please provide a brief explanation of the delivery issue.');
      return;
    }

    const newTicketId = `DISPUTE-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(newTicketId);
    setResolutionModalVisible(true);
  };

  const handleFinishResolution = () => {
    setResolutionModalVisible(false);
    // Complete the bad delivery resolution
    advanceDeliveryStep();
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.error} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Report Bad Delivery / Issue</Text>
          <Text style={styles.headerSubtitle}>Order #{activeDelivery?.id || 'MK10284'} • Zero Driver Penalty</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Zero Penalty Driver Protection Banner */}
        <View style={styles.driverProtectionCard}>
          <View style={styles.shieldIconBg}>
            <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.protectionTitle}>Driver Payout 100% Protected</Text>
            <Text style={styles.protectionSubtitle}>
              MandiKart policy guarantees you receive your base delivery fare (₹{activeDelivery?.payout || 95}) plus return trip compensation if produce is damaged or rejected.
            </Text>
          </View>
        </View>

        {/* 1. Reason Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select Delivery Issue Reason</Text>
          <Text style={styles.sectionSubtitle}>Choose what went wrong during pickup or delivery</Text>

          <View style={styles.reasonsList}>
            {BAD_DELIVERY_REASONS.map(reason => {
              const isSelected = selectedReason === reason.id;
              return (
                <TouchableOpacity
                  key={reason.id}
                  style={[styles.reasonItem, isSelected && styles.reasonItemSelected]}
                  onPress={() => setSelectedReason(reason.id)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.reasonIconBg, { backgroundColor: isSelected ? COLORS.errorLight : COLORS.surfaceContainerLow }]}>
                    <MaterialCommunityIcons name={reason.icon} size={22} color={isSelected ? COLORS.error : COLORS.onSurfaceVariant} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.reasonTitle, isSelected && styles.reasonTitleSelected]}>
                      {reason.title}
                    </Text>
                    <Text style={styles.reasonDesc}>{reason.desc}</Text>
                    <View style={styles.actionTag}>
                      <Text style={styles.actionTagText}>Recommended: {reason.action}</Text>
                    </View>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Crates Breakdown (Salvaged vs Rejected) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Crates Count Breakdown</Text>
          <Text style={styles.sectionSubtitle}>Specify how many crates were accepted vs rejected</Text>

          <View style={styles.crateInputsRow}>
            <View style={styles.crateInputBox}>
              <Text style={styles.crateBoxLabel}>❌ Damaged / Rejected</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setDamagedCrates(prev => Math.max(0, parseInt(prev || 0) - 1).toString())}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.counterInput}
                  keyboardType="number-pad"
                  value={damagedCrates}
                  onChangeText={setDamagedCrates}
                />
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setDamagedCrates(prev => (parseInt(prev || 0) + 1).toString())}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.crateWeightMeta}>~40 kg rejected</Text>
            </View>

            <View style={styles.crateInputBox}>
              <Text style={styles.crateBoxLabel}>✅ Accepted by Mandi</Text>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setAcceptedCrates(prev => Math.max(0, parseInt(prev || 0) - 1).toString())}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.counterInput}
                  keyboardType="number-pad"
                  value={acceptedCrates}
                  onChangeText={setAcceptedCrates}
                />
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => setAcceptedCrates(prev => (parseInt(prev || 0) + 1).toString())}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.crateWeightMeta}>~80 kg accepted</Text>
            </View>
          </View>
        </View>

        {/* 3. Photo Evidence */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Photo Proof of Damaged Produce</Text>
          <Text style={styles.sectionSubtitle}>Mandatory for insurance claim & driver zero-penalty</Text>

          {photoUploaded ? (
            <View style={styles.photoProofContainer}>
              <MaterialCommunityIcons name="camera-metering-center" size={32} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.photoProofTitle}>✅ Evidence Image Attached</Text>
                <Text style={styles.photoProofMeta}>GPS: 20.2961° N, 85.8245° E • 11:42 AM</Text>
              </View>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleCapturePhoto}
              >
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.cameraBox}
              onPress={handleCapturePhoto}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={32} color={COLORS.error} />
              <Text style={styles.cameraText}>Tap to Capture Damaged Crates</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 4. Reverse Logistics / Return Compensation */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Return Logistics Trip</Text>
          <TouchableOpacity
            style={styles.returnToggleRow}
            onPress={() => setReturnTripRequested(!returnTripRequested)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, returnTripRequested && styles.checkboxActive]}>
              {returnTripRequested && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.returnToggleTitle}>Return rejected crates back to Farmer Ramesh</Text>
              <Text style={styles.returnToggleSubtitle}>
                Includes return trip fuel subsidy: <Text style={{ color: COLORS.success, fontWeight: '800' }}>+₹70 extra pay</Text>
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 5. Dispute Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Inspector / Driver Remarks</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Explain what happened..."
            value={disputeNotes}
            onChangeText={setDisputeNotes}
          />
        </View>

        {/* Emergency Dispatch Hotline Button */}
        <TouchableOpacity
          style={styles.dispatcherHelpBtn}
          onPress={() => Alert.alert('Dispatcher Escalation', 'Connecting to Senior Mandi Dispute Officer (+91 94371 99001)...')}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={18} color={COLORS.primary} />
          <Text style={styles.dispatcherHelpText}>Speak to Dispute Manager on Call</Text>
        </TouchableOpacity>

        {/* Submit Report CTA */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmitReport}
          activeOpacity={0.85}
        >
          <Ionicons name="alert-circle" size={20} color={COLORS.white} />
          <Text style={styles.submitBtnText}>Submit Bad Delivery Report & Claim</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Resolution Confirmation Modal */}
      <Modal
        visible={resolutionModalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBg}>
              <Ionicons name="shield-checkmark" size={48} color={COLORS.success} />
            </View>

            <Text style={styles.modalTitle}>Issue Report Logged ✅</Text>
            <Text style={styles.modalTicketId}>{ticketId}</Text>
            <Text style={styles.modalMessage}>
              Your report has been verified by the automated Mandi exception desk.
            </Text>

            <View style={styles.payoutSummaryBox}>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLabel}>Original Trip Fare</Text>
                <Text style={styles.summaryValue}>₹{activeDelivery?.payout || 95}</Text>
              </View>
              {returnTripRequested && (
                <View style={styles.summaryLine}>
                  <Text style={styles.summaryLabel}>Return Trip Compensation</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.success }]}>+₹70</Text>
                </View>
              )}
              <View style={[styles.summaryLine, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 6 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: '800' }]}>Total Credit to Account</Text>
                <Text style={[styles.summaryValue, { fontWeight: '900', color: COLORS.primary }]}>
                  ₹{(activeDelivery?.payout || 95) + (returnTripRequested ? 70 : 0)}
                </Text>
              </View>
            </View>

            <View style={styles.modalNotice}>
              <Ionicons name="information-circle" size={16} color={COLORS.primary} />
              <Text style={styles.modalNoticeText}>
                No penalty will be deducted from your partner rating or account.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalDoneBtn}
              onPress={handleFinishResolution}
              activeOpacity={0.85}
            >
              <Text style={styles.modalDoneBtnText}>Complete & Return to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.error,
  },
  headerSubtitle: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.md,
  },
  driverProtectionCard: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  shieldIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  protectionTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
  protectionSubtitle: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  sectionSubtitle: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginBottom: SPACING.xs,
  },
  reasonsList: {
    gap: SPACING.xs,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceContainerLow,
    gap: SPACING.sm,
  },
  reasonItemSelected: {
    borderColor: COLORS.error,
    backgroundColor: '#fff5f5',
  },
  reasonIconBg: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonTitle: {
    fontSize: FONT.base,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  reasonTitleSelected: {
    color: COLORS.error,
    fontWeight: '800',
  },
  reasonDesc: {
    fontSize: 11,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  actionTag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    marginTop: 4,
  },
  actionTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.error,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.error,
  },
  crateInputsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  crateInputBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceContainerLow,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  crateBoxLabel: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginVertical: 4,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  counterInput: {
    fontSize: FONT.xl,
    fontWeight: '900',
    color: COLORS.onSurface,
    textAlign: 'center',
    width: 36,
  },
  crateWeightMeta: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
  photoProofContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    gap: SPACING.md,
  },
  photoProofTitle: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.primary,
  },
  photoProofMeta: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  retakeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  retakeText: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  cameraBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.error,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    backgroundColor: '#fff8f8',
    gap: SPACING.xs,
  },
  cameraText: {
    fontSize: FONT.sm,
    fontWeight: '800',
    color: COLORS.error,
  },
  returnToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  returnToggleTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  returnToggleSubtitle: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginTop: 2,
  },
  notesInput: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT.sm,
    color: COLORS.onSurface,
    height: 70,
    textAlignVertical: 'top',
  },
  dispatcherHelpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceContainerLow,
    height: 48,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dispatcherHelpText: {
    fontSize: FONT.sm,
    fontWeight: '800',
    color: COLORS.primary,
  },
  submitBtn: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: FONT.md,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    gap: SPACING.xs,
  },
  modalIconBg: {
    marginBottom: SPACING.xs,
  },
  modalTitle: {
    fontSize: FONT.xl,
    fontWeight: '900',
    color: COLORS.onSurface,
  },
  modalTicketId: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  modalMessage: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    marginVertical: 4,
  },
  payoutSummaryBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
    gap: 6,
    marginVertical: SPACING.sm,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
  },
  summaryValue: {
    fontSize: FONT.xs,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  modalNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  modalNoticeText: {
    fontSize: 10,
    color: COLORS.primary,
    flex: 1,
  },
  modalDoneBtn: {
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: SPACING.sm,
  },
  modalDoneBtnText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: '800',
  },
});
