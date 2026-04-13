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
import BottomNavBar from '../components/BottomNavBar';
import ClawzerTitle from '../assets/ClawzerTitle.png';
import Ribbon from '../assets/Ribbon.png';
import ClawMachine from '../assets/HomeScreenClaw.png';
import PlayButton from "../assets/PlayButton.png";
import Background from './Background';
import { useSafeAreaInsets } from "react-native-safe-area-context";


const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const { user, signOut } = useAuthStore();
  var { width, height } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  width = width - insets.left - insets.right;
  height = height - insets.top - insets.bottom;
  const aspectRatio = width / height;
  const isTablet = aspectRatio >= 0.55;

  const topHeaderTop = isTablet ? -width * 0.75 : -width * 0.7;
  const topLogoWidth = isTablet ? '60%' : '80%';
  const topLogoHeight = height * 0.5 * aspectRatio;
  const topLogoMarginTop = height * 0.2 * aspectRatio;

  const ribbonWidth = isTablet ? '45%' : '60%';
  const ribbonTop = isTablet ? height * 0.18 : height * 0.08;
  const ribbonSideOffset = isTablet ? -width * 0.05 : -width * 0.1;

  const clawWidth = isTablet ? width * 0.5 : width * 0.7;
  const clawHeight = clawWidth * (350 / 300);
  const clawMarginTop = height * 0.25 * aspectRatio ** 0.2;

  const playButtonWidth = isTablet ? width * 0.3 : width * 0.4;
  const playButtonHeight = playButtonWidth * (133 / 163);

  const playTextFontSize = isTablet ? width * 0.11 : width * 0.14;
  const costTextFontSize = isTablet ? width * 0.03 : width * 0.04;

  return (
    <Background>
      <View style={styles.screen}>
        <View style={styles.main}>
          <View style={styles.headerWrapper}>
            <View
              style={[
                styles.topHeader,
                {
                  width,
                  height: width,
                  borderRadius: width,
                  borderWidth: width / 100,
                  shadowOffset: { width: 0, height: width / 50 },
                  top: topHeaderTop,
                },
              ]}
            />
            <Image
              source={ClawzerTitle}
              style={[
                styles.topLogo,
                {
                  width: topLogoWidth,
                  height: topLogoHeight,
                  marginTop: topLogoMarginTop,
                },
              ]}
            />
          </View>

          <View>
            <Image
              source={Ribbon}
              style={[
                styles.ribbonLeft,
                {
                  width: ribbonWidth,
                  top: ribbonTop,
                  left: ribbonSideOffset,
                },
              ]}
            />
            <Image
              source={Ribbon}
              style={[
                styles.ribbonRight,
                {
                  width: ribbonWidth,
                  top: ribbonTop,
                  right: ribbonSideOffset,
                },
              ]}
            />
          </View>

          <View style={styles.clawWrapper}>
            <Image
              source={ClawMachine}
              style={[
                styles.clawImage,
                {
                  marginTop: clawMarginTop,
                  width: clawWidth,
                  height: clawHeight,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.playButtonWrapper,
              {
                paddingBottom: height * 0.02,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.playButtonContainer}
              onPress={() => navigation.navigate('CabSelect')}
            >
              <View>
                <Image
                  source={PlayButton}
                  style={[
                    styles.playButtonImage,
                    {
                      width: playButtonWidth,
                      height: playButtonHeight,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.playButtonTextWrapper,
                    {
                      width: playButtonWidth,
                      height: playButtonHeight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.playButtonPlayText,
                      { fontSize: playTextFontSize },
                    ]}
                  >
                    Play
                  </Text>
                  <Text
                    style={[
                      styles.playButtonCostText,
                      { fontSize: costTextFontSize },
                    ]}
                  >
                    10 Tokens
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <BottomNavBar
          active="home"
          onPressHome={() => navigation.navigate('Home', { from: 'Home' })}
          onPressMap={() => navigation.navigate('Prize', { from: 'Home' })}
          onPressProfile={() => navigation.navigate('Profile', { from: 'Home' })}
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

  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },

  main: {
    flex: 1,
  },

  headerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },

  topHeader: {
    backgroundColor: '#0B0029',
    transform: [{ scaleX: 1.5 }],
    borderColor: 'rgba(0, 229, 255, 0.96)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 7,
    position: 'absolute',
    zIndex: 2,
  },

  topLogo: {
    position: 'absolute',
    resizeMode: 'contain',
    zIndex: 3,
  },

  ribbonLeft: {
    transform: [{ rotate: '-25.4deg' }],
    position: 'absolute',
    resizeMode: 'contain',
    zIndex: 1,
  },

  ribbonRight: {
    transform: [{ rotate: '25.4deg' }],
    position: 'absolute',
    resizeMode: 'contain',
    zIndex: 1,
  },

  clawWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 0,
  },

  clawImage: {
    resizeMode: 'contain',
  },

  playButtonWrapper: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  playButtonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },

  playButtonImage: {
    transform: [{ scaleX: 1.2 }],
  },

  playButtonPlayText: {
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 4,
  },

  playButtonCostText: {
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 4,
  },

  playButtonTextWrapper: {
    position: 'absolute',
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;