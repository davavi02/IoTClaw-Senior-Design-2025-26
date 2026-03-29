import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Polygon, Rect } from "react-native-svg";

const C_BG           = "#0D0D0D";
const C_UNPRESSED       = "#F5C300";
const C_PRESSED = "#00f7c5ff";

const S   = 220;
const GAP = S/25;
const CG = S/6;
const C   = S / 2;

const PTS = {
  // 0,0 is top left corner, S,S is bottom right
  up:    `${GAP},0    ${S-GAP},0    ${C+CG/2},${C - CG/2 - GAP}, ${C-CG/2},${C -CG/2- GAP}`,
  left:  `0,${GAP}    0,${S-GAP}    ${C-CG/2-GAP},${C + CG/2}, ${C-CG/2-GAP},${C - CG/2}`,
  down:  `${GAP},${S} ${S-GAP},${S} ${C+CG/2},${C +CG/2 +GAP} ${C-CG/2},${C +CG/2 +GAP}`,
  right: `${S},${GAP} ${S},${S-GAP} ${C+CG/2+GAP},${C +CG/2} ${C + CG/2 + GAP},${C - CG/2}`,
};

export type Direction = "up" | "down" | "left" | "right";

type TriangleButtonProps = {
  direction: Direction;
  size?: number;
  onPressIn?: () => void;
  onPressOut?: () => void;
};

const TriangleButton: React.FC<TriangleButtonProps> = ({
  direction,
  size = 220,
  onPressIn,
  onPressOut,
}) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => {
    setPressed(true);
    onPressIn?.();
  };

  const handlePressOut = () => {
    setPressed(false);
    onPressOut?.();
  };

  return (
    <Pressable style={{ width: size, height: size, position: "absolute", borderWidth: 3, borderColor: '#ff0000ff' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${S} ${S}`}>
        <Polygon
          points={PTS[direction]}
          fill={pressed ? C_PRESSED : C_UNPRESSED}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </Svg>
    </Pressable>
  );
};

export default TriangleButton;
