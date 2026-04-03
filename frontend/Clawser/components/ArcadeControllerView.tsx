import { View, StyleSheet } from "react-native";
import DropClawButton from "./DropClawButton";
import PlayDirectionalButtons from "./PlayDirectionalButtons";

type ArcadeControlProps = {
  width: number
};

const ArcadeControllerView: React.FC<ArcadeControlProps> = ({width}) => {
  return (
  <View style={styles.cont}>
    <View style={styles.dropButtonWrap}>
      <DropClawButton size={width*0.3} />
    </View>

    <View style={styles.directionalButtonsWrap}>
      <PlayDirectionalButtons/>
    </View>
  </View>)
};

export default ArcadeControllerView;


const styles = StyleSheet.create({
  cont: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  directionalButtonsWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  dropButtonWrap: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
});
