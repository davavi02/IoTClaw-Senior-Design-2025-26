import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './stores/AuthStore';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './components/Routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  //Wanna add your screen goto components/routes.tsx
  return(
    <SafeAreaProvider>
      <NavigationContainer>
        <Routes/>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
