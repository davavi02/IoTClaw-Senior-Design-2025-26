import React, { useState } from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";

type DropClawButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  C_UNPRESSED?: string;
  C_PRESSED?: string;
  C_BORDER?: string;
  size?: number;
};

const DropClawButton: React.FC<DropClawButtonProps> = ({
  onPress,
  disabled = false,
  C_UNPRESSED = "#2f15a1",
  C_PRESSED = "#00e5ff",
  C_BORDER = "#070118",
  size = 80,
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
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
          backgroundColor: pressed ? C_PRESSED : C_UNPRESSED,
        },
      ]}
    >
      <Text style={[styles.text, {color: pressed ? "#000" : "#fff", borderColor: C_BORDER, fontSize: size * 0.2}]}>DROP</Text>
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