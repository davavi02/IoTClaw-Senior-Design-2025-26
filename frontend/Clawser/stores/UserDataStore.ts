import { create } from 'zustand';
import { callProtectedRoute } from '../services/ApiService';

interface UserData {
  username: string;
  numTokens: number;

  setUserData: (username: string, tokens: number) => void;
  setTokens: (num: number) => void;
  clearUserData: () => void;
  updateTokens: () => Promise<void>;
}

const useUserDataStore = create<UserData>()((set, get) => ({
  username: "",
  numTokens: 0,

  setUserData: (username: string, tokens: number) => {
    set({ username: username, numTokens: tokens });
  },

  setTokens: (num: number) => {
    set({ numTokens: num });
  },

  clearUserData: () => {
    set({ username: "", numTokens: 0 });
  },

  updateTokens: async () => {
          try {
            const response = await callProtectedRoute('/api/tokens', {
               method: 'GET' 
              });
              console.log("Server Status Code:", response.status);
    
            if (response.ok){

              const data = await response.json();
              get().setTokens(data.tokens);
            } else {
              const errorText = await response.text();
              console.log("Server Error Text:", errorText);
            }
          } catch (error) {
            console.error("Failed to update tokens.", error);
          }
  }
  
}));


export default useUserDataStore;