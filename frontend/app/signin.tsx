import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual authentication logic
      // For now, just simulate a sign-in
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
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            keyboardType="default"
            returnKeyType="done"
          />
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Pressable 
          style={[styles.signInBtn, loading && styles.signInBtnDisabled]} 
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signInBtnText}>
            {loading ? "Signing In..." : "Sign In"}
          </Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Link href="/register" style={styles.registerLink}>
          <Text style={styles.registerLinkText}>Don't have an account? Sign up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#a8b3ed",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#ffffff",
    placeholderTextColor: "#a8b3ed",
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  signInBtn: {
    backgroundColor: "#6366f1",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  signInBtnDisabled: {
    backgroundColor: "#6366f1",
    opacity: 0.5,
  },
  signInBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#a8b3ed",
    fontSize: 14,
    fontWeight: "600",
  },
  registerLink: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#a8b3ed",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 18,
  },
});
