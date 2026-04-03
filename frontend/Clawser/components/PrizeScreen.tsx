import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import { PrizeProps } from './Routes';
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from '../components/BottomNavBar';
import HeaderBar from '../components/HeaderBar';
import PrizeCard from '../components/PrizeCard'
import Pxbkg from "../assets/pixbkg.png";
import { MOCK_PRIZES } from '../data/mockPrizes';

import { ImageBackground } from "react-native";
import CoinsButton from '../components/CoinsButton.tsx';

const PrizeScreen: React.FC<PrizeProps> = ({ navigation }) => {
  const { user, signOut } = useAuthStore();

  return (
    <SafeAreaView style={styles.root} edges={['none']}>
      <ImageBackground source={Pxbkg} style={styles.bg} resizeMode="cover">
        <View style={styles.screen}>
          {/* CONTENT AREA (NON-SCROLLING) */}
          <View style={styles.main}>
            {/* HEADER */}
            <View style={styles.headerWrapper}>
                <HeaderBar useLogoInstead={true}></HeaderBar>
            </View>

            {/* Prize Cards */}
            <View style={styles.prizeCardsArea}>
                <FlatList
                        data={MOCK_PRIZES}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <PrizeCard prize={item} />}
                        contentContainerStyle={{ marginVertical: 0 }}
                      />
            </View>
          </View>

          {/* FIXED BOTTOM NAVBAR */}
          <BottomNavBar
            active="prize"
            onPressHome={() => navigation.navigate("Home", { from: "Prize" })}
            onPressMap={() => navigation.navigate("Prize")}
            onPressProfile={() => navigation.navigate("Profile", { from: "Prize" })}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },

  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
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

    prizeCardsArea: {
        flex: 1,
        margin: 0
    }
});

export default PrizeScreen;
