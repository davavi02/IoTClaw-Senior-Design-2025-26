# Google OAuth Client IDs Configuration

Your Google OAuth Client IDs have been configured in the AuthService. The service now uses **platform-specific client IDs** to avoid access blocks, especially on iOS.

## Client IDs

- **Web Client ID** (used for web platform): 
  `832482974548-a1pf42oi4vpat8skut5isbbvcn16i7ja.apps.googleusercontent.com`

- **Android Client ID** (used on Android devices): 
  `832482974548-611q2nuek1midi2hasi3m28ilp680ckj.apps.googleusercontent.com`

- **iOS Client ID** (used on iOS devices - **prevents access blocks**): 
  `832482974548-cugsmg65capsk4hdmr4eeimuat6rb9le.apps.googleusercontent.com`

## Current Configuration

The `AuthService.ts` file automatically selects the correct client ID based on the platform:

1. **iOS devices**: Uses the iOS-specific client ID
2. **Android devices**: Uses the Android-specific client ID  
3. **Web/Other platforms**: Uses the Web Client ID

This platform-specific approach helps avoid access blocks on iOS and ensures proper authentication on all platforms.

## Optional: Using Environment Variables

If you want to use environment variables instead (recommended for production), create a `.env` file in the `frontend` directory:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=832482974548-a1pf42oi4vpat8skut5isbbvcn16i7ja.apps.googleusercontent.com
```

**Note:** Make sure to add `.env` to your `.gitignore` file to avoid committing sensitive information.

## Testing

The authentication should now work without any additional configuration. You can test it by:

1. Running `npm start` in the frontend directory
2. Opening the app on your device/simulator
3. Tapping "Sign in with Google"

The app will use the Web Client ID configured in the code.

