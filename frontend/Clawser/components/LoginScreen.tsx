import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../stores/AuthStore';
import { LoginProps } from './Routes';
import Background from './Background';
const { width, height } = Dimensions.get("window");

const LoginScreen: React.FC = ({route, navigation}: LoginProps) => {
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const [debugInfo, setDebugInfo] = React.useState<string>('');

  const googleIconImage = require("../assets/GoogleIcon.png");
  const clawzerTitle = require("../assets/ClawzerTitle.png");
  const clawMachine = require("../assets/HomeScreenClaw.png");

  /*React.useEffect(() => {
    // Log debug info on mount
    const AuthService = require('../services/AuthService').default;
    const info = AuthService.getDebugInfo();
    const infoString = `Platform: ${info.platform}\nClient ID: ${info.clientId.substring(0, 20)}...\nRedirect URI: ${info.redirectUri}`;
    setDebugInfo(infoString);
    console.log('Auth Debug Info:', info);
  }, []);*/

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

const isTablet = (width >= 768);

const titleWidth = Math.min(width * 0.85, 850);
const machineSize = Math.min(width * 0.55, isTablet ? 650 : 360);
const buttonWidth = isTablet ? Math.min(width * 0.6, 700) : width * 0.8;
const buttonHeight = height * 0.08;
const iconSize = buttonHeight * 0.7;
const buttonFontSize = buttonHeight * 0.38;


  return (
    <Background>
      <View style={styles.container}>
        <Image source={clawzerTitle} style=
        {[
            styles.clawTitle,
            {
              width: titleWidth,
              height: titleWidth * 0.28, // adjust a little if needed
            },
        ]}
          resizeMode="contain"
        />


        <Image source={clawMachine} style=
        {[
            styles.clawMachine,
            {
              width: machineSize,
              height: machineSize,
            },
        ]}
          resizeMode="contain"
        />

        <TouchableOpacity style={[styles.googleButton, { width: buttonWidth, height: buttonHeight }]} onPress={handleGoogleSignIn} disabled={isLoading}>
          {isLoading ? (<ActivityIndicator color="#fff" />) : 
            (<View style={styles.googleButtonContainer}>
              <Image source={googleIconImage} style=
              {[
                  styles.googleIcon,
                  {
                    width: iconSize,
                    height: iconSize,
                    marginRight: 12,
                  },
              ]}
                resizeMode="contain"
              />
              <Text style={[styles.googleButtonText, { fontSize: buttonFontSize }]}>Sign in with Google</Text>
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
    marginBottom: height * 0.03,
  },
  clawMachine: {
    marginBottom: height * 0.06,
  },
  googleButton: {
    backgroundColor: '#222',
    borderColor: '#00E5FF',
    borderRadius: 16,
    borderWidth: 4,
    justifyContent: 'center',
    shadowColor: '#000',
  },
  googleButtonText: {
    color: '#fff',
    fontWeight: '600',
    paddingLeft: 8,
  },
  googleButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  googleIcon: {},
});

export default LoginScreen;

