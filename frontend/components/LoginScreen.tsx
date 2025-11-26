import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../stores/AuthStore';
import { LoginProps } from './Routes';

const LoginScreen: React.FC = ({route, navigation}: LoginProps) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const [debugInfo, setDebugInfo] = React.useState<string>('');

  React.useEffect(() => {
    // Log debug info on mount
    const AuthService = require('../services/AuthService').default;
    const info = AuthService.getDebugInfo();
    const infoString = `Platform: ${info.platform}\nClient ID: ${info.clientId.substring(0, 20)}...\nRedirect URI: ${info.redirectUri}`;
    setDebugInfo(infoString);
    console.log('Auth Debug Info:', info);
  }, []);

  // Reset error state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Clear any errors when user navigates back to login screen
      clearError();
      console.log('Login screen focused - ready for sign-in');
    }, [clearError])
  );

  const handleGoogleSignIn = async () => {
    // Clear any previous errors before signing in
    clearError();
    console.log('Sign-in button pressed');
    try {
      await signIn();
    } catch (err) {
      console.error('Sign-in error:', err);
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert(
        'Login Error', 
        `${error}\n\nCheck console logs for more details.`, 
        [
          { text: 'OK', onPress: () => useAuthStore.getState().clearError() },
        ]
      );
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>IoT Claw</Text>
        <Text style={styles.subtitle}>Sign in to control your claw machine</Text>

        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.googleButtonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          You'll need to configure your Google OAuth Client ID in the environment variables
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LoginScreen;

