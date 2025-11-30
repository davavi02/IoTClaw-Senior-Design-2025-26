import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoinsButton from './CoinsButton';

export default function HeaderBar() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
        {/* If I want to put a search bar I can do it here */}
      <View/>
      <View style={styles.coinsContainer}>
        <CoinsButton onPress={() => navigation.navigate('Shop')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(0, 229, 255, 0.96)',
    height: 90,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0B0029', // dark navy background
  },
  coinsContainer: {
    marginTop: 0,
    marginRight: 15,
  },
});
