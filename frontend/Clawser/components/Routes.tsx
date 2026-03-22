import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import LoginScreen from './LoginScreen';
import ShopScreen from './ShopScreen';
import PrizeScreen from './PrizeScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import ReportErrorScreen from './ReportErrorScreen';
import PrizeTrackingScreen from './PrizeTrackingScreen';
import PlayScreen from './PlayScreen';
import CabSelectionScreen from './CabSelectionScreen';
import { useAuthStore } from '../stores/AuthStore';

/// To add a routes theres some things you gotta do... I'll even comment 1, 2, 3, 4 so you can see the steps
/// First: For each route add its param types to stackparamlist, if no params go undefined like I did.
/// Second: Add the route to routes, emphasis on the name as its a id persay.
/// Third: Make a type, so typescripts whiney ass stops complaining. Look at the bottom of this file. For ShopProps/LoginProps
/// Fourth: Go to your compononet and add the params look at ShopScreen.tsx for a example..


/// ======= 1: Make params, we shouldn't be passing crap so this should prob be empty...
type StackParamList = {
  Home: { from?: string };
  Shop: undefined;
  Login: { from?: string };
  Prize: { from?: string };
  Profile: { from?: string };
  EditProfile: undefined;
  ReportError: undefined;
  PrizeTracking: undefined;
  Play: { cab: string };
  CabSelect: undefined;
};

const Stack = createNativeStackNavigator<StackParamList, "Stack">();

/// ======= 2: Add your route here, name is important as you will use it to refer to what screen
/// =======    For debugging you should probably change initialRouteName to the one you want.
const Routes = () => {
  const { isAuthenticated, checkSavedToken } = useAuthStore();
  const navigation = useNavigation();
  const prevAuthState = useRef(isAuthenticated);
  const isNavigating = useRef(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await checkSavedToken();
      setIsCheckingToken(false);  //done checking for JWT, render now
    };
    initAuth();
  }, [checkSavedToken]);

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
    if (authStateChanged && !isNavigating.current && !isCheckingToken) {
      isNavigating.current = true;
      
      if (isAuthenticated) {
        // User just logged in - navigate to Home (homepage)
        // Use reset to clear navigation stack and set Home as root
        console.log('✅ User authenticated - navigating to Home (homepage)');
        requestAnimationFrame(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' as never }],
            });
            console.log('✅ Navigation to Home completed');
          } catch (error) {
            console.error('❌ Navigation error:', error);
          }
        });
      } else if (!isAuthenticated && prevAuthState.current === true) {
        // User just logged out - navigate to Login
        // Only reset if user was previously authenticated
        console.log('✅ User logged out - navigating to Login');
        requestAnimationFrame(() => {
          try {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
            console.log('✅ Navigation to Login completed');
          } catch (error) {
            console.error('❌ Navigation error:', error);
          }
        });       
      }
      
      prevAuthState.current = isAuthenticated;
      
      // Reset navigation flag after a short delay
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);
    }
  }, [isAuthenticated, navigation, isCheckingToken]);

  //if we are checking secure store, render
  if (isCheckingToken) {
    return null;
  }

  return(
    <Stack.Navigator 
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      id="Stack" 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={({ route }) => ({
          animation:
            route.params?.from === 'Prize' ? 'slide_from_right' :
            route.params?.from === 'Shop' ? 'slide_from_bottom' :
            route.params?.from === 'Profile' ? 'slide_from_left' :
            'default',
        })}
      />
      <Stack.Screen name='Shop' component={ShopScreen}></Stack.Screen>
      <Stack.Screen name='Login' component={LoginScreen}></Stack.Screen>
      <Stack.Screen name='Profile' component={ProfileScreen}></Stack.Screen>
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="ReportError"
        component={ReportErrorScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name="PrizeTracking"
        component={PrizeTrackingScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen
        name='Prize'
        component={PrizeScreen}
        options={({ route }) => ({
          animation: route.params?.from === 'Home' ? 'slide_from_left' : 'default',
        })}
      />
      <Stack.Screen
        name='Play'
        component={PlayScreen}
        options={({ route }) => ({
        animation: "default",
        })}
      />
      <Stack.Screen
        name='CabSelect'
        component={CabSelectionScreen}
        options={({ route }) => ({
        animation: 'slide_from_bottom',
        })}
      />
    </Stack.Navigator>);
};

/// ======= 3: Not Gonna lie just copy paste shop, change the type name, and the 'Shop' to the name in #2
export type HomeProps = NativeStackScreenProps<StackParamList, 'Home', 'Stack'>;
export type PrizeProps = NativeStackScreenProps<StackParamList, 'Prize', 'Stack'>;
export type ShopProps = NativeStackScreenProps<StackParamList, 'Shop', 'Stack'>;
export type CabSelectProps = NativeStackScreenProps<StackParamList, 'CabSelect', 'Stack'>;
export type LoginProps = NativeStackScreenProps<StackParamList, 'Login', 'Stack'>;
export type ProfileProps = NativeStackScreenProps<StackParamList, 'Profile', 'Stack'>;
export type EditProfileProps = NativeStackScreenProps<StackParamList, 'EditProfile', 'Stack'>;
export type ReportErrorProps = NativeStackScreenProps<StackParamList, 'ReportError', 'Stack'>;
export type PrizeTrackingProps = NativeStackScreenProps<StackParamList, 'PrizeTracking', 'Stack'>;
export type PlayProps = NativeStackScreenProps<StackParamList, 'Play', 'Stack'>;


export default Routes;
