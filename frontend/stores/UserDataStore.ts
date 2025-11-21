import { create } from 'zustand';

interface UserData {
  username: string;
  numTokens: number;

  setTokens: (num: number) => void;

}

const useUserDataStore = create<UserData>()((set, get) => ({
  username: "",
  numTokens: 0,

  setTokens: (num: number) => {
    const curTokens = get().numTokens;
    set({numTokens: curTokens + num});
  },
}));


export default useUserDataStore;