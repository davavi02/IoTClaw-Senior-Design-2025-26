import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";


const {width} = Dimensions.get("window");
const STREAM_URL = "http://34.174.255.99:8888/test";


const PlayScreen: React.FC<PlayProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.root}>

        {/* Back Button*/}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
            <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Stream window */}
      <View style={styles.streamWrap}>
        <View style={styles.streamFrame}>
          <WebView
            source={{ uri: STREAM_URL }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true} // Added for better compatibility
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            originWhitelist={['*']} // Important: allows the WebView to load non-HTTPS content
            mixedContentMode="always" // Specifically for Android to allow HTTP on HTTPS apps
            onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
        }}
          />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Play Screen</Text>
        <Text>Put your claw-machine controls here 👇</Text>
      </View>
    </SafeAreaView>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 28, fontWeight: "bold", marginBottom: 10 },

      backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex:10,
        backgroundColor: "#000",
        paddingHorizontal: 15,
        paddingVertical: 5,
      
    },

      backText:{
        color:"#fff",
        fontSize: 18,
        fontWeight: "bold",
      },

    streamWrap: 
    {
    alignItems: "center",
    marginTop: 70, // adjust so it sits under your back button
    },
    streamFrame: 
    {
    width: Math.min(width * 0.92, 420),
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(0, 229, 255, 0.96)",
    },
    webview: { width: "100%", height: "100%" },

    body: { flex: 1 },

}
);
