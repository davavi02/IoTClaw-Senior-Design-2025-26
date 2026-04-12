import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeIconDark from "../assets/icons/HomeIconDark.png";
import HomeIconLight from "../assets/icons/HomeIconLight.png";
import PrizePageIconLight from "../assets/icons/PrizePageIconLight.png";
import PrizePageIconDark from "../assets/icons/PrizePageIconDark.png";
import ProfilePageIconDark from "../assets/icons/ProfilePageIconDark.png";
import ProfilePageIconLight from "../assets/icons/ProfilePageIconLight.png";


type Props = {
  active: 'prize' | 'home' | 'profile';
  onPressMap?: () => void;
  onPressHome?: () => void;
  onPressProfile?: () => void;
  height: number;
};

export default function BottomNavBar({
  active,
  onPressMap,
  onPressHome,
  onPressProfile,
  height,
}: Props) {
  return (
    <View style={[styles.container, { height }]}>
      {/* Map */}
      <TouchableOpacity
        style={[styles.item, active === 'prize' && styles.activeItem]}
        onPress={onPressMap}
      >
        <Image
            style = {[styles.icons, {height: height * 0.8, width: height * 0.8}]}
            source = {active === 'prize' ? PrizePageIconDark : PrizePageIconLight}/>
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity
        style={[styles.item, active === 'home' && styles.activeItem]}
        onPress={onPressHome}
      >
        <Image
        style = {[styles.icons, {height: height * 0.8, width: height * 0.8}]}
        source = {active === 'home' ? HomeIconDark : HomeIconLight}/>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={[styles.item, active === 'profile' && styles.activeItem]}
        onPress={onPressProfile}
      >
        <Image
        style = {[styles.icons, {height: height * 0.8, width: height * 0.8}]}
        source = {active === 'profile' ? ProfilePageIconDark : ProfilePageIconLight}/>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      borderTopWidth: 3,
      borderTopColor: "rgba(0, 229, 255, 0.96)",
      flexDirection: 'row',
      backgroundColor: '#050038',       // dark navy background
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeItem: {
    backgroundColor: '#00D5FF',       // bright cyan like your screenshot
  },
  icons: {
      width: 55,
      height: 55,
  },
});
