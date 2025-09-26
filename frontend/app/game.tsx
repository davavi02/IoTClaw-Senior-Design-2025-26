import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Game() {
  const [latency] = useState("Good");
  const [seconds, setSeconds] = useState(30);
  const [isMyTurn, setIsMyTurn] = useState(true); // For demo purposes, set to true

  useEffect(() => {
    if (isMyTurn && seconds > 0) {
      const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
      return () => clearInterval(id);
    }
  }, [isMyTurn, seconds]);

  const press = (dir: string) => console.log("Pressed:", dir);
  const confirmGrab = () => {
    console.log("Confirm GRAB");
    // Add grab logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>🎮 Play Claw Game</Text>

          {/* Timer Section - Only show when it's your turn */}
          {isMyTurn && (
            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>Your Turn</Text>
              <Text style={styles.timer}>{seconds}s</Text>
              <Text style={styles.timerNote}>
                {seconds > 0 ? "Make your move!" : "Time's up! Controls locked."}
              </Text>
            </View>
          )}

          {/* Mock video area (replace with WebRTC later) */}
          <View style={styles.videoBox}>
            <Text style={styles.videoPlaceholder}>📹 Live video stream here</Text>
            {!isMyTurn && (
              <Text style={styles.waitingText}>⏳ Waiting for your turn...</Text>
            )}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.latency}>Latency: {latency}</Text>
          </View>

          {/* Control pad - Only enabled when it's your turn and time > 0 */}
          <View style={styles.pad}>
            <Pressable 
              style={[styles.btn, styles.small, (!isMyTurn || seconds === 0) && styles.disabledBtn]} 
              onPress={() => press("UP")}
              disabled={!isMyTurn || seconds === 0}
            >
              <Text style={styles.btnText}>↑</Text>
            </Pressable>
            <View style={styles.row}>
              <Pressable 
                style={[styles.btn, styles.small, (!isMyTurn || seconds === 0) && styles.disabledBtn]} 
                onPress={() => press("LEFT")}
                disabled={!isMyTurn || seconds === 0}
              >
                <Text style={styles.btnText}>←</Text>
              </Pressable>
              <Pressable 
                style={[styles.btn, styles.grab, (!isMyTurn || seconds === 0) && styles.disabledBtn]} 
                onPress={() => press("GRAB")}
                disabled={!isMyTurn || seconds === 0}
              >
                <Text style={styles.btnText}>GRAB</Text>
              </Pressable>
              <Pressable 
                style={[styles.btn, styles.small, (!isMyTurn || seconds === 0) && styles.disabledBtn]} 
                onPress={() => press("RIGHT")}
                disabled={!isMyTurn || seconds === 0}
              >
                <Text style={styles.btnText}>→</Text>
              </Pressable>
            </View>
            <Pressable 
              style={[styles.btn, styles.small, (!isMyTurn || seconds === 0) && styles.disabledBtn]} 
              onPress={() => press("DOWN")}
              disabled={!isMyTurn || seconds === 0}
            >
              <Text style={styles.btnText}>↓</Text>
            </Pressable>
          </View>

          {/* Confirm Grab Button - Only show when it's your turn */}
          {isMyTurn && seconds > 0 && (
            <Pressable style={styles.confirmGrabBtn} onPress={confirmGrab}>
              <Text style={styles.confirmGrabText}>🎯 CONFIRM GRAB</Text>
            </Pressable>
          )}

          <View style={styles.footerContainer}>
            <Text style={styles.footer}>
              {isMyTurn ? "Controls are active - make your move!" : "Waiting for your turn..."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const BTN = 72;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f0f23",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: { 
    flex: 1, 
    padding: 24, 
    gap: 20,
    backgroundColor: "#0f0f23"
  },
  title: { 
    fontSize: 32, 
    fontWeight: "900", 
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  
  // Timer section styles
  timerSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  timerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a8b3ed",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 36,
    fontWeight: "900",
    color: "#6366f1",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  timerNote: {
    fontSize: 12,
    color: "#a8b3ed",
    textAlign: "center",
    fontWeight: "600",
  },
  
  videoBox: {
    height: 200, 
    borderWidth: 2, 
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  videoPlaceholder: {
    fontSize: 14,
    color: "#a8b3ed",
    textAlign: "center",
    fontWeight: "600"
  },
  waitingText: {
    fontSize: 12,
    color: "#6366f1",
    marginTop: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  
  statsContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  latency: { 
    textAlign: "center", 
    color: "#a8b3ed",
    fontSize: 14,
    fontWeight: "600",
  },
  pad: { 
    alignItems: "center", 
    gap: 16, 
    marginVertical: 20,
  },
  row: { 
    flexDirection: "row", 
    gap: 12, 
    alignItems: "center" 
  },
  btn: {
    width: BTN, 
    height: BTN, 
    borderRadius: 20,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#8b5cf6",
  },
  small: { 
    width: BTN, 
    height: BTN 
  },
  grab: { 
    width: BTN * 1.6, 
    height: BTN, 
    backgroundColor: "#6366f1",
  },
  disabledBtn: {
    backgroundColor: "#4B5563",
    opacity: 0.6
  },
  btnText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 18,
  },
  
  // Confirm grab button
  confirmGrabBtn: {
    backgroundColor: "#10b981",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  confirmGrabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 20,
  },
  
  footerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  footer: { 
    textAlign: "center", 
    fontSize: 14, 
    color: "#a8b3ed",
    fontWeight: "600",
    letterSpacing: 0.5,
  }
});
