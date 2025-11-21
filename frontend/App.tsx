import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './stores/AuthStore';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';

export default function App() {
  const { isAuthenticated } = useAuthStore();
  {/* 

    return (
    <>
      {isAuthenticated ? <HomeScreen /> : <LoginScreen />}
      <StatusBar style="auto" />
    </>
  );
*/}

  return (
    <>
      <ShopScreen></ShopScreen>
      <StatusBar style="auto" />
    </>

);


}
