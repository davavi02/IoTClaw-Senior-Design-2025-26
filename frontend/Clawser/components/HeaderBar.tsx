import React from 'react';
import { View, Dimensions, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import Svg, { Polygon, Rect } from "react-native-svg";
import { useNavigation } from '@react-navigation/native';
import CoinsButton from './CoinsButton';
import ClawzerTitle from '../assets/ClawzerTitle.png';
import BackButton from '../assets/BackButton.png';
const windowWidth = Dimensions.get("window").width;
const backButtonWidth = windowWidth * 0.25;
const backButtonHeight = backButtonWidth * 0.5;

interface HeaderBarProps {
    useLogoInstead?: boolean; 
}

const HeaderBar: React.FC<HeaderBarProps> = ({ useLogoInstead }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.headerOutline}>
        
        { useLogoInstead ? 
          (<Image source={ClawzerTitle} style={styles.topLogo}/>) :
          (<Svg width={backButtonWidth} height={backButtonHeight} viewBox={`0 0 ${backButtonWidth} ${backButtonHeight}`}>
            <Image source={BackButton} style={styles.backButtonImage} />
            <Polygon
              points={`0,0 ${backButtonWidth},0 ${backButtonWidth},${backButtonHeight} 0,${backButtonHeight}`}
              onPressIn={() => navigation.goBack()}
            />
          </Svg>)}

         <CoinsButton onPress={() => navigation.navigate('Shop')}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    alignItems: 'center',
  },

  headerOutline: {
    width: '100%',
    height: 91,
    borderBottomWidth: 3,
    borderBottomColor: '#FF2F00',
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 0,
    backgroundColor: '#0B0029',
  },

  topLogo: {
    width: "50%",
    height: "80%",
    resizeMode: 'contain',
  },

  coinsButton: {
    marginRight: 0,
  },

  backText: {
    color: '#00E5FF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  backButtonImage: {
    resizeMode: 'contain',
    width: "100%",
    height: "100%",
  },
});

export default HeaderBar;