/**
 * MandiKart — MKRow Component
 *
 * Production-grade horizontal row layout primitive.
 * Strictly enforces:
 * ROW: flexDirection: 'row', alignItems: 'center', width: '100%', minHeight: 60
 * LEFT ICON: flexShrink: 0
 * CONTENT: flex: 1, minWidth: 0 (text wraps/truncates safely, never pushes right action off-screen)
 * RIGHT ACTION: flexShrink: 0
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { MKColors } from '@/constants/colors';
import { MKLayout } from '@/constants/layout';

interface MKRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  rightAction?: React.ReactNode;
  rightText?: string;
  showChevron?: boolean;
  onPress?: () => void;
  isLast?: boolean;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  destructive?: boolean;
  accessibilityLabel?: string;
}

export const MKRow: React.FC<MKRowProps> = ({
  title,
  subtitle,
  icon,
  iconBgColor = '#EAF5EB',
  rightAction,
  rightText,
  showChevron = true,
  onPress,
  isLast = false,
  style,
  titleStyle,
  subtitleStyle,
  destructive = false,
  accessibilityLabel,
}) => {
  const content = (
    <View
      style={[
        styles.row,
        !isLast && styles.borderBottom,
        destructive && styles.destructiveRow,
        style,
      ]}
    >
      {/* 1. Left Icon Container (flexShrink: 0) */}
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
      )}

      {/* 2. Content Container (flex: 1, minWidth: 0) */}
      <View style={styles.contentContainer}>
        <Text
          numberOfLines={1}
          style={[styles.title, destructive && styles.destructiveText, titleStyle]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={[styles.subtitle, subtitleStyle]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* 3. Right Action (flexShrink: 0) */}
      <View style={styles.rightAction}>
        {rightAction ? (
          rightAction
        ) : rightText ? (
          <View style={styles.rightTextBadge}>
            <Text style={styles.rightText}>{rightText}</Text>
          </View>
        ) : null}
        {showChevron && !rightAction && (
          <ChevronRight size={18} color="#A0A5A3" style={styles.chevron} />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        android_ripple={{ color: '#E7F0E8' }}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  pressed: {
    backgroundColor: '#F4FAF5',
    opacity: 0.95,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: MKLayout.rowMinHeight,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEDE9',
  },
  destructiveRow: {
    backgroundColor: '#FFF7F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginRight: 14,
  },
  contentContainer: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: MKColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: MKColors.textSecondary,
    marginTop: 2,
  },
  destructiveText: {
    color: '#B84B4B',
  },
  rightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 8,
  },
  rightTextBadge: {
    backgroundColor: '#F1F3F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  rightText: {
    fontSize: 12,
    fontWeight: '700',
    color: MKColors.textMuted,
  },
  chevron: {
    marginLeft: 4,
  },
});
