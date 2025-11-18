import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Complete the auth session to prevent memory leaks
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResult {
  accessToken: string | null;
  userInfo: UserInfo | null;
  error: string | null;
}

class AuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    // Note: Expo AuthSession uses web-based OAuth flow, so Web Client ID often works best
    // However, we try platform-specific IDs first as they may be required for some configurations
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 
      '832482974548-a1pf42oi4vpat8skut5isbbvcn16i7ja.apps.googleusercontent.com';
    
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || 
      '832482974548-cugsmg65capsk4hdmr4eeimuat6rb9le.apps.googleusercontent.com';
    
    const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || 
      '832482974548-611q2nuek1midi2hasi3m28ilp680ckj.apps.googleusercontent.com';
    
    // Try platform-specific client IDs first
    // If you encounter authorization errors, try using webClientId for all platforms
    if (Platform.OS === 'ios') {
      // For iOS, try iOS client ID first, but Web Client ID may work better with Expo
      this.clientId = iosClientId;
    } else if (Platform.OS === 'android') {
      this.clientId = androidClientId;
    } else {
      // Web or other platforms use web client ID
      this.clientId = webClientId;
    }
    
    // TEMPORARY FIX: Use Web Client ID on all platforms to avoid access issues
    // Expo AuthSession uses web-based OAuth, so Web Client ID works best
    // Uncomment the line below if you're having authorization errors:
    this.clientId = webClientId;
    
    // For Google Cloud Console, we need HTTP/HTTPS redirect URIs
    // Expo AuthSession can handle both custom schemes and HTTP URLs
    // We'll use makeRedirectUri which generates the correct URI for the environment
    const defaultRedirectUri = AuthSession.makeRedirectUri({
      scheme: 'frontend',
      path: 'redirect',
    });
    
    // For development with Expo Go, the URI might be exp:// format
    // But Google Cloud Console requires HTTP/HTTPS for Web application type
    // So we'll use localhost HTTP URL for development
    // IMPORTANT: Make sure this exact URI is in Google Cloud Console!
    if (__DEV__) {
      // Development: Use localhost HTTP URL (Google Cloud Console accepts this)
      // This works because Expo AuthSession can intercept HTTP redirects in development
      this.redirectUri = 'http://localhost:8081';
    } else {
      // Production: Use the generated redirect URI (custom scheme)
      // For production, you may need to set up a custom domain with HTTP/HTTPS
      this.redirectUri = defaultRedirectUri;
    }
    
    // Log the redirect URI for debugging
    console.log('Redirect URI configured:', this.redirectUri);
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      console.log('Starting Google sign-in...');
      console.log('Client ID:', this.clientId);
      console.log('Redirect URI:', this.redirectUri);

      const request = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Code,
        redirectUri: this.redirectUri,
        usePKCE: true,
      });

      const result = await request.promptAsync(discovery);

      console.log('Auth result type:', result.type);

      if (result.type === 'success') {
        const { code, error, error_description } = result.params;
        
        // Check for errors in the response
        if (error) {
          console.error('OAuth error:', error, error_description);
          return {
            accessToken: null,
            userInfo: null,
            error: error_description || error || 'OAuth authorization error',
          };
        }

        if (!code) {
          console.error('No authorization code received');
          return {
            accessToken: null,
            userInfo: null,
            error: 'No authorization code received',
          };
        }

        console.log('Exchanging code for token...');
        
        // Exchange code for token
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.clientId,
            code: code as string,
            redirectUri: this.redirectUri,
            extraParams: {},
          },
          discovery
        );

        console.log('Token exchange result:', {
          hasAccessToken: !!tokenResult.accessToken,
          hasRefreshToken: !!tokenResult.refreshToken,
        });

        if (tokenResult.accessToken) {
          console.log('Fetching user info...');
          // Fetch user info
          const userInfo = await this.fetchUserInfo(tokenResult.accessToken);
          
          if (!userInfo) {
            return {
              accessToken: tokenResult.accessToken,
              userInfo: null,
              error: 'Failed to fetch user information',
            };
          }
          
          return {
            accessToken: tokenResult.accessToken,
            userInfo: userInfo,
            error: null,
          };
        } else {
          console.error('No access token received');
          return {
            accessToken: null,
            userInfo: null,
            error: 'Failed to obtain access token',
          };
        }
      }

      if (result.type === 'error') {
        const errorMessage = result.error?.message || result.error?.code || 'Authentication error';
        console.error('Auth error:', errorMessage);
        return {
          accessToken: null,
          userInfo: null,
          error: errorMessage,
        };
      }

      return {
        accessToken: null,
        userInfo: null,
        error: result.type === 'cancel' ? 'User cancelled login' : 'Authentication failed',
      };
    } catch (error) {
      console.error('Sign-in error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        accessToken: null,
        userInfo: null,
        error: errorMessage,
      };
    }
  }

  private async fetchUserInfo(accessToken: string): Promise<UserInfo | null> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      return {
        id: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  getRedirectUri(): string {
    return this.redirectUri;
  }

  getClientId(): string {
    return this.clientId;
  }

  getDebugInfo(): { clientId: string; redirectUri: string; platform: string } {
    return {
      clientId: this.clientId,
      redirectUri: this.redirectUri,
      platform: Platform.OS,
    };
  }
}

export default new AuthService();

