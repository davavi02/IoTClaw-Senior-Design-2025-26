import React from 'react';
import Background from './Background';
import ShopButton from './ShopButton';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const ShopScreen = () => {


  return (
    <Background>
      
      <View style={styles.shopHeader}>
      </View>
      
      <View style={styles.shopContainer}>
        {/*I cant help but think theres a better way to do this...
        For instance if i had a array of things to display this would be wonky.. */}

        <View style={styles.shopItemCol}>
          <ShopButton img={require("../assets/coin.png")} price="$1.99" numToken={100}/>
          <ShopButton img={require("../assets/coin.png")} price="$9.99" numToken={1200}/>
          <ShopButton img={require("../assets/coin.png")} price="$39.99" numToken={5200}/>
        </View>
        
        <View style={styles.shopItemCol}>
          <ShopButton img={require("../assets/coin.png")} price="$4.99" numToken={100}/>
          <ShopButton img={require("../assets/coin.png")} price="$14.99" numToken={2500}/>
          <ShopButton img={require("../assets/coin.png")} price="$99.99" numToken={14500}/>
        </View>

      </View>
    </Background>

  );
};

const styles = StyleSheet.create({
  shopContainer: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center"
  },
  shopHeader: {
    flex: 1,
  },
  shopItemCol: {
    flexDirection: "column",
    alignItems: "center",
    width: "48%"
  },
});

export default ShopScreen;

