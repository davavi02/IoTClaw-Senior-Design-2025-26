/**
 * Button Component
 * 
 * Reusable button component with consistent styling and behavior.
 * Supports different variants, sizes, and states for various use cases.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS, SIZES } from '../constants/theme';

interface ButtonProps {
  /** Button text content */
  title: string;
  /** Function to call when button is pressed */
  onPress: () => void;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  /** Size of the button */
  size?: 'sm' | 'base' | 'lg' | 'xl';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Icon to display before the text */
  icon?: string;
  /** Custom styles for the button container */
  style?: ViewStyle;
  /** Custom styles for the button text */
  textStyle?: TextStyle;
  /** Whether to show full width */
  fullWidth?: boolean;
}

/**
 * Versatile button component with multiple variants and states
 * Provides consistent styling and behavior across the app
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'base',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  // Get button styles based on variant and state
  const buttonStyle = [
    styles.button,
    styles[size],
    styles[variant],
    (disabled || loading) && styles.disabled,
    fullWidth && styles.fullWidth,
  ].filter(Boolean);

  // Get text styles based on variant and state
  const textStyle = [
    styles.text,
    styles[`${size}Text`],
    styles[`${variant}Text`],
    (disabled || loading) && styles.disabledText,
  ].filter(Boolean);

  // Get display text (show loading state if applicable)
  const displayText = loading ? 'Loading...' : title;

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={textStyle}>
        {displayText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Base button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    ...SHADOWS.base,
  },
  
  // Size variants
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: SIZES.button.sm,
  },
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: SIZES.button.base,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: SIZES.button.lg,
  },
  xl: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    minHeight: SIZES.button.xl,
  },
  
  // Variant styles
  primary: {
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.primary,
  },
  secondary: {
    backgroundColor: COLORS.backgroundMedium,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  
  // State styles
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  fullWidth: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontWeight: TYPOGRAPHY.extrabold,
    textAlign: 'center',
    letterSpacing: 1,
  },
  
  // Size-specific text styles
  smText: {
    fontSize: TYPOGRAPHY.sm,
  },
  baseText: {
    fontSize: TYPOGRAPHY.base,
  },
  lgText: {
    fontSize: TYPOGRAPHY.lg,
  },
  xlText: {
    fontSize: TYPOGRAPHY.xl,
  },
  
  // Variant-specific text styles
  primaryText: {
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
  outlineText: {
    color: COLORS.textSecondary,
  },
  dangerText: {
    color: COLORS.error,
  },
  disabledText: {
    opacity: 0.7,
  },
  
  // Icon styles
  icon: {
    fontSize: TYPOGRAPHY.lg,
    marginRight: 8,
  },
});
