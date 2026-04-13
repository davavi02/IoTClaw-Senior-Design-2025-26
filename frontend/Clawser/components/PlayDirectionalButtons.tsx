import React, { useMemo, useState } from "react";
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
import { OutgoingMessages } from "../types/OutgoingMessages";

const C_BG = "transparent";
const VIEWBOX_SIZE = 220;
const buttonRatio = 30 / 64;

type Direction = "up" | "down" | "left" | "right";

type PlayDirectionalButtonsProps = {
  size: number;
};

const PlayDirectionalButtons: React.FC<PlayDirectionalButtonsProps> = ({ size }) => {
  const isConnected = true; //useWebsocketStore((state) => state.isConnected);
  const send = useWebsocketStore((state) => state.sendCommand);

  const [leftPressed, setLeftPressed] = useState(false);
  const [rightPressed, setRightPressed] = useState(false);
  const [upPressed, setUpPressed] = useState(false);
  const [downPressed, setDownPressed] = useState(false);

  const dpadSize = size;

  const { gap, cg, c, pts } = useMemo(() => {
    const S = VIEWBOX_SIZE;
    const gap = S / 25;
    const cg = S / 13;
    const c = S / 2;

    const pts = {
      up: `${gap},0 ${S - gap},0 ${c + cg / 2},${c - cg / 2 - gap} ${c - cg / 2},${c - cg / 2 - gap}`,
      left: `0,${gap} 0,${S - gap} ${c - cg / 2 - gap},${c + cg / 2} ${c - cg / 2 - gap},${c - cg / 2}`,
      down: `${gap},${S} ${S - gap},${S} ${c + cg / 2},${c + cg / 2 + gap} ${c - cg / 2},${c + cg / 2 + gap}`,
      right: `${S},${gap} ${S},${S - gap} ${c + cg / 2 + gap},${c + cg / 2} ${c + cg / 2 + gap},${c - cg / 2}`,
    } as const;

    return { gap, cg, c, pts };
  }, []);

  const handlePressIn = (direction: Direction) => {
    if (!isConnected) return;

    switch (direction) {
      case "up":
        send(OutgoingMessages.Up);
        setUpPressed(true);
        setDownPressed(false);
        setLeftPressed(false);
        setRightPressed(false);
        break;
      case "down":
        send(OutgoingMessages.Down);
        setDownPressed(true);
        setUpPressed(false);
        setLeftPressed(false);
        setRightPressed(false);
        break;
      case "left":
        send(OutgoingMessages.Left);
        setLeftPressed(true);
        setUpPressed(false);
        setDownPressed(false);
        setRightPressed(false);
        break;
      case "right":
        send(OutgoingMessages.Right);
        setRightPressed(true);
        setUpPressed(false);
        setDownPressed(false);
        setLeftPressed(false);
        break;
    }
  };

  const handlePressOut = () => {
    if (!isConnected) return;

    setDownPressed(false);
    setLeftPressed(false);
    setRightPressed(false);
    setUpPressed(false);
    send(OutgoingMessages.StopMovement);
  };

  return (
    <View style={styles.controlsOverlay}>
      <View
        style={[
          styles.dpad,
          {
            width: dpadSize,
            height: dpadSize,
            opacity: isConnected ? 1 : 0.35,
          },
        ]}
      >
        <Svg width={dpadSize} height={dpadSize} viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}>
          <Rect x="0" y="0" width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill={C_BG} />

          <Image
            source={upPressed ? upButtonPressed : upButtonUnpressed}
            style={{
              position: "absolute",
              top: -gap / 2,
              left: 0,
              width: dpadSize,
              height: dpadSize * buttonRatio,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
          />

          <Polygon
            points={pts.up}
            onPressIn={() => handlePressIn("up")}
            onPressOut={handlePressOut}
          />

          <Image
            source={leftPressed ? leftButtonPressed : leftButtonUnpressed}
            style={{
              position: "absolute",
              top: 0,
              left: -gap / 2,
              width: dpadSize * buttonRatio,
              height: dpadSize,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
          />

          <Polygon
            points={pts.left}
            onPressIn={() => handlePressIn("left")}
            onPressOut={handlePressOut}
          />

          <Image
            source={downPressed ? downButtonPressed : downButtonUnpressed}
            style={{
              position: "absolute",
              bottom: -gap / 2,
              left: 0,
              width: dpadSize,
              height: dpadSize * buttonRatio,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
          />

          <Polygon
            points={pts.down}
            onPressIn={() => handlePressIn("down")}
            onPressOut={handlePressOut}
          />

          <Image
            source={rightPressed ? rightButtonPressed : rightButtonUnpressed}
            style={{
              position: "absolute",
              top: 0,
              right: -gap / 2,
              width: dpadSize * buttonRatio,
              height: dpadSize,
              transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
            }}
          />

          <Polygon
            points={pts.right}
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 0,
  },
  dpad: {
    backgroundColor: "transparent",
  },
});
