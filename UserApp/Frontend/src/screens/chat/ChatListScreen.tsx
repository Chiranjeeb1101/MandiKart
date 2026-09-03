import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, StatusBar, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../../theme';

type ChatCategory = 'ALL' | 'FARMERS' | 'DELIVERY' | 'SUPPORT';

interface Conversation {
  id: string;
  name: string;
  role: 'Farmer' | 'Delivery Partner' | 'Support';
  subText: string;
  avatarEmoji: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  category: ChatCategory;
}

const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat-1',
    name: 'Rajan Kumar',
    role: 'Farmer',
    subText: 'Nashik Organic Farms',
    avatarEmoji: '🧑‍🌾',
    lastMessage: 'Yes, fresh tomatoes were harvested this morning at 6 AM!',
    timestamp: '10:45 AM',
    unreadCount: 2,
    isOnline: true,
    category: 'FARMERS',
  },
  {
    id: 'chat-2',
    name: 'Suresh Patil',
    role: 'Delivery Partner',
    subText: 'Eco EV Van (1.8 km away)',
    avatarEmoji: '👨‍✈️',
    lastMessage: 'I am near Goodluck Cafe, arriving in 5 mins.',
    timestamp: '10:30 AM',
    unreadCount: 1,
    isOnline: true,
    category: 'DELIVERY',
  },
  {
    id: 'chat-3',
    name: 'Priya Devi',
    role: 'Farmer',
    subText: 'Pune Valley Orchard',
    avatarEmoji: '👩‍🌾',
    lastMessage: 'Alphonso Mangoes are naturally ripened without carbide.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    category: 'FARMERS',
  },
  {
    id: 'chat-4',
    name: 'MandiKart Customer Support',
    role: 'Support',
    subText: '24x7 Help Center',
    avatarEmoji: '🎧',
    lastMessage: 'Your refund of ₹150 for Order #MK-984 has been processed.',
    timestamp: '2 Sep',
    unreadCount: 0,
    isOnline: true,
    category: 'SUPPORT',
  },
];

export default function ChatListScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState<ChatCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = SAMPLE_CONVERSATIONS.filter((chat) => {
    // Filter category
    if (activeCategory !== 'ALL' && chat.category !== activeCategory) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        chat.name.toLowerCase().includes(q) ||
        chat.lastMessage.toLowerCase().includes(q) ||
        chat.subText.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Messages & Support</Text>
          <Text style={styles.subtitle}>Direct connection with farmers & drivers</Text>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert('New Message', 'Select a farmer or delivery executive to start a conversation.')}
        >
          <Ionicons name="create-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages, farmers, or drivers..."
            placeholderTextColor={Colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Chips */}
        <View style={styles.categoryRow}>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'FARMERS', label: 'Farmers 🌾' },
            { key: 'DELIVERY', label: 'Delivery 🚚' },
            { key: 'SUPPORT', label: 'Support 🎧' },
          ].map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catChip, active && styles.catChipActive]}
                onPress={() => setActiveCategory(cat.key as ChatCategory)}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={48} color={Colors.textDisabled} />
            <Text style={styles.emptyTitle}>No Conversations Found</Text>
            <Text style={styles.emptySub}>No chats match your current filter.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatCard}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('Chat', {
                farmerName: item.name,
                farmerAvatar: item.avatarEmoji,
              })
            }
          >
            {/* Avatar Wrap */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarEmoji}>{item.avatarEmoji}</Text>
              </View>
              {item.isOnline && <View style={styles.onlineDot} />}
            </View>

            {/* Content */}
            <View style={styles.chatContent}>
              <View style={styles.topRow}>
                <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.timestamp, item.unreadCount > 0 && styles.timestampUnread]}>
                  {item.timestamp}
                </Text>
              </View>

              <Text style={styles.subText} numberOfLines={1}>{item.subText}</Text>

              <View style={styles.bottomRow}>
                <Text
                  style={[styles.lastMsg, item.unreadCount > 0 && styles.lastMsgUnread]}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>

                {item.unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backBtn: { padding: 4 },
  headerTextWrap: { flex: 1, marginLeft: Spacing.sm },
  title: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  // Search & Categories
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 42,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
    ...Shadows.sm,
  },
  searchInput: { flex: 1, fontSize: 13, color: Colors.textPrimary },
  categoryRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catText: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  catTextActive: { color: Colors.white },
  // List
  list: { padding: Spacing.md, gap: Spacing.sm },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 24 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  chatContent: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, flex: 1, marginRight: 8 },
  timestamp: { fontSize: 11, color: Colors.textDisabled },
  timestampUnread: { color: Colors.primary, fontWeight: '700' },
  subText: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  lastMsg: { fontSize: 13, color: Colors.textSecondary, flex: 1, marginRight: 8 },
  lastMsgUnread: { color: Colors.textPrimary, fontWeight: '700' },
  badge: {
    backgroundColor: Colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  // Empty
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  emptySub: { fontSize: 12, color: Colors.textSecondary },
});
