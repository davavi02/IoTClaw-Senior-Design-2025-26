import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';

interface BackgroundProps {
    children?: React.ReactNode; 
}

const Background = ({children}: BackgroundProps) => {

  const imgBackground = require("../assets/pixbkg.png");
  return (
    <ImageBackground source={imgBackground} resizeMode="cover" style={styles.bkgImg}>
        <ScrollView style={styles.container}>
            {children}
        </ScrollView>        
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex:1,
  },
  bkgImg: {
    flex: 1,
  },
});

export default Background;