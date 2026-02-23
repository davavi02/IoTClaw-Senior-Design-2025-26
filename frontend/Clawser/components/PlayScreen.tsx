import React from "react";
import { ImageBackground, Pressable } from "react-native";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { PlayProps } from "./Routes";
import Background from "./Background";
import HeaderBar from "./HeaderBar";



const {width} = Dimensions.get("window");
const STREAM_URL = "http://34.174.255.99:8889/test";


const PlayScreen: React.FC<PlayProps> = ({ navigation }) => {
  return (
      <Background>
        <HeaderBar/>
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
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}>
          <Text>Up</Text>
        </Pressable>
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}>
          <Text>Down</Text>
        </Pressable>
    borderColor: "rgba(0, 229, 255, 0.96)",
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}>
          <Text>Left</Text>
        </Pressable>
        <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}>
          <Text>Up</Text>
        </Pressable>
      </View>
      </Background>
  );
};

export default PlayScreen;

const styles = StyleSheet.create({
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
    marginTop: 100, // adjust so it sits under your back button
    },
    streamFrame: 
    {
    width: Math.min(width, 420),
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(0, 229, 255, 0.96)",
    },
    webview: { width: "100%", height: "100%" },

    body: { flex: 1 },


    bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

}
);
