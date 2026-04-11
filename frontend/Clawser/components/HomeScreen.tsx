import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import { HomeProps } from './Routes';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from '../components/BottomNavBar';
import ClawzerTitle from '../assets/ClawzerTitle.png';
import Ribbon from '../assets/Ribbon.png';
import ClawMachine from '../assets/HomeScreenClaw.png';
import { ImageBackground } from "react-native";
import Pxbkg from "../assets/pixbkg.png";
import PlayButton from "../assets/PlayButton.png";
import CoinsButton from '../components/CoinsButton';
import Background from './Background';
const {width: windowWidth} = Dimensions.get("window");
const {height: windowHeight} = Dimensions.get("window");

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const { user, signOut } = useAuthStore();

  return (
    <Background>
        <View style={styles.screen}>
          {/* CONTENT AREA (NON-SCROLLING) */}
          <View style={styles.main}>
            {/* HEADER */}
            <View style={styles.headerWrapper}>
              <View style={styles.topHeader} />
              <View style = {styles.coinsButton}>
                  <CoinsButton
                  onPress = {() => navigation.navigate("Shop")}/>
              </View>
              <Image source={ClawzerTitle} style={styles.topLogo} />
            </View>

            {/* RIBBONS */}
            <View>
              <Image source={Ribbon} style={styles.ribbonLeft} />
              <Image source={Ribbon} style={styles.ribbonRight} />
            </View>

            {/* ADD ANY OTHER STATIC CONTENT HERE */}
            <View style={styles.clawWrapper}>
              <Image source={ClawMachine} style={styles.clawImage} />
            </View>
            <View style={styles.playButtonWrapper}>
              <TouchableOpacity style = {styles.playButtonContainer}
                    onPress={() => navigation.navigate("CabSelect")}
                      >
                  <View>
                      <Image source={PlayButton} style={styles.playButtonImage} />
                      <Text style = {styles.playButtonPlayText}>Play</Text>
                      <Text style = {styles.playButtonCostText}>10 Tokens</Text>
                  </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* FIXED BOTTOM NAVBAR */}
          <BottomNavBar
            active="home"
            onPressHome={() => navigation.navigate("Home", {from: "Home"})}
            onPressMap={() => navigation.navigate("Prize", {from: "Home"})}
            onPressProfile={() => navigation.navigate("Profile", {from: "Home"})}
          />
        </View>
</Background>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },

  // This wraps content + navbar and fills the screen
  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // All your non-scroll content goes here
  main: {
    // flex: 1 means "take all remaining space above the navbar"
    flex: 1,
    // add padding/margins if you want
  },

  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  topHeader: {
    width: 400,
    height: 400,
    backgroundColor: '#0B0029',
    borderRadius: 200,
    transform: [{ scaleX: 1.5 }],
    borderWidth: 4,
    borderColor: 'rgba(0, 229, 255, 0.96)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 7,
    position: 'absolute',
    top: -300,
    zIndex: 2,
  },

  topLogo: {
    width: '80%',
    height: 140,
    position: 'absolute',
    top: -windowHeight * 0.05,
    resizeMode: 'contain',
    zIndex: 3,
    marginTop:35,
  },

  ribbonLeft: {
    transform: [{ rotate: '-25.4deg' }],
    position: 'absolute',
    resizeMode: "contain",
    width: "60%",
    top: 60,
    left: -30,
    zIndex: 1,
  },

  ribbonRight: {
    transform: [{ rotate: '25.4deg' }],
    position: 'absolute',
    resizeMode: "contain",
    width: "60%",
    top: 60,
    right: -30,
    zIndex: 1,
  },

  clawWrapper: {
    flex: 1,
    justifyContent: "flex-start",  // push claw to the bottom of main
    alignItems: "center",        // center horizontally
    paddingTop: 50,            // space above navbar
  },

  clawImage: {
    marginTop: "30%",
    width: Math.min(windowWidth * 0.75, 600),
    height: Math.min(windowWidth * 1, 400),
    resizeMode: "contain",
  },

  playButtonWrapper: {
    justifyContent: "flex-end",  // push claw to the bottom of main
    alignItems: "center",        // center horizontally
    paddingBottom: 10,            // space above navbar
  },

  // this hold the actual button so the touchable opacity can work 
  // and not take up the whole screen
  playButtonContainer: {
    justifyContent: "flex-start",
    alignItems: "baseline",
  },

  playButtonImage: {
    transform: [{scaleX: 1.2}],
  },

  playButtonPlayText: {
    position: 'absolute',
    color: "#fff",
    fontSize: 60,
    fontWeight: "bold",
    top: 10,
    left: 25,
    zIndex: 4
  },

  coinsButton: {
    position: 'absolute',
    top: -80,
    right: 20
  },

  playButtonCostText: {
    position: 'absolute',
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    top: 80,
    left: 35,
    zIndex: 4
  },
}
);

export default HomeScreen;
