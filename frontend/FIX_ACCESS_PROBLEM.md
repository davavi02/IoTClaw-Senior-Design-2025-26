# Step-by-Step Guide to Fix Access Problem

## Step 1: Get Your Redirect URI

First, we need to find out what redirect URI your app is actually using:

1. Start your app:
   ```bash
   cd frontend
   npm start
   ```

2. Open the app and check the console logs. You should see:
   - "Auth Debug Info:" with the redirect URI
   - Or look for "Redirect URI:" in the logs when you try to sign in

3. **Write down the exact redirect URI** - it will look something like:
   - `exp://localhost:8081` (Expo Go on simulator)
   - `exp://192.168.x.x:8081` (Expo Go on device)
   - `frontend://redirect` (standalone build)

## Step 2: Configure Google Cloud Console

### For iOS Client ID:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Find your **iOS Client ID**: `832482974548-cugsmg65capsk4hdmr4eeimuat6rb9le.apps.googleusercontent.com`
4. Click **Edit** (pencil icon)
5. Under **Authorized redirect URIs**, add:
   - The redirect URI from Step 1
   - `exp://localhost:8081` (for development)
   - `exp://127.0.0.1:8081` (alternative)
   - `frontend://redirect` (for production)
6. Click **Save**

### For Web Client ID (Recommended to try first):
1. Find your **Web Client ID**: `832482974548-a1pf42oi4vpat8skut5isbbvcn16i7ja.apps.googleusercontent.com`
2. Click **Edit**
3. Add the same redirect URIs as above
4. Click **Save**

## Step 3: Try Using Web Client ID First

Since Expo AuthSession uses web-based OAuth, the Web Client ID often works better:

1. Open `frontend/services/AuthService.ts`
2. Find line 57 (should have a comment about forcing Web Client ID)
3. Uncomment that line to force Web Client ID on all platforms:

```typescript
// Change this:
// this.clientId = webClientId;

// To this:
this.clientId = webClientId;
```

4. Save the file
5. Restart your app

## Step 4: Test the Authentication

1. Restart your Expo development server:
   ```bash
   npm start
   ```

2. Try signing in again
3. Check the console logs for any errors
4. If you see a redirect URI error, make sure that exact URI is in Google Cloud Console

## Step 5: If Still Not Working - Check OAuth Consent Screen

1. Go to Google Cloud Console > **APIs & Services** > **OAuth consent screen**
2. Make sure:
   - App is in "Testing" or "Published" mode
   - If in Testing, add your Google account as a test user
   - Scopes include: `openid`, `profile`, `email`
3. Save any changes

## Step 6: Verify Client ID Type

For Expo, the OAuth clients should be configured as:
- **Web application** type (not iOS or Android native)
- This is because Expo AuthSession uses web-based OAuth flow

If your iOS/Android client IDs are configured as native apps, you may need to:
1. Create new OAuth clients as "Web application" type
2. Or use the Web Client ID (which should already be "Web application")

## Quick Test: Use Web Client ID Only

To quickly test if it's a client ID issue:

1. In `AuthService.ts`, uncomment line 57:
   ```typescript
   this.clientId = webClientId;
   ```

2. Make sure the Web Client ID has the redirect URIs configured in Google Cloud Console

3. Test again

## Common Issues Checklist

- [ ] Redirect URI from console logs is added to Google Cloud Console
- [ ] Using Web Client ID (uncomment line 57 in AuthService.ts)
- [ ] OAuth consent screen is configured
- [ ] Test user is added (if app is in testing mode)
- [ ] Client ID type is "Web application" in Google Cloud Console
- [ ] Console logs show no obvious errors

## Still Having Issues?

1. Check the exact error message in the console
2. Verify the redirect URI matches exactly (including `exp://` vs `frontend://`)
3. Try clearing the app cache and restarting
4. Check if you're using Expo Go or a standalone build (redirect URIs differ)

