import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus } from 'react-native';
import { useAuthStore } from './stores/AuthStore';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './components/Routes';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const { isAuthenticated } = useAuthStore();

  // Ensure auth session is completed when app comes to foreground
  useEffect(() => {
    // Complete auth session on mount
    WebBrowser.maybeCompleteAuthSession();
    
    // Also complete auth session when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('App became active - completing auth session');
        WebBrowser.maybeCompleteAuthSession();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
