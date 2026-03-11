import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import type { CabinentData } from "../types/CabinentData";
import deliveredBg from "../assets/PrizeDelivered.png";
import Polaroid from "./Polaroid";

type CabCardProps = {
  data: CabinentData;
  onPressCallback: (name: string) => void;
};

const CabinentCard: React.FC<CabCardProps> = ({ data, onPressCallback }) => {
  const { name, description, cost } = data;

  return (
    <ImageBackground source={deliveredBg} style={styles.cardBackground}>
      <View style={styles.contentRow}>
        <View style={styles.polaroidWrapper}>
          <Polaroid image="https://picsum.photos/seed/claw/200/200" />
        </View>

        <View style={styles.info}>
          <View style={styles.topBlock}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.nameUnderline} />
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          </View>

          <View style={styles.bottomBlock}>
            <Text style={styles.costText}>Cost: {cost} Tokens</Text>
            
            <TouchableOpacity 
              style={styles.playbtn} 
              onPress={() => onPressCallback(name)}
            >
              <Text style={styles.btnText}>Play!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardBackground: {
    height: 280,
    width: 450,
  },
  contentRow: {
    flexDirection: "row",
  },
  polaroidWrapper: {
    marginLeft: 46,
    marginTop: 30,
  },
  info: {
    flex: 1,
    paddingRight: 50,
    marginTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  topBlock: {
    alignItems: "center",
  },
  bottomBlock: {
    marginBottom: 30,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
  },
  nameUnderline: {
    height: 3,
    width: 200,
    backgroundColor: "#E0E0E0",
    marginTop: 2,
    marginBottom: 5,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#E0E0E0",
  },
  costText: {
    fontSize: 14,
    color: "#8AAAE5",
    marginBottom: 8,
    fontWeight: '600',
  },
  playbtn: {
    width: 120,
    height: 40,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#5cf300",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default CabinentCard;