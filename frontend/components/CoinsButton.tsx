import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import coinIcon from '../assets/coin.png';
import useUserDataStore from '../stores/UserDataStore';

type Props = {
  onPress?: () => void;
};


export default function CoinsButton({onPress }: Props) {

  const {numTokens} = useUserDataStore();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <Image source={coinIcon} style={styles.coin} />
        <Text style={styles.amount}>{numTokens}</Text>

        {/* Spacer that forces + to right */}
        <View style={{ flex: 1 }} />

        <Ionicons name="add-circle-outline" size={22} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
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
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 1, // ***THIS MAKES IT TIGHT LIKE YOUR IMAGE***
  },
  amount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 30, // keeps the number tight before spacing
  },
});
