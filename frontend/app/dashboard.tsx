import { Link, router } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get('window');

export default function GameDashboard() {
  // Queue information
  const position = 3;
  const estWaitMin = 7;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Background animation values
  const backgroundAnim1 = useRef(new Animated.Value(0)).current;
  const backgroundAnim2 = useRef(new Animated.Value(0)).current;
  const backgroundAnim3 = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for queue card
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Background floating animations
    const backgroundAnimation1 = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const backgroundAnimation2 = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    const backgroundAnimation3 = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundAnim3, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    );

    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    );

    backgroundAnimation1.start();
    backgroundAnimation2.start();
    backgroundAnimation3.start();
    floatingAnimation.start();

    return () => {
      pulseAnimation.stop();
      backgroundAnimation1.stop();
      backgroundAnimation2.stop();
      backgroundAnimation3.stop();
      floatingAnimation.stop();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Background Elements */}
      <Animated.View 
        style={[
          styles.backgroundCircle1,
          {
            transform: [
              {
                translateX: backgroundAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, width + 100],
                }),
              },
              {
                translateY: backgroundAnim1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                }),
              },
            ],
            opacity: backgroundAnim1.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.3, 0.1],
            }),
          },
        ]}
      />
      
      <Animated.View 
        style={[
          styles.backgroundCircle2,
          {
            transform: [
              {
                translateX: backgroundAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width + 100, -100],
                }),
              },
              {
                translateY: backgroundAnim2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, -100],
                }),
              },
            ],
            opacity: backgroundAnim2.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.1, 0.2, 0.1],
            }),
          },
        ]}
      />
      
      <Animated.View 
        style={[
          styles.backgroundCircle3,
          {
            transform: [
              {
                translateX: backgroundAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, width - 50],
                }),
              },
              {
                translateY: backgroundAnim3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.3, height * 0.7],
                }),
              },
            ],
            opacity: backgroundAnim3.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.05, 0.15, 0.05],
            }),
          },
        ]}
      />

      {/* Floating Game Elements */}
      <Animated.View 
        style={[
          styles.floatingElement,
          {
            transform: [
              {
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
            opacity: floatingAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.6, 0.3],
            }),
          },
        ]}
      >
        <Text style={styles.floatingText}>🎮</Text>
      </Animated.View>

      {/* Animated Header Section */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <Text style={styles.title}>🎮 Claw Game</Text>
        <Text style={styles.subtitle}>✨ Remote arcade experience</Text>
      </Animated.View>

      {/* Central Play Game Button */}
      <Animated.View 
        style={[
          styles.centralPlayContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Link style={styles.centralPlayBtn} href="/game">
          <Text style={styles.centralPlayIcon}>🎮</Text>
          <Text style={styles.centralPlayText}>Play Game</Text>
        </Link>
      </Animated.View>

      {/* Animated Menu Row */}
      <Animated.View 
        style={[
          styles.menuRow,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.yourTurnBtn}>
          <Text style={styles.yourTurnIcon}>⏳</Text>
          <Text style={styles.yourTurnTitle}>Your Turn</Text>
          <Text style={styles.yourTurnPosition}>#{position}</Text>
        </View>
        
        <Link style={styles.menuBtn} href={{ pathname: "/result", params: { outcome: "win" } }}>
          <Text style={styles.menuBtnIcon}>🏆</Text>
          <Text style={styles.menuBtnText}>Results</Text>
        </Link>
        
        <Link style={styles.menuBtn} href="/settings">
          <Text style={styles.menuBtnIcon}>⚙️</Text>
          <Text style={styles.menuBtnText}>Settings</Text>
        </Link>
      </Animated.View>
        
      {/* Logout Button */}
      <Animated.View 
        style={[
          styles.logoutContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => router.push("/")}
        >
          <Text style={styles.logoutBtnText}>🔓 Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f23",
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  // Header styles
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: "#a8b3ed",
    fontWeight: "500",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  
  // Central Play Game Button - Stunning Design
  centralPlayContainer: {
    alignItems: "center",
    marginVertical: 50,
  },
  centralPlayBtn: {
    width: 180,
    height: 180,
    borderRadius: 45,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 6,
    borderColor: "#8b5cf6",
    flexDirection: "column",
  },
  centralPlayIcon: {
    fontSize: 56,
    marginBottom: 6,
    textAlign: "center",
    alignSelf: "center",
  },
  centralPlayText: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    lineHeight: 22,
    alignSelf: "center",
  },
  
  // Menu row - Beautiful design
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 50,
    paddingHorizontal: 30,
    gap: 20,
  },
  yourTurnBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    flexDirection: "column",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  yourTurnIcon: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 26,
    alignSelf: "center",
    flex: 0,
  },
  yourTurnTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 1,
    lineHeight: 13,
    alignSelf: "center",
    flex: 0,
    marginHorizontal: 2,
  },
  yourTurnPosition: {
    fontSize: 11,
    fontWeight: "900",
    color: "#fbbf24",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 13,
    alignSelf: "center",
    flex: 0,
    marginHorizontal: 2,
  },
  menuBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 25,
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    flexDirection: "column",
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  menuBtnIcon: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 4,
    lineHeight: 26,
    alignSelf: "center",
    flex: 0,
  },
  menuBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 13,
    alignSelf: "center",
    flex: 0,
    marginHorizontal: 2,
  },
  
  // Logout - Minimal and elegant
  logoutContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(239, 68, 68, 0.3)",
    minWidth: 140,
  },
  logoutBtnText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  
  // Background animation styles - Updated for dark theme
  backgroundCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    top: 100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    top: 200,
  },
  backgroundCircle3: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(168, 179, 237, 0.08)",
    top: 300,
  },
  floatingElement: {
    position: "absolute",
    top: height * 0.2,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingText: {
    fontSize: 24,
  },
});
