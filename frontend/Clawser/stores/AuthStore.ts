import { create } from 'zustand';
import AuthService, { UserInfo } from '../services/AuthService';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  signIn: () => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,

  signIn: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await AuthService.signInWithGoogle();
      
      if (result.accessToken && result.userInfo) {
        console.log('✅ Sign-in successful - setting authenticated state');
        console.log('User:', result.userInfo.email);
        set({
          isAuthenticated: true,
          user: result.userInfo,
          accessToken: result.accessToken,
          isLoading: false,
          error: null,
        });
        console.log('✅ Authentication state updated - should navigate to Home');
      } else {
        console.error('❌ Sign-in failed:', result.error);
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          isLoading: false,
          error: result.error || 'Authentication failed',
        });
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error);
      set({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  },

  signOut: () => {
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

