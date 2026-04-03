import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

const PlayScreen: React.FC<PlayProps> = ({ navigation, route }) => {
  const { cab } = route.params;
  const STREAM_URL = "http://video-server.babid.net:8889/" + cab;
  const WS_URL = "ws://34.174.243.193:20206/api/join/" + cab;

  const connect = useWebsocketStore((state) => state.connectToServer);
  const disconnect = useWebsocketStore((state) => state.disconnect);
  //const sendBytes = useWebsocketStore((state) => state.sendBytes);
  const isConnected = useWebsocketStore((state) => state.isConnected);
  const lastMessage = useWebsocketStore((state) => state.lastMessage);
  const lastError = useWebsocketStore((state) => state.lastError);
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
                <SwitchCameraButton onPress={()=>{send(OutgoingMessages.ChangeCamera)}} size={width*0.22}/>
              </View>


              <View style={styles.controlsOverlay}>
                <ArcadeControllerView width={width}/>
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },

  mainArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 0,
  },

  machineArea: {
    position: "relative",
    width: width,
    height: Math.min(height * 0.75, 760),
    alignItems: "center",
    justifyContent: "flex-start",
  },

  streamWrap: {
    position: "absolute",
    top: 100,
    alignItems: "center",
    zIndex: 1,
  },

  streamFrame: {
    width: Math.min(width * 0.8, 420),
    aspectRatio: 100 / 135,
    top: 30,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 4,
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
    top: 0,
    flex: 1,
    width: "100%",
    height: Math.min(height * 0.89, 1760),
    zIndex: 5,
  },

  arcadeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },

  controlsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: height * 0.57,
    width: width,
    zIndex: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  controlsOverlay: {
    width: width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
  },



  switchCameraWrap: {
    width: "100%",
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
