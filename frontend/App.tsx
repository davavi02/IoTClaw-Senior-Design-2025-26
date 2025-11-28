import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './stores/AuthStore';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './components/Routes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  //Wanna add your screen goto components/routes.tsx
  return(
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Routes/>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
