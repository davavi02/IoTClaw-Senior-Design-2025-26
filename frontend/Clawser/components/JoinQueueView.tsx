import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import useUserDataStore from "../stores/UserDataStore";
import useWebsocketStore from "../stores/WebsocketStore";
import { OutgoingMessages } from "../types/OutgoingMessages";
import { useEffect } from "react";

type JoinQueueViewProps = {
  cabCost: number
};

const JoinQueueView: React.FC<JoinQueueViewProps> = ({cabCost}) => {
  const numToken = useUserDataStore((state) => state.numTokens);
  const updateTokens = useUserDataStore((state) => state.updateTokens);
  const send = useWebsocketStore((state) => state.sendCommand);

  const displayInsuffFunds = ()=> {
    return(<><Text style={styles.btnText}>You need: {cabCost} tokens to join the queue.</Text>
      <Text style={styles.btnText}>Visit the token shop to get more!</Text></>) 
  };

  useEffect(() => {
    updateTokens();
  }, []);

  return (
    <View style={styles.cont}>
      { //Join queue section if you got the funds.
        (numToken >= cabCost) ? (
            <><Text style={styles.btnText}>Joining the queue costs: {cabCost} tokens.</Text>
            <TouchableOpacity style={styles.playbtn} onPressOut={()=>{send(OutgoingMessages.JoinQueue)}}>
              <Text style={styles.btnText}>Join Queue!</Text>
            </TouchableOpacity></>) : displayInsuffFunds()
      }
    </View>)
};

export default JoinQueueView;


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
    backgroundColor: "#5cf300",
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
