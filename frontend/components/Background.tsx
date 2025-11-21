import React from 'react';
import {
  StyleSheet,
  ImageBackground,
} from 'react-native';

interface BackgroundProps {
    children?: React.ReactNode; 
}

const Background = ({children}: BackgroundProps) => {

  const imgBackground = require("../assets/pixbkg.png");
  return (
    <ImageBackground source={imgBackground} resizeMode="cover" style={styles.bkgImg}>
      {children}
    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  bkgImg: {
    flex: 1,
  },
});

export default Background;