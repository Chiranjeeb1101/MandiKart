/**
 * MandiKart — MKInput Component
 * 
 * Accessible, touch-friendly input component with persistent labels,
 * prefix/suffix icons, focus states, and country code support.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface MKInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPhoneInput?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const MKInput: React.FC<MKInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPhoneInput = false,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
        ]}
      >
        {isPhoneInput && (
          <View style={styles.phonePrefix}>
            <Text style={styles.phonePrefixFlag}>🇮🇳</Text>
            <Text style={styles.phonePrefixText}>+91</Text>
            <View style={styles.prefixDivider} />
          </View>
        )}

        {leftIcon && !isPhoneInput && <View style={styles.iconWrapper}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#9AA0A6"
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2B2B',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: '#1E5A2A',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#D32F2F',
  },
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  phonePrefixFlag: {
    fontSize: 18,
    marginRight: 4,
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B2B2B',
    marginRight: 8,
  },
  prefixDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0DCD2',
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#1A1C1E',
    fontWeight: '500',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 4,
  },
});
