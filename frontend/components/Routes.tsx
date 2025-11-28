import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import LoginScreen from './LoginScreen';
import ShopScreen from './ShopScreen';
import HomeScreen from './HomeScreen';
import { useAuthStore } from '../stores/AuthStore';

/// To add a routes theres some things you gotta do... I'll even comment 1, 2, 3, 4 so you can see the steps
/// First: For each route add its param types to stackparamlist, if no params go undefined like I did.
/// Second: Add the route to routes, emphasis on the name as its a id persay.
/// Third: Make a type, so typescripts whiney ass stops complaining. Look at the bottom of this file. For ShopProps/LoginProps
/// FOurth: Go to your compononet and add the params look at ShopScreen.tsx for a example..


/// ======= 1: Make params, we shouldn't be passing crap so this should prob be empty...
type StackParamList = {
  Home: undefined;
  Shop: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<StackParamList, "Stack">();

/// ======= 2: Add your route here, name is important as you will use it to refer to what screen
/// =======    For debugging you should probably change initialRouteName to the one you want.
const Routes = () => {
  const { isAuthenticated } = useAuthStore();
  const navigation = useNavigation();
  const prevAuthState = useRef(isAuthenticated);
  const isNavigating = useRef(false);

  // Only navigate when authentication state actually changes (login/logout)
  // Don't interfere with normal navigation between authenticated screens
  useEffect(() => {
    const authStateChanged = prevAuthState.current !== isAuthenticated;
    
    console.log('Routes: Auth state check', {
      isAuthenticated,
      prevAuthState: prevAuthState.current,
      authStateChanged,
      isNavigating: isNavigating.current,
    });
    
    // Only handle navigation when auth state changes (not on every render)
    if (authStateChanged && !isNavigating.current) {
      isNavigating.current = true;
      
      if (isAuthenticated) {
        // User just logged in - navigate to Home (homepage)
        // Use reset to clear navigation stack and set Home as root
        console.log('✅ User authenticated - navigating to Home (homepage)');
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' as never }],
          });
          console.log('✅ Navigation to Home completed');
        } catch (error) {
          console.error('❌ Navigation error:', error);
        }
      } else if (!isAuthenticated && prevAuthState.current === true) {
        // User just logged out - navigate to Login
        // Only reset if user was previously authenticated
        console.log('✅ User logged out - navigating to Login');
        try {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' as never }],
          });
          console.log('✅ Navigation to Login completed');
        } catch (error) {
          console.error('❌ Navigation error:', error);
        }
      }
      
      prevAuthState.current = isAuthenticated;
      
      // Reset navigation flag after a short delay
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);
    }
  }, [isAuthenticated, navigation]);

  return(
    <Stack.Navigator 
      initialRouteName={isAuthenticated ? 'Home' : 'Login'} 
      id="Stack" 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
      <Stack.Screen name='Shop' component={ShopScreen}></Stack.Screen>
      <Stack.Screen name='Login' component={LoginScreen}></Stack.Screen>
    </Stack.Navigator>);
};

/// ======= 3: Not Gonna lie just copy paste shop, change the type name, and the 'Shop' to the name in #2
export type HomeProps = NativeStackScreenProps<StackParamList, 'Home', 'Stack'>;
export type ShopProps = NativeStackScreenProps<StackParamList, 'Shop', 'Stack'>;
export type LoginProps = NativeStackScreenProps<StackParamList, 'Login', 'Stack'>;

export default Routes;