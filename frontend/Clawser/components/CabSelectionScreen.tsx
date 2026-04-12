import React, { useEffect, useState } from 'react';
import Background from './Background';
import ShopButton from './ShopButton';
import CoinsButton from './CoinsButton';
import useUserDataStore from '../stores/UserDataStore';
import { CabinentData } from '../types/CabinentData';
import CabinentCard from './CabinetCard';
import { CabSelectProps } from './Routes';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { callProtectedRoute } from '../services/ApiService';
import HeaderBar from './HeaderBar';
const height = Dimensions.get("window").height;

const MOCK_CABINETS: CabinentData[] = 
  [
  {
    name: 'Test Cabinet 1',
    cost: 20,
    description: 'This is a test cabinet. It does not do anything, but it is very fun to look at! Please play it and give us feedback on how to make it better :)',
  },
  {
    name: 'Test Cabinet 2',
    cost: 20,
    description: 'Test Cabinet numero dos',
  },
  ];

/// ======= 4: Add the props {route, navigation}: TYPE you exported in #3. Don't forget to import at top. 
/// =======    Congrats for following my example in Routes.tsx, pat your self on the back.
const CabSelectionScreen = ({route, navigation}: CabSelectProps) => {

  const { numTokens } = useUserDataStore();

  const [cabinents, setCabinents] = useState<CabinentData[]>([]);
  const [emptyCabData, setEmpty] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getCabData();
  }, []);

  const playCabinent = (cData: CabinentData) => {
    navigation.navigate('Play', { cab: cData });
  }


  //Get the cabinent data.
  const getCabData = async () => {
    try {
      setLoading(true);
      setError(false);
      setCabinents([]);
      setEmpty(false);
      const response = await callProtectedRoute('/api/games', {
          method: 'GET' 
      });

      

      console.log("Server Status Code:", response.status);

      if (response.ok){
        const data = await response.json();
        setCabinents(data.games);

        if (data.games && data.games.length > 0) {
          setCabinents(data.games);
          setLoading(false);
        } else {
          console.log("No real cabinets found, falling back to mock cabinets");
          setCabinents(MOCK_CABINETS);
          setLoading(false);
        }
      } else {
        const errorText = await response.text();
        console.log("Server Error Text:", errorText);
        setError(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load cabinent: ", error);
      setError(true);
      setLoading(false);
    }
  };

  
  return (
    <Background>

      <HeaderBar height={height * 0.08} />

      <View style={[styles.shopContainer, { flexWrap: 'wrap', justifyContent: 'center' }]}>
        
        { (isLoading || isError || emptyCabData) &&
          <View style={styles.shopBanner}>
            { isLoading && <Text>Getting Games...</Text> }
            { isError && <Text>An error has happened. Please refresh.</Text> }
            { emptyCabData && <Text>No games are currently active at this time :c</Text> }
          </View>
        }
  
        

        {cabinents?.map((cab) => (
          <View key={cab.name} style={styles.shopItemCol}>
            <CabinentCard data={cab} onPressCallback={playCabinent}></CabinentCard>
          </View>
        ))}
      </View>

      <View style={styles.shopItemCol}>
        <TouchableOpacity 
          style={styles.playbtn} 
          onPressOut={getCabData}>
          <Text style={styles.btnText}>Refresh!</Text>
        </TouchableOpacity>
      </View>
    </Background>

    

  );
};

const styles = StyleSheet.create({
  shopContainer: {
    flex: 6,
    flexDirection: "row",
    alignSelf: "center",
  },
  shopBanner: {
    width: 320,
    height: 75,
    backgroundColor: "#FF003C",
    borderWidth: 8,
    borderRadius: 20,
    borderColor: "#FFFFFF",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  shopItemCol: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },

  playbtn: {
    width: 120,
    height: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#5cf300",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default CabSelectionScreen;