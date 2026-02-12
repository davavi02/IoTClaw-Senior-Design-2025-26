import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../stores/AuthStore';
import { LoginProps } from './Routes';
import Background from './Background';

const LoginScreen: React.FC = ({route, navigation}: LoginProps) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const [debugInfo, setDebugInfo] = React.useState<string>('');

  const googleIconImage = require("../assets/GoogleIcon.png");
  const clawzerTitle = require("../assets/ClawzerTitle.png");
  const clawMachine = require("../assets/ClawMachine.png");

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
    <Background>
      <View style={styles.container}>
        <Image source={clawzerTitle} style={styles.clawTitle}/>
        <Image source={clawMachine} style={styles.clawMachine}/>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? (<ActivityIndicator color="#fff" />) : 
            (<View style={styles.googleButtonContainer}>
              <Image source={googleIconImage} style={styles.googleIcon}/>
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </View>)
          }
        </TouchableOpacity>

      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clawTitle: {
    width: 360,
  },
  clawMachine: {
    width: 400,
    height: 400,
  },
  googleButton: {
    backgroundColor: '#222',
    borderColor: '#00E5FF',
    borderRadius: 16,
    borderWidth: 4,
    width: 360,
    height: 80,
    shadowColor: '#000',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '600',
    paddingLeft: 8,
  },
  googleButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 80,
    height: 80,
  }
});

export default LoginScreen;

