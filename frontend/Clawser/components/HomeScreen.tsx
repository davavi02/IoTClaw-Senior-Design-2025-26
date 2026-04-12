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
import PlayButton from "../assets/PlayButton.png";
import CoinsButton from '../components/CoinsButton';
import Background from './Background';
const {width: width} = Dimensions.get("window");
const {height: height} = Dimensions.get("window");
const aspectRatio = width / height;
const isTablet = aspectRatio >= 0.55;

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
                      <View style={styles.playButtonTextWrapper}>
                        <Text style={styles.playButtonPlayText}>Play</Text>
                        <Text style={styles.playButtonCostText}>10 Tokens</Text>
                      </View>
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
            height={height * 0.08}
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
    marginTop: 0,
  },

  topHeader: {
    width: width,
    height: width,
    backgroundColor: '#0B0029',
    borderRadius: width,
    transform: [{ scaleX: 1.5 }],
    borderWidth: width/100,
    borderColor: 'rgba(0, 229, 255, 0.96)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: width/50 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 7,
    position: 'absolute',
    top: isTablet ? -width * 0.75 : -width * 0.7,
    zIndex: 2,
  },

  topLogo: {
    width: isTablet ? '60%' : '80%',
    height: height * 0.5 * aspectRatio,
    position: 'absolute',
    resizeMode: 'contain',
    zIndex: 3,
    marginTop: height * 0.2 * aspectRatio,
  },

  ribbonLeft: {
    transform: [{ rotate: '-25.4deg' }],
    position: 'absolute',
    resizeMode: "contain",
    width: isTablet ? "45%" : "60%",
    top: isTablet ? height * 0.18 : height * 0.08,
    left: isTablet ? -width * 0.05 : -width * 0.1,
    zIndex: 1,
  },

  ribbonRight: {
    transform: [{ rotate: '25.4deg' }],
    position: 'absolute',
    resizeMode: "contain",
    width: isTablet ? "45%" : "60%",
    top: isTablet ? height * 0.18 : height * 0.08,
    right: isTablet ? -width * 0.05 : -width * 0.1,
    zIndex: 1,
  },

  clawWrapper: {
    flex: 1,
    justifyContent: "flex-start",  // push claw to the bottom of main
    alignItems: "center",        // center horizontally
    paddingTop: 0,            // space above navbar
  },

  clawImage: {
    marginTop: height * 0.25 * aspectRatio**0.2,
    width: isTablet ? width * 0.5 : width * 0.7,
    height: isTablet ? width * 0.5 * (350/300) : width * 0.7 * (350/300),
    resizeMode: "contain",
  },

  playButtonWrapper: {
    justifyContent: "flex-end",  // push claw to the bottom of main
    alignItems: "center",        // center horizontally
    paddingBottom: height * 0.02,            // space above navbar
  },

  // this hold the actual button so the touchable opacity can work 
  // and not take up the whole screen
  playButtonContainer: {
    justifyContent: "flex-start",
    alignItems: "baseline",
  },

  playButtonImage: {
    width: isTablet ? width * 0.3 : width * 0.4,
    height: isTablet ? width * 0.3 * 133/163: width * 0.4 * 133/163,
    transform: [{scaleX: 1.2}],
  },

  playButtonPlayText: {
    color: "#fff",
    fontSize: isTablet ? width * 0.11 : width * 0.14,
    fontWeight: "bold",
    zIndex: 4
  },

  playButtonCostText: {
    color: "#fff",
    fontSize: isTablet ? width * 0.03 : width * 0.04,
    fontWeight: "bold",
    zIndex: 4
  },

  playButtonTextWrapper: {
    width: isTablet ? width * 0.3 : width * 0.4,
    height: isTablet ? width * 0.3 * 133/163: width * 0.4 * 133/163,
    position: 'absolute',
    top: 0,
    justifyContent: "center",
    alignItems: "center",
  },
}
);

export default HomeScreen;
