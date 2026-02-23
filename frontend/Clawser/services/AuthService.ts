import { GoogleSignin } from '@react-native-google-signin/google-signin';

class AuthService {
  constructor() {
    GoogleSignin.configure({
      // IMPORTANT: Use your WEB Client ID here. 
      // This ensures the idToken can be verified by your Go backend.
      webClientId: '973669949194-htjphkms2t4jmmtlrldmi7pcmhnsalmu.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }

  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      // The idToken is what you send to your Go backend
      const idToken = response.data?.idToken;
      console.log("login attempted");

      if (idToken) {
        const backendResponse = await fetch('http://34.174.243.193:20206/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
        });
        return await backendResponse.json();
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error.code, error.message);
      return { error: error.message };
    }
  }
}

export default new AuthService();