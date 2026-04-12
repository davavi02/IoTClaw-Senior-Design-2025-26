import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList, Text
} from 'react-native';
import { useAuthStore } from '../stores/AuthStore';
import { PrizeProps } from './Routes';
import BottomNavBar from '../components/BottomNavBar';
import HeaderBar from '../components/HeaderBar';
import PrizeCard from '../components/PrizeCard'
import Background from './Background';
import { Prize } from '../types/prize';
import { callProtectedRoute } from '../services/ApiService';
const height = Dimensions.get("window").height;

const PrizeScreen: React.FC<PrizeProps> = ({ navigation }) => {
  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    const getPrizes = async () => {
      try {
        const response = await callProtectedRoute('/api/prizes', {
           method: 'GET'
          });
          console.log("Server Status Code:", response.status);
        if (response.ok){
          const data = await response.json();
          setPrizes(data.prizes);

          if (data.prizes && data.prizes.length > 0) {
            setPrizes(data.prizes);
          } else {
            setPrizes(data.prizes);
            console.log("Server returned an empty prize array");
          }
        } else {
          const errorText = await response.text();
          console.log("Server Error Text:", errorText);
        }
      } catch (error) {
        console.error("Failed to load prizes: ", error);
      }
    };

    getPrizes();
  }, []);


  return (
    <Background>
        <View style={styles.screen}>
          {/* CONTENT AREA (NON-SCROLLING) */}
          <View style={styles.main}>
            {/* HEADER */}
            <View style={styles.headerWrapper}>
                <HeaderBar useLogoInstead={true}></HeaderBar>
            </View>

            {/* Prize Cards */}

            {prizes.length ? (<View style={styles.prizeCardsArea}>
                <FlatList
                        data={prizes}
                        keyExtractor={(item) => item.dateWon}
                        renderItem={({ item  }) => <PrizeCard prize={item} />}
                        contentContainerStyle={{ marginVertical: 0 }}
                      />
            </View>) : (<Text style={styles.errText}>No prizes won yet!!</Text>)}
          </View>

          {/* FIXED BOTTOM NAVBAR */}
          <BottomNavBar
            active="prize"
            onPressHome={() => navigation.navigate("Home", { from: "Prize" })}
            onPressMap={() => navigation.navigate("Prize")}
            onPressProfile={() => navigation.navigate("Profile", { from: "Prize" })}
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
    alignItems: "center"
    // add padding/margins if you want
  },

  errText: {
    color: '#FFFFFF',
    fontSize: 32,
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
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
