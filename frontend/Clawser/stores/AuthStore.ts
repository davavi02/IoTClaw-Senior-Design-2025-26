import { create } from 'zustand';
import AuthService, { UserInfo } from '../services/AuthService';
import { callProtectedRoute } from '../services/ApiService';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import useUserDataStore from './UserDataStore';

const JWT_SECURE = 'userJWT';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
  error: string | null;
  
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  checkSavedToken: () => Promise<void>;
  updateDisplayName: (name: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  //function to auto login as long as JWT is valid (7 day expire time)
  //when user logs in we store the returned JWT into secure storage, when user closes and reopens app we can check it and auto sign in if valid
  //on sign out we delete the JWT and wipe the local userdata which is reset at login
  checkSavedToken: async () => {
    try {
      const savedJwt = await SecureStore.getItemAsync(JWT_SECURE);

      if (savedJwt) {
        //use jwt-decode so we can get the expiration date of the JWT
        const decodedToken = jwtDecode(savedJwt);

        const currTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp > currTime) {

          console.log("Token is valid.");
          const response = await fetch('http://34.174.243.193:20206/api/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${savedJwt}` },
          });

          if (response.ok) {
            const profileData = await response.json();

            useUserDataStore.getState().setUserData(profileData.name, profileData.tokens);

            set({
              isAuthenticated: true,
              user: {
                email: profileData.email,
                name: profileData.name,
                picture: profileData.profilePic,
                tokens: profileData.tokens,
              }
            });
            console.log("Auto login complete")
          } else {
            console.log("Server rejected token.")
            await SecureStore.deleteItemAsync(JWT_SECURE);
            set({ isAuthenticated: false, user: null });
            useUserDataStore.getState().clearUserData();
          }

        } else {
          console.log("Token is expired.");
          await SecureStore.deleteItemAsync(JWT_SECURE);
          set({ isAuthenticated: false, user: null });
          useUserDataStore.getState().clearUserData();
        }
      }
    } catch(error) {
      console.error("Failed to load token or profile.", error);
      await SecureStore.deleteItemAsync(JWT_SECURE);
      set({ isAuthenticated: false, user: null });
      useUserDataStore.getState().clearUserData();
    }
  },

  signIn: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await AuthService.signInWithGoogle();
      if (result.error != null) {
        set({ error: result.error, isLoading: false });
        return;
      }
      if (result.jwt) {
        console.log('✅ Sign-in successful - setting authenticated state');
        console.log('User:', result.email);
        await SecureStore.setItemAsync(JWT_SECURE, result.jwt);

        useUserDataStore.getState().setUserData(result.name, result.tokens);

        set({
          isAuthenticated: true,
          user: {
            email: result.email,
            name: result.name,
            picture: result.profilePic,
            tokens: result.tokens,
          },
          isLoading: false,
          error: null,
        });
        console.log('✅ Authentication state updated - should navigate to Home');
      } else {
        console.error('❌ Sign-in failed:', result.error);
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: result.error || 'Authentication failed',
        });
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync(JWT_SECURE);

    useUserDataStore.getState().clearUserData();

    set({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },

  updateDisplayName: async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      return { ok: false as const, error: 'Name is required' };
    }
    try {
      const response = await callProtectedRoute('/api/profile', {
        method: 'POST',
        body: JSON.stringify({ name: trimmed }),
      });
      if (!response.ok) {
        const text = await response.text();
        return {
          ok: false as const,
          error: text || `Could not update profile (${response.status})`,
        };
      }
      const data = (await response.json()) as {
        name: string;
        email: string;
        profilePic: string;
        tokens: number;
      };
      const prev = get().user;
      if (!prev) {
        return { ok: false as const, error: 'Not signed in' };
      }
      set({
        user: {
          ...prev,
          name: data.name,
          email: data.email,
          picture: data.profilePic,
          tokens: data.tokens,
        },
      });
      useUserDataStore.getState().setUserData(data.name, data.tokens);
      return { ok: true as const };
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof Error ? e.message : 'Network error',
      };
    }
  },
}));

