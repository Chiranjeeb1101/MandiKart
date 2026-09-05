import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius } from '../../theme';
import { apiClient } from '../../services/apiClient';
import { ChatMessage, NegotiationOffer } from '../../types';

const CURRENT_USER_ID = 'user-1';

const INITIAL_MESSAGES_WITH_NEGOTIATION: ChatMessage[] = [
  {
    id: 'cm-1',
    senderId: 'farmer-1',
    text: 'Namaste! Welcome to Nashik Fresh Farms. All our produce is harvest-fresh.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 'cm-2',
    senderId: CURRENT_USER_ID,
    text: 'Hello, looking for Grade A produce with verified APMC purity.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isRead: true,
    type: 'text',
  },
  {
    id: 'cm-neg-1',
    senderId: 'farmer-1',
    text: 'Counter-Offer: I can supply Grade A Red Onion lot at ₹24.50/kg for your 200kg requirement.',
    timestamp: new Date().toISOString(),
    isRead: true,
    type: 'negotiation',
    negotiationRef: {
      id: 'neg_101',
      productId: 'prod_1',
      cropName: 'Red Onion (Grade A)',
      farmerId: 'farmer-1',
      farmerName: 'Rajan Kumar',
      buyerId: 'buyer_default_01',
      originalPrice: 26.5,
      offeredPrice: 24.0,
      counterPrice: 24.5,
      quantity: 200,
      unit: 'kg',
      status: 'COUNTER_OFFERED',
      remarks: 'Direct farm lot reservation.',
    },
  },
];

export default function ChatScreen({ navigation, route }: any) {
  const { farmerName } = route?.params ?? { farmerName: 'Rajan Kumar' };

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES_WITH_NEGOTIATION);
  const [text, setText] = useState('');
  const flatRef = useRef<FlatList>(null);

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newMsg: ChatMessage = {
      id: `cm-${Date.now()}`,
      senderId: CURRENT_USER_ID,
      text: trimmed,
      timestamp: new Date().toISOString(),
      isRead: false,
      type: 'text',
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleAcceptNegotiation = async (neg: NegotiationOffer) => {
    try {
      await apiClient.negotiations.respond(neg.id, 'ACCEPT');

      setMessages((prev) =>
        prev.map((m) =>
          m.negotiationRef?.id === neg.id
            ? {
                ...m,
                negotiationRef: { ...m.negotiationRef, status: 'ACCEPTED' },
              }
            : m
        )
      );

      // Navigate to intermediate CheckoutReview screen (Order Summary & Address verification)
      navigation.navigate('CheckoutStack', {
        screen: 'CheckoutReview',
        params: {
          isNegotiated: true,
          negotiation: neg,
        },
      });
    } catch (err: any) {
      console.warn('Accept negotiation error:', err);
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === CURRENT_USER_ID;

    // Render Negotiation Card
    if (item.type === 'negotiation' && item.negotiationRef) {
      const neg = item.negotiationRef;
      const isAccepted = neg.status === 'ACCEPTED' || neg.status === 'ORDERED';
      const isCounter = neg.status === 'COUNTER_OFFERED';
      const lotTotal = (neg.counterPrice || neg.offeredPrice) * neg.quantity;

      return (
        <View style={styles.negCardWrap}>
          <View style={styles.negCard}>
            <View style={styles.negHeader}>
              <Ionicons name="pricetags" size={18} color={Colors.primary} />
              <Text style={styles.negTitle}>FARM DIRECT PRICE COUNTER-OFFER</Text>
            </View>
            <Text style={styles.negCropName}>{neg.cropName}</Text>
            <Text style={styles.negLotInfo}>
              Volume: {neg.quantity} {neg.unit} • Listed: ₹{neg.originalPrice}/{neg.unit}
            </Text>

            <View style={styles.priceCompareBox}>
              <View style={styles.priceCol}>
                <Text style={styles.priceSubLabel}>Your Offer</Text>
                <Text style={styles.buyerPrice}>₹{neg.offeredPrice}/{neg.unit}</Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={Colors.textDisabled} />
              <View style={styles.priceCol}>
                <Text style={styles.priceSubLabel}>Farmer Counter</Text>
                <Text style={styles.counterPrice}>₹{neg.counterPrice || neg.offeredPrice}/{neg.unit}</Text>
              </View>
            </View>

            <View style={styles.lotTotalRow}>
              <Text style={styles.lotTotalLabel}>Total Agreed Deal Value:</Text>
              <Text style={styles.lotTotalValue}>₹{lotTotal.toLocaleString('en-IN')}</Text>
            </View>

            {isCounter && (
              <View style={styles.negActions}>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => apiClient.negotiations.respond(neg.id, 'REJECT')}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptNegotiation(neg)}
                >
                  <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
                  <Text style={styles.acceptBtnText}>Accept & Order</Text>
                </TouchableOpacity>
              </View>
            )}

            {isAccepted && (
              <View style={styles.acceptedBadge}>
                <Ionicons name="shield-checkmark" size={16} color="#15803D" />
                <Text style={styles.acceptedBadgeText}>Deal Accepted • Order Created</Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isMine && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{farmerName?.charAt(0) ?? 'F'}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
            {item.text}
          </Text>
          <Text style={[styles.bubbleTime, isMine ? styles.bubbleTimeMine : styles.bubbleTimeTheirs]}>
            {formatTime(item.timestamp)}
            {isMine && (
              <Ionicons
                name={item.isRead ? 'checkmark-done' : 'checkmark'}
                size={12}
                color={item.isRead ? Colors.primary : 'rgba(255,255,255,0.7)'}
              />
            )}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{farmerName?.charAt(0) ?? 'F'}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{farmerName}</Text>
            <Text style={styles.headerStatus}>🟢 Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.msgList}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.dateChip}>
              <Text style={styles.dateChipText}>June 15, 2024</Text>
            </View>
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textDisabled}
            multiline
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[styles.sendBtn, !text.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!text.trim()}
          >
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  backBtn: { marginRight: Spacing.sm },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  headerName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  headerStatus: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  callBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  msgList: { padding: Spacing.md, gap: Spacing.md },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  dateChipText: { fontSize: 11, color: Colors.textSecondary },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowLeft: { justifyContent: 'flex-start' },
  msgRowRight: { justifyContent: 'flex-end' },
  avatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 18, gap: 4,
  },
  bubbleMine: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleTheirs: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMine: { color: Colors.white },
  bubbleTextTheirs: { color: Colors.textPrimary },
  bubbleTime: { fontSize: 10, flexDirection: 'row', alignItems: 'center' },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.75)', textAlign: 'right' },
  bubbleTimeTheirs: { color: Colors.textDisabled },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: 'rgba(255,255,255,0.95)',
    gap: Spacing.sm,
  },
  attachBtn: { paddingBottom: 4 },
  input: {
    flex: 1,
    minHeight: 40, maxHeight: 120,
    backgroundColor: Colors.gray50,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: 8,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.gray200 },
  negCardWrap: {
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  negCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: Spacing.md,
    gap: 6,
  },
  negHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  negTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  negCropName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  negLotInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceCompareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    marginVertical: 4,
  },
  priceCol: {
    alignItems: 'center',
  },
  priceSubLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  buyerPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  counterPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  lotTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  lotTotalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  lotTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803D',
  },
  negActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 4,
  },
  declineBtn: {
    flex: 1,
    height: 38,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  acceptBtn: {
    flex: 2,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  acceptedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
