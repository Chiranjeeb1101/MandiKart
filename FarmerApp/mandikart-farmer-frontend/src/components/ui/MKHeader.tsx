/**
 * MandiKart — MKHeader Component
 * 
 * Top bar with back navigation, step indicator pills, title, and actions.
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface MKHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  step?: { current: number; total: number; label?: string };
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const MKHeader: React.FC<MKHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  step,
  rightAction,
  style,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topRow}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={22} color="#2B2B2B" strokeWidth={2.2} />
          </Pressable>
        ) : (
          <View style={styles.placeholder} />
        )}

        {step && (
          <View style={styles.stepContainer}>
            <View style={styles.stepPill}>
              <Text style={styles.stepText}>
                Step {step.current} of {step.total}
              </Text>
            </View>
            {step.label && <Text style={styles.stepLabel}>{step.label}</Text>}
          </View>
        )}

        {rightAction ? (
          <View style={styles.rightActionWrapper}>{rightAction}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFEBE2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  placeholder: {
    width: 42,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepPill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E5A2A',
  },
  stepLabel: {
    fontSize: 11,
    color: '#5F6368',
    marginTop: 2,
    fontWeight: '500',
  },
  rightActionWrapper: {
    minWidth: 42,
    alignItems: 'flex-end',
  },
  titleContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C1E',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
    lineHeight: 20,
  },
});
