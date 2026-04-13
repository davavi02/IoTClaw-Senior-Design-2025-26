import { View, StyleSheet } from "react-native";
import DropClawButton from "./DropClawButton";
import PlayDirectionalButtons from "./PlayDirectionalButtons";
import { useEffect } from "react";
import useUserDataStore from "../stores/UserDataStore";

type ArcadeControlProps = {
  width: number
};

const ArcadeControllerView: React.FC<ArcadeControlProps> = ({width}) => {
  const updateTokens = useUserDataStore((state) => state.updateTokens);

  useEffect(() => {
    updateTokens();
  }, []);

  return (
  <View style={styles.cont}>
    <View style={styles.dropButtonWrap}>
      <DropClawButton size={width*0.7} />
    </View>

    <View style={styles.directionalButtonsWrap}>
      <PlayDirectionalButtons size = {width*0.8}/>
    </View>
  </View>)
};

export default ArcadeControllerView;


const styles = StyleSheet.create({
  cont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  directionalButtonsWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },

  dropButtonWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
});
