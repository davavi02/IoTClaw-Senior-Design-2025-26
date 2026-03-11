import { create } from 'zustand';

interface UserData {
  username: string;
  numTokens: number;

  setUserData: (username: string, tokens: number) => void;
  setTokens: (num: number) => void;
  clearUserData: () => void;
}

const useUserDataStore = create<UserData>()((set) => ({
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
  }
}));


export default useUserDataStore;