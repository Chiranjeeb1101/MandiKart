/**
 * MandiKart — MKScreen Component
 *
 * Production-grade responsive screen wrapper.
 * Ensures:
 * - 100% full-width flex layout (no horizontal collapsing)
 * - Safe area handling
 * - Automatic bottom navigation clearance (ScrollView content padding)
 * - Organic MandiKart ambient background
 */

import React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MKBackground } from './MKBackground';
import { MKLayout } from '@/constants/layout';

interface MKScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  header?: React.ReactNode;
  bottomClearanceExtra?: number;
  showsVerticalScrollIndicator?: boolean;
}

export const MKScreen: React.FC<MKScreenProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  header,
  bottomClearanceExtra = 0,
  showsVerticalScrollIndicator = false,
}) => {
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(insets.top + 22, 58);
  const bottomPadding = Math.max(
    insets.bottom + MKLayout.bottomTabHeight + MKLayout.bottomContentClearance + bottomClearanceExtra,
    110
  );

  return (
    <MKBackground disableSafeArea style={styles.background}>
      <View style={[styles.screenContainer, style]}>
        {header && <View style={styles.headerContainer}>{header}</View>}
        {scrollable ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: header ? 12 : topPadding, paddingBottom: bottomPadding },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View
            style={[
              styles.fixedContent,
              { paddingTop: header ? 12 : topPadding, paddingBottom: bottomPadding },
              contentContainerStyle,
            ]}
          >
            {children}
          </View>
        )}
      </View>
    </MKBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  screenContainer: {
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: MKLayout.screenPaddingHorizontal,
    width: '100%',
  },
  fixedContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: MKLayout.screenPaddingHorizontal,
  },
});
