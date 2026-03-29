import React, { useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Switch,
} from "react-native";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";
import Background from "./Background";
import HeaderBar from "./HeaderBar";
import useWebsocketStore from "../stores/WebsocketStore";
import PlayDirectionalButtons from "./PlayDirectionalButtons";
import DropClawButton from "./DropClawButton";
import arcadeMachine from "../assets/ArcadeBackground.png";
import SwitchCameraButton from "./SwitchCameraButton";

const { width, height } = Dimensions.get("window");

const PlayScreen: React.FC<PlayProps> = ({ navigation, route }) => {
  const { cab } = route.params;
  const STREAM_URL = "http://video-server.babid.net:8889/" + cab;
  const WS_URL = "ws://34.174.243.193:20206/api/join/" + cab;

  const connect = useWebsocketStore((state) => state.connectToServer);
  const disconnect = useWebsocketStore((state) => state.disconnect);
  const sendBytes = useWebsocketStore((state) => state.sendBytes);
  const isConnected = useWebsocketStore((state) => state.isConnected);
  const lastMessage = useWebsocketStore((state) => state.lastMessage);
  const lastError = useWebsocketStore((state) => state.lastError);

  useEffect(() => {
    connect(WS_URL);

    return () => {
      console.log("Leaving screen, closing socket...");
      disconnect();
    };
  }, [WS_URL, connect, disconnect]);

  const cancelMove = () => {
    if (!isConnected) return;
    sendBytes([0]);
  };

  const handleMoveUp = () => {
    if (!isConnected) return;
    sendBytes([1]);
  };

  const handleMoveDown = () => {
    if (!isConnected) return;
    sendBytes([2]);
  };

  const handleMoveLeft = () => {
    if (!isConnected) return;
    sendBytes([3]);
  };

  const handleMoveRight = () => {
    if (!isConnected) return;
    sendBytes([4]);
  };

  const coinButton = () => {
    if (!isConnected) return;
    sendBytes([7]);
  };

  const switchCamera = () => {
    if (!isConnected) return;
    sendBytes([8]);
  };

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.headerOverlay}>
          <HeaderBar />
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

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
                <SwitchCameraButton onPress={switchCamera} size={width*0.22}></SwitchCameraButton>
              </View>


              <View style={styles.controlsOverlay}>
                <View style={styles.dropButtonWrap}>
                  <DropClawButton onPress={coinButton} size={width*0.3} />
                </View>

                <View style={styles.directionalButtonsWrap}>
                  <PlayDirectionalButtons
                    pressUp={handleMoveUp}
                    pressDown={handleMoveDown}
                    pressLeft={handleMoveLeft}
                    pressRight={handleMoveRight}
                    cancelMove={cancelMove}
                  />
                </View>
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

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 50,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
