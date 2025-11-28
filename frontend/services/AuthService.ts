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
    // Using platform-specific iOS/Android OAuth clients for native app
    // iOS OAuth client for iOS devices
    // Android OAuth client for Android devices (supports custom URI schemes)
    const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || 
      '832482974548-cugsmg65capsk4hdmr4eeimuat6rb9le.apps.googleusercontent.com';
    
    const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || 
      '832482974548-611q2nuek1midi2hasi3m28ilp680ckj.apps.googleusercontent.com';
    
    // Always use platform-specific client IDs for native app
    if (Platform.OS === 'ios') {
      this.clientId = iosClientId;
    } else if (Platform.OS === 'android') {
      // Use Android OAuth client (supports custom URI schemes with reverse client ID format)
      this.clientId = androidClientId;
    } else {
      // Fallback (shouldn't happen for native app, but just in case)
      throw new Error('Unsupported platform. This app is designed for iOS and Android only.');
    }
    
    // Generate the redirect URI for iOS/Android OAuth clients
    // For iOS: Use the iOS URL scheme format (com.googleusercontent.apps.CLIENT_ID:/)
    // For Android: Use custom scheme (frontend://redirect)
    // For Expo Go: Will use exp:// format which may need to be added to OAuth client
    if (Platform.OS === 'ios') {
      // For iOS: Use reverse client ID format (this works for iOS)
      const clientIdWithoutSuffix = this.clientId.split('.apps.googleusercontent.com')[0];
      this.redirectUri = `com.googleusercontent.apps.${clientIdWithoutSuffix}:/`;
      console.log('iOS: Using reverse client ID format for redirect URI');
    } else {
      // For Android: Use reverse client ID format (same as iOS)
      // Format: com.googleusercontent.apps.{CLIENT_ID_WITHOUT_SUFFIX}:/
      // Android OAuth clients with custom URI scheme enabled automatically accept this
      // No need to manually add redirect URI - Google validates based on package name and SHA-1
      const clientIdWithoutSuffix = this.clientId.split('.apps.googleusercontent.com')[0];
      this.redirectUri = `com.googleusercontent.apps.${clientIdWithoutSuffix}:/`;
      
      console.log('Android: Using reverse client ID format (same as iOS)');
      console.log('  Client ID:', this.clientId);
      console.log('  Redirect URI:', this.redirectUri);
      console.log('  Package name: com.iotclaw.frontend (must match Google Cloud Console)');
      console.log('  SHA-1: F4:05:B3:0B:88:62:3A:43:EB:3F:74:A9:2F:40:10:5E:B8:25:3A:7D (must match Google Cloud Console)');
      console.log('  Custom URI scheme: Must be enabled in Android OAuth client');
      console.log('  Note: Redirect URI is automatically validated - no need to add manually');
    }
    
    // Log the redirect URI for debugging
    console.log('Platform:', Platform.OS);
    console.log('Client ID:', this.clientId);
    console.log('Redirect URI configured:', this.redirectUri);
    if (Platform.OS === 'ios') {
      console.log('Note: iOS OAuth client uses iOS URL scheme - no redirect URI configuration needed in Google Cloud Console');
    } else {
      console.log('Note: Android OAuth client validates redirect URI automatically based on package name and SHA-1');
      console.log('   Package name: com.iotclaw.frontend (must match app.json)');
      console.log('   SHA-1: F4:05:B3:0B:88:62:3A:43:EB:3F:74:A9:2F:40:10:5E:B8:25:3A:7D');
      console.log('   Redirect URI:', this.redirectUri, '(must match scheme in app.json)');
    }
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

      console.log('Calling promptAsync - this will open browser for OAuth');
      const result = await request.promptAsync(discovery);

      console.log('✅ promptAsync returned - Auth result type:', result.type);
      console.log('Full result:', JSON.stringify(result, null, 2));
      
      if (result.type === 'success' || result.type === 'error') {
        console.log('Auth result params:', (result as any).params);
        console.log('Auth result error:', (result as any).error);
      }
      
      // If result is dismiss, the redirect wasn't caught
      if (result.type === 'dismiss') {
        console.error('❌ OAuth dismissed - redirect URI not caught by app');
        console.error('This means the app did not receive the redirect from Google');
        console.error('Check that intent filter in app.json matches redirect URI scheme');
        console.error('Redirect URI should be:', this.redirectUri);
      }

      if (result.type === 'success') {
        const { code, error, error_description } = result.params;
        
        console.log('✅ OAuth success - received code:', !!code);
        console.log('Error in params:', error);
        
        // Check for errors in the response
        if (error) {
          console.error('❌ OAuth error in response:', error, error_description);
          return {
            accessToken: null,
            userInfo: null,
            error: error_description || error || 'OAuth authorization error',
          };
        }

        if (!code) {
          console.error('❌ No authorization code received');
          console.log('Full params:', result.params);
          return {
            accessToken: null,
            userInfo: null,
            error: 'No authorization code received',
          };
        }

        console.log('Exchanging code for token...');
        
        // Exchange code for token with PKCE support
        // The code verifier should be stored in the request when usePKCE is true
        // Try to access it from various possible property names
        const codeVerifier = (request as any).codeVerifier || 
                            (request as any)._codeVerifier || 
                            (request as any).code_verifier;
        
        console.log('PKCE enabled:', request.usePKCE);
        console.log('Code verifier found:', !!codeVerifier);
        
        if (!codeVerifier && request.usePKCE) {
          console.error('PKCE code verifier not found! This will cause authentication to fail.');
          console.log('Request object keys:', Object.keys(request));
        }
        
        const exchangeParams: any = {
          clientId: this.clientId,
          code: code as string,
          redirectUri: this.redirectUri,
        };
        
        // Add code verifier if PKCE is enabled
        if (codeVerifier) {
          exchangeParams.extraParams = { code_verifier: codeVerifier };
        }
        
        const tokenResult = await AuthSession.exchangeCodeAsync(
          exchangeParams,
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
        console.error('❌ Auth error:', errorMessage);
        console.error('Error details:', result.error);
        return {
          accessToken: null,
          userInfo: null,
          error: errorMessage,
        };
      }

      if (result.type === 'dismiss') {
        console.error('❌ Auth dismissed - redirect URI may not be handled correctly');
        console.error('This usually means the app did not receive the redirect from Google');
        console.error('Check that the intent filter in app.json matches the redirect URI');
        return {
          accessToken: null,
          userInfo: null,
          error: 'Authentication was dismissed. The redirect URI may not be configured correctly.',
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

