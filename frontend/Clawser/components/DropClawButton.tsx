import React, { useState } from "react";
import { Pressable, Image, Text, StyleSheet, ViewStyle } from "react-native";
import dropButtonPressed from "../assets/DropButtonPressed.png";
import dropButtonUnpressed from "../assets/DropButtonUnpressed.png";

import useWebsocketStore from "../stores/WebsocketStore";
import { OutgoingMessages } from "../types/OutgoingMessages";


type DropClawButtonProps = {
  disabled?: boolean;
  C_UNPRESSED?: string;
  C_PRESSED?: string;
  C_BORDER?: string;
  size?: number;
};

const DropClawButton: React.FC<DropClawButtonProps> = ({
  disabled = false,
  C_UNPRESSED = "#2f15a1",
  C_PRESSED = "#00e5ff",
  C_BORDER = "#070118",
  size = 80,
}) => {
  const [pressed, setPressed] = useState(false);
  const send = useWebsocketStore((state) => state.sendCommand);


  return (
    <Pressable
      onPress={()=>{send(OutgoingMessages.DropClaw)}}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <Image source={pressed ? dropButtonPressed : dropButtonUnpressed} style={{ width: size, height: size }} />
    </Pressable>
  );
};

export default DropClawButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
  },

  text: {
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1,
  },
});