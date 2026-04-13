import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";
import HeaderBar from "./HeaderBar";
import useWebsocketStore from "../stores/WebsocketStore";
import arcadeMachine from "../assets/ArcadeBackground.png";
import SwitchCameraButton from "./SwitchCameraButton";
import { OutgoingMessages } from "../types/OutgoingMessages";
import ArcadeControllerView from "./ArcadeControllerView";
import JoinQueueView from "./JoinQueueView";
import WaitingInQueueView from "./WaitingInQueueView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PlayScreen: React.FC<PlayProps> = ({ navigation, route }) => {
  var { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  width = width - insets.left - insets.right;
  height = height - insets.top - insets.bottom;
  const aspectRatio = width / height;
  const heightAfterHeader = height * 0.92; // Subtract header height for layout calculations
  const streamFrameHeight = heightAfterHeader * 0.58;
  const streamFrameWidth = width * (11 / 15);
  const streamFrameTop = heightAfterHeader * 0.098;
  const controlsWidth = width * 0.9;
  const controlsBottom = 0;
  const heightOfControls = (heightAfterHeader - streamFrameTop - streamFrameHeight);
  const controlsHeight = heightOfControls * 1;
  const controllerWidth = heightOfControls * aspectRatio ** 0.4 * 1.1;

  const { cab } = route.params;
  const STREAM_URL = "http://34.174.255.99:8889/" + cab.name;
  const WS_URL = "ws://34.174.243.193:20206/api/join/" + cab.name;

  const connect = useWebsocketStore((state) => state.connectToServer);
  const disconnect = useWebsocketStore((state) => state.disconnect);
  const sendBytes = useWebsocketStore((state) => state.sendBytes);
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
    <View style= {styles.bkg}>
      <View style={styles.container}>
        <View style={{ borderWidth: 0, borderBottomColor: 'rgba(0, 229, 255, 0.96)' , opacity: 0.5 }}>
          <HeaderBar height={height * 0.08} />
        </View>

        <View style={styles.mainArea}>
          <View style={styles.machineArea}>
            {/* Bottom layer: stream */}
            <View style={styles.streamWrap}>
              <View
                style={[
                  styles.streamFrame,
                  {
                    height: streamFrameHeight,
                    width: streamFrameWidth,
                    top: streamFrameTop,
                  },
                ]}
              >
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
              <Image
                source={arcadeMachine}
                style={[
                  styles.arcadeImage,
                  {
                    height: heightAfterHeader,
                    width,
                  },
                ]}
              />
            </View>

            {/* Top layer: controls */}
            <View
              style={[
                styles.controlsContainer,
                {
                  bottom: controlsBottom,
                  height: heightOfControls,
                  width,
                },
              ]}
            >

                <View style={styles.switchCameraWrap}>
                  { ((queuePos !== null) && (queuePos <= 1)) &&
                    <SwitchCameraButton size={width*0.22}/>}
                </View>

                <View
                  style={[
                    styles.controlsOverlay,
                    {
                      height: controlsHeight,
                      width: controlsWidth,
                    },
                  ]}
                >
                    { (queuePos === null) ? (<JoinQueueView cabCost={cab.cost}/>)
                        : (queuePos <= 1) ? (<ArcadeControllerView width={controllerWidth}/>) : (<WaitingInQueueView/>)
                    }
                </View>

            </View>
          </View>

          {/* <View style={styles.statusWrap}>
            {lastError ? (
              <Text style={styles.statusText}>Error: {lastError}</Text>
            ) : null}

            {typeof lastMessage === "string" ? (
              <Text style={styles.statusText}>Last Message: {lastMessage}</Text>
            ) : null}
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  bkg: {
    backgroundColor: '#0B0027',
    resizeMode: "stretch",
    height: "100%",
    width:"100%",
  },
  container: {
    flex: 1,
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
    // aspectRatio: 44/60,
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
    borderWidth: 0,
    borderColor: "rgba(0, 229, 255, 0.96)",
    alignItems: "center",
    zIndex: 5,
  },

  arcadeImage: {
    resizeMode: "stretch",
  },

  controlsContainer: {
    position: "absolute",
    zIndex: 10,
    //flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    //paddingHorizontal: 24,
    paddingBottom: "0%",
  },

  controlsOverlay: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  switchCameraWrap: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: "15%",
    paddingBottom: "2%",

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
