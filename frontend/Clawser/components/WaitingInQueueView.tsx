import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import DropClawButton from "./DropClawButton";
import PlayDirectionalButtons from "./PlayDirectionalButtons";
import useWebsocketStore from "../stores/WebsocketStore";
import { OutgoingMessages } from "../types/OutgoingMessages";
type WaitingInQueueViewProps = {
};

const WaitingInQueueView: React.FC<WaitingInQueueViewProps> = ({}) => {
  const send = useWebsocketStore((state) => state.sendCommand);
  const queuePos = useWebsocketStore((state) => state.queuePosition);

  return (
  <View style={styles.cont}>
    <Text style={styles.btnText}>Your position in queue is: {queuePos-1}.</Text>
    <TouchableOpacity style={styles.playbtn} onPressOut={()=>{send(OutgoingMessages.LeaveQueue)}}>
      <Text style={styles.btnText}>Leave Queue</Text>
    </TouchableOpacity>
  </View>)
};

export default WaitingInQueueView;


const styles = StyleSheet.create({
  cont: {
    flex: 1,
    marginTop: 50,
    flexDirection: "column",
    alignItems: "center",
  },
  playbtn: {
    width: 120,
    height: 40,
    borderWidth: 2,
    marginTop: 20,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFF00",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  }
});
