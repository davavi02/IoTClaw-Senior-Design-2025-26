/**
 * Sign In Screen
 * 
 * Authentication screen where users can log into their accounts.
 * Features form validation, loading states, and error handling.
 * 
 * Key features:
 * - Email and password input with validation
 * - Loading state during authentication
 * - Error message display
 * - Link to registration screen
 * - Consistent styling with app theme
 */

import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAnimations } from "../hooks/useAnimations";
import { ScreenHeader } from "../components/ScreenHeader";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { COLORS, SPACING } from "../constants/theme";

export default function SignIn() {
  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get animation values for entrance effects
  const animations = useAnimations({
    entrance: true,
  });

  /**
   * Handle user sign in with form validation
   * TODO: Replace with actual authentication API call
   */
  const handleSignIn = async () => {
    // Validate required fields
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual authentication logic
      // For now, just simulate a sign-in process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to game dashboard after successful login
      router.replace("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Animated header with title and subtitle */}
      <ScreenHeader
        title="Welcome Back"
        subtitle="Sign in to your account"
        animationStyle={animations.entrance}
      />

      {/* Form container with proper spacing */}
      <View style={styles.form}>
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
          textContentType="password"
          returnKeyType="done"
          required
        />

        {/* Error message display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Sign in button */}
        <Button
          title={loading ? "Signing In..." : "Sign In"}
          onPress={handleSignIn}
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

        {/* Link to registration */}
        <Link href="/register" asChild>
          <Button
            title="Don't have an account? Sign up"
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
