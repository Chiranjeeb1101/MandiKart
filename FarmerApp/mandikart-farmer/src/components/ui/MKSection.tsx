/**
 * MandiKart — MKSection Component
 *
 * Production-grade section layout wrapper.
 * Ensures consistent section spacing, aligned section titles,
 * and safe non-colliding action buttons ("View all", etc.).
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { MKColors } from '@/constants/colors';
import { MKLayout } from '@/constants/layout';

interface MKSectionProps {
  title?: string;
  actionText?: string;
  onActionPress?: () => void;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  gap?: number;
}

export const MKSection: React.FC<MKSectionProps> = ({
  title,
  actionText,
  onActionPress,
  rightElement,
  children,
  style,
  headerStyle,
  titleStyle,
  gap = 12,
}) => {
  const hasHeader = Boolean(title || actionText || rightElement);

  return (
    <View style={[styles.sectionContainer, style]}>
      {hasHeader && (
        <View style={[styles.headerRow, headerStyle]}>
          {title ? (
            <Text numberOfLines={1} style={[styles.title, titleStyle]}>
              {title}
            </Text>
          ) : (
            <View style={styles.spacer} />
          )}

          {rightElement ? (
            <View style={styles.actionWrapper}>{rightElement}</View>
          ) : actionText && onActionPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={actionText}
              hitSlop={8}
              style={({ pressed }) => [
                styles.actionWrapper,
                pressed && { opacity: 0.6, transform: [{ scale: 0.96 }] },
              ]}
              onPress={onActionPress}
            >
              <Text style={styles.actionText}>{actionText}</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      <View style={{ marginTop: hasHeader ? gap : 0, width: '100%' }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    marginBottom: MKLayout.sectionGap,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '700',
    color: MKColors.textPrimary,
    marginRight: 10,
  },
  spacer: {
    flex: 1,
  },
  actionWrapper: {
    flexShrink: 0,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: MKColors.primaryGreen,
  },
});
