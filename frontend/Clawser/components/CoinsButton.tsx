 import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import coinIcon from '../assets/coin.png';
import useUserDataStore from '../stores/UserDataStore';

type Props = {
  onPress?: () => void;
  height?: number;
};


export default function CoinsButton({onPress, height}: Props) {
  height = height || 40;

  const {numTokens} = useUserDataStore();
  return (
    <TouchableOpacity style={[styles.container, {height}]} onPress={onPress}>
      <View style={styles.row}>
        <Image source={coinIcon} style={[styles.coin, {height: height, width: height * 0.5}]} />
        <Text style={[styles.amount, {fontSize: height * 0.45}]}>{numTokens}</Text>

        {/* Spacer that forces + to right */}
        <View style={{ flex: 1 }} />

        <Ionicons name="add-circle-outline" size={height * 0.6} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: '#0B0029',
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    zIndex: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coin: {
    resizeMode: 'contain',
    marginRight: 1, // ***THIS MAKES IT TIGHT LIKE YOUR IMAGE***
  },
  amount: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 15, // keeps the number tight before spacing
  },
});
