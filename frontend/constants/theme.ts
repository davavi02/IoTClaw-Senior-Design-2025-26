/**
 * Theme Constants for IoT Claw App
 * 
 * This file contains all the design tokens, colors, spacing, and typography
 * used throughout the application. Centralizing these values makes it easy
 * to maintain consistency and update the design system.
 */

// Color Palette - Dark theme optimized for gaming
export const COLORS = {
  // Primary colors
  primary: '#6366f1',        // Main brand color (indigo)
  primaryLight: '#8b5cf6',   // Lighter shade for borders/accents
  primaryDark: '#4f46e5',    // Darker shade for pressed states
  
  // Background colors
  background: '#0f0f23',     // Main dark background
  backgroundLight: 'rgba(255, 255, 255, 0.05)',  // Semi-transparent overlays
  backgroundMedium: 'rgba(255, 255, 255, 0.1)',  // Medium transparency
  backgroundCard: 'rgba(255, 255, 255, 0.08)',   // Card backgrounds
  
  // Text colors
  textPrimary: '#ffffff',    // Main text color
  textSecondary: '#a8b3ed',  // Secondary text (muted)
  textMuted: '#64748b',      // Very muted text
  
  // Status colors
  success: '#10b981',        // Green for success states
  error: '#ef4444',          // Red for errors
  warning: '#fbbf24',        // Yellow for warnings
  info: '#3b82f6',           // Blue for info
  
  // Border colors
  border: 'rgba(255, 255, 255, 0.2)',      // Standard borders
  borderLight: 'rgba(255, 255, 255, 0.1)', // Light borders
  borderMedium: 'rgba(255, 255, 255, 0.3)', // Medium borders
  
  // Shadow colors
  shadowPrimary: '#6366f1',  // Primary shadow color
  shadowDark: '#000000',     // Dark shadow
} as const;

// Typography Scale
export const TYPOGRAPHY = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 42,
  
  // Font weights
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
  
  // Line heights
  tight: 1.2,
  normalLineHeight: 1.5,
  relaxed: 1.75,
} as const;

// Spacing Scale (based on 4px grid)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 60,
  '6xl': 80,
} as const;

// Border Radius
export const RADIUS = {
  sm: 8,
  base: 12,
  md: 16,
  lg: 20,
  xl: 25,
  full: 9999,
} as const;

// Shadow Presets
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  primary: {
    shadowColor: COLORS.shadowPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1000,
} as const;

// Common Component Sizes
export const SIZES = {
  button: {
    sm: 40,
    base: 48,
    lg: 56,
    xl: 72,
  },
  icon: {
    sm: 16,
    base: 20,
    lg: 24,
    xl: 28,
    '2xl': 32,
  },
  input: {
    height: 48,
    padding: 16,
  },
} as const;
