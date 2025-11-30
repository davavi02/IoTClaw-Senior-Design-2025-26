// components/PrizeCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { Prize } from "../types/prize";

type PolaroidProps = {
  image: string;
};

const Polaroid: React.FC<PolaroidProps> = ({ image }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
      width: 120,
      height: 140,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "start",
    backgroundColor: "#E0E0E0",
  },
  image: {
    width: 110,
    height: 110,
    marginTop: 6
  },
});

export default Polaroid;
