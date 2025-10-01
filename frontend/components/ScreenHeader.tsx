/**
 * ScreenHeader Component
 * 
 * Reusable header component for screens with consistent styling,
 * animations, and layout. Provides a standardized way to display
 * screen titles and subtitles.
 */

import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants/theme';

interface ScreenHeaderProps {
  /** Main title text */
  title: string;
  /** Subtitle text (optional) */
  subtitle?: string;
  /** Animation values from useAnimations hook */
  animationStyle?: any;
  /** Custom container styles */
  style?: any;
}

/**
 * Standardized screen header with title, subtitle, and optional animations
 * Provides consistent spacing and typography across all screens
 */
export function ScreenHeader({
  title,
  subtitle,
  animationStyle,
  style,
}: ScreenHeaderProps) {
  const HeaderContent = (
    <View style={[styles.header, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );

  // Wrap with animation if animationStyle is provided
  if (animationStyle) {
    return (
      <Animated.View style={animationStyle}>
        {HeaderContent}
      </Animated.View>
    );
  }

  return HeaderContent;
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  
  // Title styles with gaming-appropriate typography
  title: {
    fontSize: TYPOGRAPHY['6xl'],
    fontWeight: TYPOGRAPHY.black,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  
  // Subtitle styles with secondary color
  subtitle: {
    fontSize: TYPOGRAPHY.xl,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.medium,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
