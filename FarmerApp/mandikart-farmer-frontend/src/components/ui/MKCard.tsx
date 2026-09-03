/**
 * MandiKart — MKCard Component
 * 
 * Crisp white container with generous rounded corners (16-20px)
 * and soft multi-layered elevation shadows.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Pressable } from 'react-native';

interface MKCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outline' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const MKCard: React.FC<MKCardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return 12;
      case 'md':
        return 16;
      case 'lg':
        return 20;
    }
  };

  const cardStyle: ViewStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: getPadding(),
    ...(variant === 'elevated' || variant === 'interactive'
      ? {
          shadowColor: '#1A1C1E',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.09,
          shadowRadius: 12,
          elevation: 4,
          borderWidth: 1.2,
          borderColor: '#E5DFD5',
        }
      : variant === 'outline'
      ? {
          borderWidth: 1.5,
          borderColor: '#DDD6CA',
        }
      : {
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#EAE5DB',
        }),
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && { opacity: 0.92, transform: [{ scale: 0.97 }], elevation: 1 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
