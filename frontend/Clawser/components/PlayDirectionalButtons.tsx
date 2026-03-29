import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Svg, { Polygon, Rect } from "react-native-svg";
import useWebsocketStore from "../stores/WebsocketStore";
import leftButtonPressed from "../assets/DpadButtonImages/LeftButtonPressed.png";
import leftButtonUnpressed from "../assets/DpadButtonImages/LeftButtonUnpressed.png";
import rightButtonPressed from "../assets/DpadButtonImages/RightButtonPressed.png";
import rightButtonUnpressed from "../assets/DpadButtonImages/RightButtonUnpressed.png";
import downButtonPressed from "../assets/DpadButtonImages/DownButtonPressed.png";
import downButtonUnpressed from "../assets/DpadButtonImages/DownButtonUnpressed.png";
import upButtonPressed from "../assets/DpadButtonImages/UpButtonPressed.png";
import upButtonUnpressed from "../assets/DpadButtonImages/UpButtonUnpressed.png";

const DPAD_SIZE = 170;

const C_BG = "transparent";

const S = 220;
const GAP = S / 25;
const CG = S / 13;
const C = S / 2;
const buttonRatio = 30/64;

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
  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);

  const handlePressIn = (direction: Direction) => {
    if (!isConnected) return;

    setPressed(direction);

    switch (direction) {
      case "up":
        pressUp();
        setUpPressed(true);
        setDownPressed(false);
        setLeftPressed(false);
        setRightPressed(false);
        break;
      case "down":
        pressDown();
        setDownPressed(true);
        setUpPressed(false);
        setLeftPressed(false);
        setRightPressed(false);
        break;
      case "left":
        pressLeft();
        setLeftPressed(true);
        setUpPressed(false);
        setDownPressed(false);
        setRightPressed(false);
        break;
      case "right":
        pressRight();
        setRightPressed(true);
        setUpPressed(false);
        setDownPressed(false);
        setLeftPressed(false);
        break;
    }
  };

  const handlePressOut = () => {
    if (!isConnected) return;

    setPressed(null);
    setDownPressed(false);
    setLeftPressed(false);
    setRightPressed(false);
    setUpPressed(false);
    cancelMove();
  };

  return (
    <View style={styles.controlsOverlay}>
      <View style={[styles.dpad, { opacity: isConnected ? 1 : 0.35 }]}>
        <Svg width={DPAD_SIZE} height={DPAD_SIZE} viewBox={`0 0 ${S} ${S}`}>
          <Rect x="0" y="0" width={S} height={S} fill={C_BG} />

          <Image source={upPressed? upButtonPressed : upButtonUnpressed} style={styles.upButton} />

          <Polygon
            points={PTS.up}
            onPressIn={() => handlePressIn("up")}
            onPressOut={handlePressOut}
          />

          <Image source={leftPressed? leftButtonPressed : leftButtonUnpressed} style={styles.leftButton} />

          <Polygon
            points={PTS.left}
            onPressIn={() => handlePressIn("left")}
            onPressOut={handlePressOut}
          />

          <Image source={downPressed? downButtonPressed : downButtonUnpressed} style={styles.downButton} />

          <Polygon
            points={PTS.down}
            onPressIn={() => handlePressIn("down")}
            onPressOut={handlePressOut}
          />

          <Image source={rightPressed? rightButtonPressed : rightButtonUnpressed} style={styles.rightButton} />

          <Polygon
            points={PTS.right}
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
    paddingBottom: 0,
  },

  dpad: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
    backgroundColor: "transparent",
  },

  leftButton: {
    position: "absolute",
    top: 0,
    left: -GAP/2,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    width: DPAD_SIZE * buttonRatio,
    height: DPAD_SIZE,
  },

  rightButton: {
    position: "absolute",
    top: 0,
    right: -GAP/2,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    width: DPAD_SIZE * buttonRatio,
    height: DPAD_SIZE,
  },
  
  downButton: {
    position: "absolute",
    bottom: -GAP/2,
    left: 0,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    width: DPAD_SIZE,
    height: DPAD_SIZE * buttonRatio,
  },

  upButton: {
    position: "absolute",
    top: -GAP/2,
    left: 0,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    width: DPAD_SIZE,
    height: DPAD_SIZE*buttonRatio,
  },

});
