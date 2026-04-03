import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsButton from './CoinsButton';
import ClawzerTitle from '../assets/ClawzerTitle.png';

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
          (<TouchableOpacity onPress={() => navigation.goBack()}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>)}

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
    width: 133,
    height: 45,
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
});

export default HeaderBar;