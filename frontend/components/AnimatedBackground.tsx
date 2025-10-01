/**
 * AnimatedBackground Component
 * 
 * Reusable component that provides animated background elements
 * for screens. This eliminates code duplication and provides
 * consistent visual effects across the app.
 */

import React from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  /** Animation values from useAnimations hook */
  animations: {
    circle1: any;
    circle2: any;
    circle3: any;
    floating: any;
  };
  /** Whether to show floating game elements */
  showFloatingElements?: boolean;
}

/**
 * Animated background with floating circles and game elements
 * Provides visual depth and engagement without being distracting
 */
export function AnimatedBackground({ 
  animations, 
  showFloatingElements = true 
}: AnimatedBackgroundProps) {
  return (
    <>
      {/* Animated Background Circles */}
      <Animated.View 
        style={[
          styles.backgroundCircle1,
          animations.circle1,
        ]}
      />
      
      <Animated.View 
        style={[
          styles.backgroundCircle2,
          animations.circle2,
        ]}
      />
      
      <Animated.View 
        style={[
          styles.backgroundCircle3,
          animations.circle3,
        ]}
      />

      {/* Floating Game Elements */}
      {showFloatingElements && (
        <Animated.View 
          style={[
            styles.floatingElement,
            animations.floating,
          ]}
        >
          <Text style={styles.floatingText}>🎮</Text>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Background circle styles with consistent sizing and colors
  backgroundCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(99, 102, 241, 0.15)', // Primary color with transparency
    top: 100,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 92, 246, 0.1)', // Primary light with transparency
    top: 200,
  },
  backgroundCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(168, 179, 237, 0.08)', // Secondary color with transparency
    top: 300,
  },
  
  // Floating element for visual interest
  floatingElement: {
    position: 'absolute',
    top: height * 0.2,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingText: {
    fontSize: 24,
  },
});
