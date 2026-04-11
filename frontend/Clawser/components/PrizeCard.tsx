import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import type { Prize } from "../types/prize";
import Polaroid from "./Polaroid";
import deliveredBg from "../assets/PrizeDelivered.png";
import shippedBg from "../assets/PrizeShipped.png";
import defaultBg from "../assets/PrizeDefault.png";

type PrizeCardProps = {
  prize: Prize;
};

const getBackgroundForPrize = (prize: Prize) => {
  if (prize.isDelivered) return deliveredBg;
  if (prize.isShipped) return shippedBg;
  return defaultBg;
};

const PrizeCard: React.FC<PrizeCardProps> = ({ prize }) => {
  const { name, description, dateWon, imageUrl } = prize;
  const formattedDate = new Date(dateWon).toLocaleDateString();

  return (
    <ImageBackground
      source={getBackgroundForPrize(prize)}
      style={styles.cardBackground}
      imageStyle={styles.cardBackgroundImage}
    >
      <View style={styles.contentRow}>
        <View style={styles.polaroidWrapper}>
          <Polaroid image={imageUrl} />
        </View>

        <View style={styles.info}>
          <View style={styles.topBlock}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.nameUnderline} />
            <Text style={styles.description} numberOfLines={5}>
              {description}
            </Text>
          </View>

          <View style={styles.bottomBlock}>
            <Text style={styles.date}>Won on {formattedDate}</Text>
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
  cardBackgroundImage: {
    marginLeft: -18,
  },
  contentRow: {
    flexDirection: "row",
  },
  polaroidWrapper: {
    marginLeft: 30,
    marginTop: 30,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between", // topBlock at top, bottomBlock at bottom
    alignItems: "center",
    paddingRight: 50,
    marginTop: 30,
  },
  topBlock: {
    alignItems: "center",
  },
  bottomBlock: {
    marginBottom: 20, // tweak as needed
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: 1,
  },
  nameUnderline: {
    height: 3,
    width: 200,
    backgroundColor: "#E0E0E0",
    marginTop: 2,
  },
  description: {
    textAlign: "center",
    fontSize: 14,
    color: "#E0E0E0",
    marginTop: 10,
    paddingHorizontal: 2,
  },
  date: {
    fontSize: 12,
    color: "#8AAAE5",
  },
});

export default PrizeCard;
