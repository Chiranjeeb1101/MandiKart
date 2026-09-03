import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT } from '../constants/theme';

export default function DeliveryStepper({ currentStep = 1 }) {
  // Steps: 0 = Pickup, 1 = In Transit, 2 = Delivered
  const steps = [
    { label: 'Farm Pickup', icon: 'leaf-outline' },
    { label: 'In Transit', icon: 'bicycle-outline' },
    { label: 'Mandi Drop', icon: 'checkmark-done' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <React.Fragment key={step.label}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.circleCompleted,
                    isCurrent && styles.circleCurrent,
                    isPending && styles.circlePending,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={COLORS.white} />
                  ) : (
                    <Ionicons
                      name={step.icon}
                      size={14}
                      color={isCurrent ? COLORS.accentDark : COLORS.onSurfaceVariant}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    (isCompleted || isCurrent) && styles.stepLabelActive,
                  ]}
                >
                  {step.label}
                </Text>
              </View>

              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentStep ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.sm,
    width: '100%',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 2,
    flex: 1,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
  },
  circleCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  circleCurrent: {
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.accent,
  },
  circlePending: {
    backgroundColor: COLORS.surfaceContainerHighest,
    borderColor: COLORS.outlineVariant,
  },
  stepLabel: {
    fontSize: FONT.xs,
    color: COLORS.onSurfaceVariant,
    fontWeight: '500',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  line: {
    flex: 1,
    height: 3,
    position: 'relative',
    top: -12,
    zIndex: 1,
    marginHorizontal: -4,
  },
  lineActive: {
    backgroundColor: COLORS.primary,
  },
  lineInactive: {
    backgroundColor: COLORS.surfaceContainerHighest,
  },
});
