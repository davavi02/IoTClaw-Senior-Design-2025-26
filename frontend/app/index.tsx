/**
 * Home/Landing Page
 * 
 * This is the main entry point of the app where users can sign in or register.
 * Features animated background effects and a welcoming interface to introduce
 * the IoT Claw gaming experience.
 * 
 * Key features:
 * - Animated background with floating elements
 * - Clear call-to-action buttons for authentication
 * - Responsive design that works on all screen sizes
 * - Smooth entrance animations for better UX
 */

import { Link } from "expo-router";
import { Animated, StyleSheet, View } from "react-native";
import { useAnimations } from "../hooks/useAnimations";
import { AnimatedBackground } from "../components/AnimatedBackground";
import { ScreenHeader } from "../components/ScreenHeader";
import { Button } from "../components/Button";
import { COLORS, SPACING } from "../constants/theme";

export default function LoginHomePage() {
  // Get animation values and effects from custom hook
  const animations = useAnimations({
    entrance: true,    // Enable fade in and slide up animations
    background: true,  // Enable floating background circles
    pulse: true,       // Enable pulsing effect for buttons
  });

  // All animations are now handled by the useAnimations hook
  // No need for manual animation setup or cleanup

  return (
    <View style={styles.container}>
      {/* Animated background with floating elements */}
      <AnimatedBackground 
        animations={animations.background}
        showFloatingElements={true}
      />

      {/* Animated header with title and subtitle */}
      <ScreenHeader
        title="🎮 Claw Game"
        subtitle="✨ Remote arcade experience"
        animationStyle={animations.entrance}
      />

      {/* Login action buttons with animations */}
      <Animated.View 
        style={[
          styles.loginActions,
          animations.entrance,
        ]}
      >
        <Link href="/signin" asChild>
          <Button
            title="Sign In"
            icon="🎯"
            onPress={() => {}}
            variant="primary"
            size="xl"
            fullWidth
          />
        </Link>
        
        <Link href="/register" asChild>
          <Button
            title="Create Account"
            onPress={() => {}}
            variant="outline"
            size="lg"
            fullWidth
          />
        </Link>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING['5xl'],
    paddingBottom: SPACING['3xl'],
  },
  
  // Login actions container with proper spacing
  loginActions: {
    gap: SPACING.base,
    marginBottom: SPACING['2xl'],
  },
});