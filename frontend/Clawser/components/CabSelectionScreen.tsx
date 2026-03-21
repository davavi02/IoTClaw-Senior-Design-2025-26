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
  TouchableOpacity,
} from 'react-native';
import { callProtectedRoute } from '../services/ApiService';

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

  const playCabinent = (title: string) => {
    navigation.navigate('Play', { cab: title });
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
      
      <View style={styles.shopHeader}>
        <TouchableOpacity style={styles.backButton} onPressOut={()=>{navigation.goBack()}}>
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>
        <CoinsButton></CoinsButton>
      </View>
      
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

      <View>
        <TouchableOpacity style={styles.backButton} onPressOut={getCabData}>
          <Text style={styles.backText}>{"Refresh!!!"}</Text>
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
  shopHeader: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0B0028",
    borderBottomWidth: 3,
    borderColor: "#FF003C",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  shopBannerContainer: {
    padding: 10,
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
  bannerText: {
    fontSize: 32,
    color: "#FFFFFF",
  },
  shopItemCol: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  tokenText: {
    fontSize: 32,
    color: "#FFFFFF",
  },
  backText: {
    fontSize: 24,
    color: "#FFFFFF",
    alignSelf: "center",
  },
  backButton: {
    width: 100,
    height: 50,
    backgroundColor: "#FF003C",
    borderWidth: 8,
    borderRadius: 20,
    borderColor: "#FFFFFF",
    justifyContent: "center",
  }
});

export default CabSelectionScreen;