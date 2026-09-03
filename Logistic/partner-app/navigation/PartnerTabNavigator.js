import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT, RADIUS } from '../constants/theme';

import PartnerHomeScreen from '../screens/PartnerHomeScreen';
import PartnerDeliveriesScreen from '../screens/PartnerDeliveriesScreen';
import PartnerEarningsScreen from '../screens/PartnerEarningsScreen';
import PartnerRankingScreen from '../screens/PartnerRankingScreen';
import PartnerProfileScreen from '../screens/PartnerProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ iconFocused, iconOutline, focused, label }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconPill, focused && styles.iconPillActive]}>
        <Ionicons
          name={focused ? iconFocused : iconOutline}
          size={21}
          color={focused ? COLORS.primary : COLORS.onSurfaceVariant}
        />
      </View>
      <Text
        style={[styles.tabLabel, focused && styles.tabLabelActive]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function PartnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={PartnerHomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFocused="home"
              iconOutline="home-outline"
              focused={focused}
              label="Home"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Deliveries"
        component={PartnerDeliveriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFocused="cube"
              iconOutline="cube-outline"
              focused={focused}
              label="Deliveries"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Earnings"
        component={PartnerEarningsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFocused="wallet"
              iconOutline="wallet-outline"
              focused={focused}
              label="Earnings"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Ranking"
        component={PartnerRankingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFocused="trophy"
              iconOutline="trophy-outline"
              focused={focused}
              label="Ranking"
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={PartnerProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconFocused="person"
              iconOutline="person-outline"
              focused={focused}
              label="Profile"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: 76,
    paddingBottom: 6,
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 2,
    gap: 3,
  },
  iconPill: {
    width: 44,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPillActive: {
    backgroundColor: COLORS.primaryBg,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
