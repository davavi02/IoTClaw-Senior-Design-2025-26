import React, { use , useEffect} from "react";
import { ImageBackground, Pressable } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";
import Background from "./Background";
import HeaderBar from "./HeaderBar";
import useWebsocketStore from "../stores/WebsocketStore";


const {width} = Dimensions.get("window");

const PlayScreen: React.FC<PlayProps> = ({ navigation, route }) => {

  const { cab } = route.params;
  const STREAM_URL = "http://video-server.babid.net:8889/" + cab;
  const WS_URL = "ws://34.174.243.193:20206/api/join/" + cab
  const connect = useWebsocketStore((state) => state.connectToServer);
  const disconnect = useWebsocketStore((state) => state.disconnect);
  const sendTextMessage = useWebsocketStore((state) => state.sendBinaryMessage);
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
    const cancelMove = () => {
      if (!isConnected) return;
      sendBytes([0]);
    };

    const coinButton = () => {
    if (!isConnected) return;
    sendBytes([7]);
    };

  return (
    <Background>
      <HeaderBar />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.streamWrap}>
        <View style={styles.streamFrame}>
          <WebView
            source={{ uri: STREAM_URL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
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

      <View style={styles.statusWrap}>
        <Text style={styles.statusText}>
          Status: {isConnected ? "Connected" : "Disconnected"}
        </Text>

        {lastError ? (
          <Text style={styles.statusText}>Error: {lastError}</Text>
        ) : null}

        {typeof lastMessage === "string" ? (
          <Text style={styles.statusText}>Last Message: {lastMessage}</Text>
        ) : null}
      </View>

      <View style={styles.container}>
        <Pressable style={styles.controlButton} onPressIn={handleMoveUp} onPressOut={cancelMove}>
          <Text style={styles.buttonText}>Up</Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPressIn={coinButton}>
          <Text style={styles.buttonText}>Coin</Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPressIn={handleMoveDown} onPressOut={cancelMove}>
          <Text style={styles.buttonText}>Down</Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPressIn={handleMoveLeft} onPressOut={cancelMove}>
          <Text style={styles.buttonText}>Left</Text>
        </Pressable>

        <Pressable style={styles.controlButton} onPressIn={handleMoveRight} onPressOut={cancelMove}>
          <Text style={styles.buttonText}>Right</Text>
        </Pressable>

      </View>
    </Background>)
};

export default PlayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "#000",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  streamWrap: {
    alignItems: "center",
    marginTop: 100,
  },

  streamFrame: {
    width: Math.min(width, 420),
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(0, 229, 255, 0.96)",
  },

  webview: {
    width: "100%",
    height: "100%",
  },

  statusWrap: {
    alignItems: "center",
    marginTop: 16,
  },

  statusText: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
  },

  controlButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

    coinButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
}
);
