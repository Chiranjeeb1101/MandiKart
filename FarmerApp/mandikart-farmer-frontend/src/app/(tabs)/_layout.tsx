/**
 * MandiKart Farmer App — Bottom Tabs Navigation Layout
 * 
 * Custom tactile 5-tab bar with light elevated surface,
 * active green indicator states, and crisp typography.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClipboardList, Home, Menu, Package, Store } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [styles.tabBar, { height: 64 + bottomInset, paddingBottom: bottomInset }],
        tabBarItemStyle: styles.tabItem,
        tabBarActiveTintColor: '#1B6D24',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Home size={21} color={focused ? '#1B6D24' : color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="produce"
        options={{
          title: 'Produce',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Package size={21} color={focused ? '#1B6D24' : color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Store size={21} color={focused ? '#1B6D24' : color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <ClipboardList size={21} color={focused ? '#1B6D24' : color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Menu size={21} color={focused ? '#1B6D24' : color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEAE0',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingTop: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    minWidth: 0,
    paddingHorizontal: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 30,
    borderRadius: 15,
  },
  iconWrapperActive: {
    backgroundColor: '#E8F5E9',
  },
});
