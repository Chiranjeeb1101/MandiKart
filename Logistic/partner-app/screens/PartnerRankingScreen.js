import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';
import { usePartner } from '../context/PartnerContext';
import PartnerHeader from '../components/PartnerHeader';

export default function PartnerRankingScreen({ navigation }) {
  const { leaderboard } = usePartner();

  return (
    <SafeAreaView style={styles.container}>
      <PartnerHeader
        title="Daily Delivery Ranking"
        subtitle="Bhubaneswar Hub Leaderboard"
        navigation={navigation}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top 3 Podium Cards */}
        <View style={styles.podiumContainer}>
          {/* Rank 2 */}
          <View style={[styles.podiumCol, styles.podiumCol2]}>
            <Text style={styles.podiumMedal}>🥈</Text>
            <View style={styles.podiumAvatar}>
              <Text style={styles.avatarLetter}>S</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[1].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{leaderboard[1].deliveries} Trips</Text>
            <View style={styles.podiumBlock2}>
              <Text style={styles.podiumRankText}>2</Text>
            </View>
          </View>

          {/* Rank 1 (Tallest) */}
          <View style={[styles.podiumCol, styles.podiumCol1]}>
            <Text style={styles.podiumCrown}>👑</Text>
            <Text style={styles.podiumMedal}>🥇</Text>
            <View style={[styles.podiumAvatar, styles.podiumAvatarGold]}>
              <Text style={[styles.avatarLetter, { color: COLORS.white }]}>A</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[0].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScoreGold}>{leaderboard[0].deliveries} Trips</Text>
            <View style={styles.podiumBlock1}>
              <Text style={styles.podiumRankText}>1</Text>
            </View>
          </View>

          {/* Rank 3 */}
          <View style={[styles.podiumCol, styles.podiumCol3]}>
            <Text style={styles.podiumMedal}>🥉</Text>
            <View style={styles.podiumAvatar}>
              <Text style={styles.avatarLetter}>R</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{leaderboard[2].name.split(' ')[0]}</Text>
            <Text style={styles.podiumScore}>{leaderboard[2].deliveries} Trips</Text>
            <View style={styles.podiumBlock3}>
              <Text style={styles.podiumRankText}>3</Text>
            </View>
          </View>
        </View>

        {/* Milestone Booster Card */}
        <View style={styles.boosterCard}>
          <View style={styles.boosterTop}>
            <Ionicons name="flash" size={22} color={COLORS.accentDark} />
            <Text style={styles.boosterTitle}>You are only 6 trips away from Top 3!</Text>
          </View>
          <Text style={styles.boosterDesc}>
            Partners in Top 3 receive an instant ₹250 Daily Champion Bonus credited at midnight.
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>18 / 24 deliveries to break into Top 3</Text>
        </View>

        {/* Full Leaderboard List */}
        <Text style={styles.listHeading}>Full Hub Standings</Text>
        <View style={styles.leaderboardList}>
          {leaderboard.map(item => (
            <View
              key={item.rank}
              style={[
                styles.rankItem,
                item.isCurrent && styles.currentPartnerItem,
              ]}
            >
              <View style={styles.rankBadge}>
                <Text style={[styles.rankNumber, item.isCurrent && styles.rankNumberCurrent]}>
                  #{item.rank}
                </Text>
              </View>

              <View style={styles.partnerInfo}>
                <Text style={[styles.partnerName, item.isCurrent && styles.partnerNameCurrent]}>
                  {item.name}
                </Text>
                <Text style={styles.partnerCity}>{item.city} • {item.badge}</Text>
              </View>

              <View style={styles.statsRight}>
                <Text style={styles.deliveriesCount}>{item.deliveries} trips</Text>
                <Text style={styles.earningsAmount}>₹{item.earnings}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.lg,
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: SPACING.lg,
    gap: SPACING.xs,
  },
  podiumCol: {
    flex: 1,
    alignItems: 'center',
  },
  podiumCol1: {
    zIndex: 3,
  },
  podiumCol2: {
    zIndex: 2,
  },
  podiumCol3: {
    zIndex: 1,
  },
  podiumCrown: {
    fontSize: 20,
    marginBottom: -4,
  },
  podiumMedal: {
    fontSize: 22,
    marginBottom: 4,
  },
  podiumAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  podiumAvatarGold: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    borderColor: COLORS.accent,
  },
  avatarLetter: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
  podiumName: {
    fontSize: FONT.xs,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  podiumScore: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
    marginBottom: 6,
  },
  podiumScoreGold: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 6,
  },
  podiumBlock1: {
    width: '100%',
    height: 90,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumBlock2: {
    width: '100%',
    height: 65,
    backgroundColor: COLORS.primaryContainer,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumBlock3: {
    width: '100%',
    height: 48,
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  podiumRankText: {
    fontSize: FONT.xxl,
    fontWeight: '900',
    color: COLORS.white,
  },
  boosterCard: {
    backgroundColor: COLORS.accentLight,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    gap: SPACING.xs,
  },
  boosterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  boosterTitle: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.accentDark,
    flex: 1,
  },
  boosterDesc: {
    fontSize: FONT.xs,
    color: COLORS.accentDark,
    lineHeight: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: RADIUS.pill,
    marginTop: SPACING.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accentDark,
    borderRadius: RADIUS.pill,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accentDark,
    marginTop: 2,
  },
  listHeading: {
    fontSize: FONT.lg,
    fontWeight: '800',
    color: COLORS.onSurface,
  },
  leaderboardList: {
    gap: SPACING.sm,
  },
  rankItem: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  currentPartnerItem: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  rankBadge: {
    width: 36,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.onSurfaceVariant,
  },
  rankNumberCurrent: {
    color: COLORS.primary,
    fontSize: FONT.lg,
    fontWeight: '900',
  },
  partnerInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  partnerName: {
    fontSize: FONT.base,
    fontWeight: '700',
    color: COLORS.onSurface,
  },
  partnerNameCurrent: {
    color: COLORS.primary,
    fontWeight: '900',
  },
  partnerCity: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    marginTop: 1,
  },
  statsRight: {
    alignItems: 'flex-end',
  },
  deliveriesCount: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    fontWeight: '600',
  },
  earningsAmount: {
    fontSize: FONT.base,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
