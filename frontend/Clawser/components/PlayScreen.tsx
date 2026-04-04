import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";
import Background from "./Background";
import HeaderBar from "./HeaderBar";
import useWebsocketStore from "../stores/WebsocketStore";
import arcadeMachine from "../assets/ArcadeBackground.png";
import SwitchCameraButton from "./SwitchCameraButton";
import { OutgoingMessages } from "../types/OutgoingMessages";
import ArcadeControllerView from "./ArcadeControllerView";
import useUserDataStore from "../stores/UserDataStore";
import JoinQueueView from "./JoinQueueView";
import WaitingInQueueView from "./WaitingInQueueView";

const { width, height } = Dimensions.get("window");

const PlayScreen: React.FC<PlayProps> = ({ navigation, route }) => {
  const { cab } = route.params;
  const STREAM_URL = "http://video-server.babid.net:8889/" + cab.name;
  const WS_URL = "ws://34.174.243.193:20206/api/join/" + cab.name;

  const connect = useWebsocketStore((state) => state.connectToServer);
  const disconnect = useWebsocketStore((state) => state.disconnect);
  //const sendBytes = useWebsocketStore((state) => state.sendBytes);
  const isConnected = useWebsocketStore((state) => state.isConnected);
  const lastMessage = useWebsocketStore((state) => state.lastMessage);
  const lastError = useWebsocketStore((state) => state.lastError);
  const notificationMessage = useWebsocketStore((state) => state.notificationMessage);
  const queuePos = useWebsocketStore((state) => state.queuePosition);
  const send = useWebsocketStore((state) => state.sendCommand);

  useEffect(() => {
    connect(WS_URL);

    return () => {
      console.log("Leaving screen, closing socket...");
      disconnect();
    };
  }, [WS_URL, connect, disconnect]);

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.headerOverlay}>
          <HeaderBar />
        </View>

        <View style={styles.mainArea}>
          <View style={styles.machineArea}>
            {/* Bottom layer: stream */}
            <View style={styles.streamWrap}>
              <View style={styles.streamFrame}>
                <WebView
                  source={{ uri: STREAM_URL }}
                  style={styles.webview}
                  javaScriptEnabled
                  domStorageEnabled
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  originWhitelist={["*"]}
                  mixedContentMode="always"
                  onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn("WebView error: ", nativeEvent);
                  }}
                />
              </View>
            </View>

            {/* Middle layer: arcade background */}
            <View style={styles.arcadeOverlay}>
              <Image source={arcadeMachine} style={styles.arcadeImage} />
            </View>

            {/* Top layer: controls */}
            <View style={styles.controlsContainer}>

                <View style={styles.switchCameraWrap}>
                  { ((queuePos !== null) && (queuePos <= 1)) &&
                    <SwitchCameraButton onPress={()=>{send(OutgoingMessages.ChangeCamera)}} size={width*0.22}/>}
                </View>
                
                <View style={styles.controlsOverlay}>
                    { (queuePos === null) ? (<JoinQueueView cabCost={cab.cost}/>)
                        : (queuePos <= 1) ? (<ArcadeControllerView width={width}/>) : (<WaitingInQueueView/>)
                    }
                </View>

            </View>
          </View>

          <View style={styles.statusWrap}>
            {lastError ? (
              <Text style={styles.statusText}>Error: {lastError}</Text>
            ) : null}

            {typeof lastMessage === "string" ? (
              <Text style={styles.statusText}>Last Message: {lastMessage}</Text>
            ) : null}
          </View>
        </View>
      </View>
    </Background>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerOverlay: {
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },

  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  machineArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  streamWrap: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: "center",
    zIndex: 1,
  },

  streamFrame: {
    height: height*.51,
    aspectRatio: 44/66,
    top: height * .080,
    marginLeft: 3.5,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.96)",
    backgroundColor: "#000",
    zIndex: 2,
  },

  webview: {
    width: "100%",
    height: "100%",
  },
  
  arcadeOverlay: {
    position: "absolute",
    left: 0, right: 0, top: 0, bottom: 0,
    alignItems: "center",
    zIndex: 5,
  },

  arcadeImage: {
    height: "100%",
    aspectRatio: 1,
    resizeMode: "contain",
  },

  controlsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.55,
    bottom: 0,
    //width: width,
    zIndex: 10,
    //flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    //paddingHorizontal: 24,
    paddingBottom: "4%",
  },

  controlsOverlay: {
    //flex: 1,
    height: height * .25,
    width: height * 0.42,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "80%",
  },

  switchCameraWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: "10%",
    marginBottom: "13%",
  },

  statusWrap: {
    marginTop: 16,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  statusText: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
    textAlign: "center",
  },

});
