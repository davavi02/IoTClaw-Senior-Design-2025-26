import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import ShopScreen from './ShopScreen';

/// To add a routes theres some things you gotta do... I'll even comment 1, 2, 3, 4 so you can see the steps
/// First: For each route add its param types to stackparamlist, if no params go undefined like I did.
/// Second: Add the route to routes, emphasis on the name as its a id persay.
/// Third: Make a type, so typescripts whiney ass stops complaining. Look at the bottom of this file. For ShopProps/LoginProps
/// FOurth: Go to your compononet and add the params look at ShopScreen.tsx for a example..


/// ======= 1: Make params, we shouldn't be passing crap so this should prob be empty...
type StackParamList = {
  Shop: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<StackParamList, "Stack">();

/// ======= 2: Add your route here, name is important as you will use it to refer to what screen
/// =======    For debugging you should probably change initialRouteName to the one you want.
const Routes = () => {
  return(
    <Stack.Navigator initialRouteName='Shop' id="Stack" screenOptions={{headerShown: false}}>
      <Stack.Screen name='Shop' component={ShopScreen}></Stack.Screen>
      <Stack.Screen name='Login' component={LoginScreen}></Stack.Screen>
    </Stack.Navigator>);
};

/// ======= 3: Not Gonna lie just copy paste shop, change the type name, and the 'Shop' to the name in #2
export type ShopProps = NativeStackScreenProps<StackParamList, 'Shop', 'Stack'>;
export type LoginProps = NativeStackScreenProps<StackParamList, 'Login', 'Stack'>;

export default Routes;