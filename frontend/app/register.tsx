/**
 * Registration Screen
 * 
 * User registration screen with form validation and error handling.
 * Allows new users to create accounts for the IoT Claw gaming experience.
 * 
 * Key features:
 * - Multi-field form with validation
 * - Password confirmation matching
 * - Loading states during registration
 * - Error message display
 * - Link to sign in screen
 */

import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAnimations } from "../hooks/useAnimations";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { COLORS, SPACING } from "../constants/theme";

export default function Register() {
  // Form state management
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get animation values for entrance effects
  const animations = useAnimations({
    entrance: true,
  });

  /**
   * Handle user registration with comprehensive validation
   * TODO: Replace with actual registration API call
   */
  const handleRegister = async () => {
    // Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual registration logic
      // For now, just simulate a registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to game dashboard after successful registration
      router.replace("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated header with title and subtitle */}
      <ScreenHeader
        title="Create Account"
        subtitle="Sign up to start playing"
        animationStyle={animations.entrance}
      />

      {/* Form container with proper spacing */}
      <View style={styles.form}>
        {/* Full name input field */}
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
          textContentType="name"
          returnKeyType="next"
          required
        />

        {/* Email input field */}
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
          required
        />

        {/* Password input field */}
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          returnKeyType="done"
          required
        />

        {/* Confirm password input field */}
        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
          returnKeyType="done"
          required
        />

        {/* Error message display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Register button */}
        <Button
          title={loading ? "Creating Account..." : "Create Account"}
          onPress={handleRegister}
          variant="primary"
          size="lg"
          disabled={loading}
          loading={loading}
          fullWidth
        />

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Link to sign in */}
        <Link href="/signin" asChild>
          <Button
            title="Already have an account? Sign in"
            onPress={() => {}}
            variant="outline"
            size="base"
            fullWidth
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  
  // Form container with proper spacing
  form: {
    gap: SPACING.lg,
  },
  
  // Error message container (still needed for custom styling)
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Divider styling
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.base,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.base,
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
