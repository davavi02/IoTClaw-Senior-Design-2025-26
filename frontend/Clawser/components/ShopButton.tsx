import React from 'react';
import useUserDataStore from '../stores/UserDataStore';
import { callProtectedRoute } from '../services/ApiService';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  GestureResponderEvent,
} from 'react-native';

interface ShopButtonProps {
  productId: string;
  numToken: number;
  price: string;
  img: ImageSourcePropType;
}

const ShopButton = ({productId, numToken, price, img}: ShopButtonProps) => {

  const { setTokens } = useUserDataStore();

  const HandlePurchase = async () => {
    //post for buying tokens /api/buy/(num)
    try {
      const response = await callProtectedRoute(`/api/buy/${productId}`, {
        method: 'POST',
      });

      if (response.ok) {
        const updatedData = await response.json();

        setTokens(updatedData.tokens);
        console.log("Purchase successful");
      } else {
        console.log("Purchase failed");
      }
    } catch (error) {
      console.error("Purchase error: ", error);
    }
  };

  return (
    <TouchableOpacity style={styles.shopItemContainer} onPressOut={HandlePurchase}>
      <View style={styles.mainButton}>
        <Text style={styles.tokenText}>{numToken}</Text>
        <Image source={img} style={styles.shopImg} resizeMode="contain"/>
      </View>
      <View style={styles.priceBox}>
        <Text style={styles.priceText}>{price}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shopItemContainer: {
    width: 150,
    height: 200,
    position: 'relative',
  },

  priceText: {
    fontSize: 32,
    color: "#FFFFFF",
  },

  mainButton: {
    width: 150,
    height: 150,
    backgroundColor: "#007784",
    borderWidth: 8,
    borderRadius: 20,
    borderColor: "#00E5FF",
    alignItems: "center",
    justifyContent: "center"
  },

  shopImg: {
    zIndex: 1,
    width: "50%",
    height: "50%",
  },

  priceBox: {
    position: 'absolute',
    bottom: 15,
    right: 12,
    width: 125,
    height: 50,
    backgroundColor: "#0B0029",
    borderWidth: 3,
    borderRadius: 20,
    borderColor: "#00E5FF",
    justifyContent: "center",
    alignItems: "center"
  },

  tokenText: {
    fontSize: 32,
    color: "#FFFFFF"
  }
});

export default ShopButton;