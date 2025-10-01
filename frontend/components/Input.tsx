/**
 * Input Component
 * 
 * Reusable input component with consistent styling, validation states,
 * and accessibility features. Supports different input types and states.
 */

import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Custom container styles */
  containerStyle?: any;
  /** Custom input styles */
  inputStyle?: any;
}

/**
 * Styled input component with label, error handling, and consistent theming
 * Provides better UX with clear visual feedback for different states
 */
export function Input({
  label,
  error,
  required = false,
  containerStyle,
  inputStyle,
  ...textInputProps
}: InputProps) {
  // Determine input styles based on error state
  const getInputStyles = () => {
    const baseStyles = [styles.input];
    
    if (error) {
      baseStyles.push(styles.inputError);
    }
    
    return baseStyles;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      {/* Input Field */}
      <TextInput
        style={[...getInputStyles(), inputStyle]}
        placeholderTextColor={COLORS.textSecondary}
        {...textInputProps}
      />
      
      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  // Label styles
  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  required: {
    color: COLORS.error,
  },
  
  // Input field styles
  input: {
    backgroundColor: COLORS.backgroundMedium,
    borderRadius: RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SIZES.input.padding,
    paddingHorizontal: SIZES.input.padding,
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    minHeight: SIZES.input.height,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  
  // Error message styles
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: RADIUS.base,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.sm,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.semibold,
  },
});
