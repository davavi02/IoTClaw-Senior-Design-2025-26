import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Polygon, Rect } from "react-native-svg";
import useWebsocketStore from "../stores/WebsocketStore";

const DPAD_SIZE = 170;

const C_BG = "transparent";
const C_UNPRESSED = "#F5C300";
const C_PRESSED = "#ff5722";
const C_BORDER = "#070118";

const S = 220;
const GAP = S / 25;
const CG = S / 6;
const C = S / 2;

const PTS = {
  up: `${GAP},0 ${S - GAP},0 ${C + CG / 2},${C - CG / 2 - GAP} ${C - CG / 2},${C - CG / 2 - GAP}`,
  left: `0,${GAP} 0,${S - GAP} ${C - CG / 2 - GAP},${C + CG / 2} ${C - CG / 2 - GAP},${C - CG / 2}`,
  down: `${GAP},${S} ${S - GAP},${S} ${C + CG / 2},${C + CG / 2 + GAP} ${C - CG / 2},${C + CG / 2 + GAP}`,
  right: `${S},${GAP} ${S},${S - GAP} ${C + CG / 2 + GAP},${C + CG / 2} ${C + CG / 2 + GAP},${C - CG / 2}`,
} as const;

type Direction = "up" | "down" | "left" | "right";

type PlayDirectionalButtonsProps = {
  pressUp: () => void;
  pressDown: () => void;
  pressLeft: () => void;
  pressRight: () => void;
  cancelMove: () => void;
};

const PlayDirectionalButtons: React.FC<PlayDirectionalButtonsProps> = ({
  pressUp,
  pressDown,
  pressLeft,
  pressRight,
  cancelMove,
}) => {
  const isConnected = useWebsocketStore((state) => state.isConnected);
  const [pressed, setPressed] = useState<Direction | null>(null);

  const handlePressIn = (direction: Direction) => {
    if (!isConnected) return;

    setPressed(direction);

    switch (direction) {
      case "up":
        pressUp();
        break;
      case "down":
        pressDown();
        break;
      case "left":
        pressLeft();
        break;
      case "right":
        pressRight();
        break;
    }
  };

  const handlePressOut = () => {
    if (!isConnected) return;

    setPressed(null);
    cancelMove();
  };

  const fillFor = (direction: Direction) =>
    pressed === direction ? C_PRESSED : C_UNPRESSED;

  return (
    <View style={styles.controlsOverlay}>
      <View style={[styles.dpad, { opacity: isConnected ? 1 : 0.35 }]}>
        <Svg width={DPAD_SIZE} height={DPAD_SIZE} viewBox={`0 0 ${S} ${S}`}>
          <Rect x="0" y="0" width={S} height={S} fill={C_BG} />

          <Polygon
            points={PTS.up}
            fill={fillFor("up")}
            stroke={C_BORDER}
            strokeWidth={6}
            onPressIn={() => handlePressIn("up")}
            onPressOut={handlePressOut}
          />

          <Polygon
            points={PTS.left}
            fill={fillFor("left")}
            stroke={C_BORDER}
            strokeWidth={2}
            onPressIn={() => handlePressIn("left")}
            onPressOut={handlePressOut}
          />

          <Polygon
            points={PTS.down}
            fill={fillFor("down")}
            stroke={C_BORDER}
            strokeWidth={6}
            onPressIn={() => handlePressIn("down")}
            onPressOut={handlePressOut}
          />

          <Polygon
            points={PTS.right}
            fill={fillFor("right")}
            stroke={C_BORDER}
            strokeWidth={6}
            onPressIn={() => handlePressIn("right")}
            onPressOut={handlePressOut}
          />


        </Svg>
      </View>
    </View>
  );
};

export default PlayDirectionalButtons;

const styles = StyleSheet.create({
  controlsOverlay: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },

  dpad: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
    backgroundColor: "transparent",
  },
});