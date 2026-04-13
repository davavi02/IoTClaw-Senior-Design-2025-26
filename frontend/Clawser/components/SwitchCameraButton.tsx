import React, { useState } from "react";
import { Pressable, Image, Text, StyleSheet, ViewStyle } from "react-native";
import SwitchCameraButtonUnpressed from "../assets/SwitchCameraButtonUnpressed.png";
import SwitchCameraButtonPressed from "../assets/SwitchCameraButtonPressed.png";

import useWebsocketStore from "../stores/WebsocketStore";
import { OutgoingMessages } from "../types/OutgoingMessages";

type SwitchCameraButtonProps = {
  disabled?: boolean;
  C_BORDER?: string;
  size?: number;
};

const SwitchCameraButton: React.FC<SwitchCameraButtonProps> = ({
  disabled = false,
  C_BORDER = "#070118",
  size = 80,
}) => {
  const [pressed, setPressed] = useState(false);
  const send = useWebsocketStore((state) => state.sendCommand);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => { send(OutgoingMessages.ChangeCamera); setPressed(true)}}
      onPressOut={() => { send(OutgoingMessages.CameraRelease); setPressed(false)}}
      style={[
        styles.button,
        {
          width: size,
          height: size / 2,
          opacity: 1,
        },
      ]}
    >
      <Image
        source={pressed ? SwitchCameraButtonPressed : SwitchCameraButtonUnpressed}
        style={{ width: size, height: size / 2 }}
      />
    </Pressable>
  );
};

export default SwitchCameraButton;

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
