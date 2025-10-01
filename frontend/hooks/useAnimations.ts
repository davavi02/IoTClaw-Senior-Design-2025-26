/**
 * Custom Hook for Common Animations
 * 
 * This hook provides reusable animation logic that was previously duplicated
 * across multiple screens. It handles entrance animations, background effects,
 * and cleanup automatically.
 */

import { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';
import { ANIMATION } from '../constants/theme';

const { width, height } = Dimensions.get('window');

/**
 * Hook that provides common animation values and effects
 * @param options Configuration for which animations to enable
 */
export function useAnimations(options: {
  entrance?: boolean;      // Fade in and slide up animation
  background?: boolean;    // Floating background circles
  pulse?: boolean;         // Pulsing effect for interactive elements
} = {}) {
  // Animation values for entrance effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Animation values for background effects
  const backgroundAnim1 = useRef(new Animated.Value(0)).current;
  const backgroundAnim2 = useRef(new Animated.Value(0)).current;
  const backgroundAnim3 = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  
  // Animation value for pulse effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animations: Animated.CompositeAnimation[] = [];
    const cleanupFunctions: (() => void)[] = [];

    // Entrance animations (fade in, slide up, scale)
    if (options.entrance) {
      const entranceAnimation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION.slower,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION.slower,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: ANIMATION.slower,
          useNativeDriver: true,
        }),
      ]);
      animations.push(entranceAnimation);
    }

    // Pulse animation for interactive elements
    if (options.pulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: ANIMATION.slowest,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: ANIMATION.slowest,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      cleanupFunctions.push(() => pulseAnimation.stop());
    }

    // Background floating animations
    if (options.background) {
      // First background circle animation
      const backgroundAnimation1 = Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundAnim1, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim1, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      // Second background circle animation
      const backgroundAnimation2 = Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundAnim2, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim2, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );

      // Third background circle animation
      const backgroundAnimation3 = Animated.loop(
        Animated.sequence([
          Animated.timing(backgroundAnim3, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundAnim3, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      );

      // Floating element animation
      const floatingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ])
      );

      // Start all background animations
      backgroundAnimation1.start();
      backgroundAnimation2.start();
      backgroundAnimation3.start();
      floatingAnimation.start();

      // Add cleanup functions
      cleanupFunctions.push(
        () => backgroundAnimation1.stop(),
        () => backgroundAnimation2.stop(),
        () => backgroundAnimation3.stop(),
        () => floatingAnimation.stop()
      );
    }

    // Start entrance animations
    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }

    // Cleanup function
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [options.entrance, options.background, options.pulse]);

  // Return animation values and interpolated styles
  return {
    // Entrance animation values
    entrance: {
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ]
    },
    
    // Background animation interpolations
    background: {
      circle1: {
        transform: [
          {
            translateX: backgroundAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, width + 100],
            }),
          },
          {
            translateY: backgroundAnim1.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -50],
            }),
          },
        ],
        opacity: backgroundAnim1.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.3, 0.1],
        }),
      },
      circle2: {
        transform: [
          {
            translateX: backgroundAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: [width + 100, -100],
            }),
          },
          {
            translateY: backgroundAnim2.interpolate({
              inputRange: [0, 1],
              outputRange: [100, -100],
            }),
          },
        ],
        opacity: backgroundAnim2.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.1, 0.2, 0.1],
        }),
      },
      circle3: {
        transform: [
          {
            translateX: backgroundAnim3.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, width - 50],
            }),
          },
          {
            translateY: backgroundAnim3.interpolate({
              inputRange: [0, 1],
              outputRange: [height * 0.3, height * 0.7],
            }),
          },
        ],
        opacity: backgroundAnim3.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.05, 0.15, 0.05],
        }),
      },
      floating: {
        transform: [
          {
            translateY: floatingAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -20],
            }),
          },
        ],
        opacity: floatingAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 0.6, 0.3],
        }),
      },
    },
    
    // Pulse animation value
    pulse: {
      transform: [{ scale: pulseAnim }]
    },
  };
}
