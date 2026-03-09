import React, { useEffect, useState } from 'react';
import Background from './Background';
import ShopButton from './ShopButton';
import useUserDataStore from '../stores/UserDataStore';
import { ShopProps } from './Routes';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CoinsButton from './CoinsButton';
import { callProtectedRoute } from '../services/ApiService';

interface Product {
  uid: number;
  tokens: number;
  price: number;
}


/// ======= 4: Add the props {route, navigation}: TYPE you exported in #3. Don't forget to import at top. 
/// =======    Congrats for following my example in Routes.tsx, pat your self on the back.
const ShopScreen = ({route, navigation}: ShopProps) => {

  const { numTokens } = useUserDataStore();

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadShop = async () => {
      //get shop products from /api/shop
      //display them dynamically on line 68 with flexWrap
      try {
        const response = await callProtectedRoute('/api/shop', {
           method: 'GET' 
          });

          console.log("Server Status Code:", response.status);

        if (response.ok){
          const data = await response.json();
          setProducts(data.products);

          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          } else {
            console.log("Server returned an empty products array");
          }
        } else {
          const errorText = await response.text();
          console.log("Server Error Text:", errorText);
        }
      } catch (error) {
        console.error("Failed to load shop products: ", error);
      }
    };

    loadShop();
  }, []);

  return (
    <Background>
      
      <View style={styles.shopHeader}>
        <TouchableOpacity style={styles.backButton} onPressOut={()=>{navigation.goBack()}}>
          <Text style={styles.backText}>{"< Back"}</Text>
        </TouchableOpacity>
        <CoinsButton></CoinsButton>

      </View>

      <View style={styles.shopBannerContainer}>
        <View style={styles.shopBanner}>
          <Text style={styles.bannerText}>Token Shop</Text>
        </View>

      </View>
      
      <View style={[styles.shopContainer, { flexWrap: 'wrap', justifyContent: 'center' }]}>
        {products.map((product) => (
          <View key={product.uid} style={styles.shopItemCol}>
            <ShopButton
              productId={product.uid.toString()}
              img={require("../assets/coin.png")}
              price={`$${product.price.toFixed(2)}`}
              numToken={product.tokens}
            />
          </View>
        ))}

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

export default ShopScreen;

