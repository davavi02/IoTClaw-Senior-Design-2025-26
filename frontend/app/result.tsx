import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Result() {
  const params = useLocalSearchParams<{ outcome?: string }>();
  const win = (params.outcome ?? "win") === "win";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{win ? "🎉 You Won!" : "✨ So Close!"}</Text>
        <Text style={styles.subtitle}>{win ? "Great job grabbing the prize!" : "You were really close, try again!"}</Text>
      </View>
      
      <View style={styles.replayBox}>
        <Text style={styles.replayPlaceholder}>📹 Replay snippet thumbnail</Text>
      </View>
      
      <View style={styles.actions}>
        <Pressable style={styles.primaryBtn} onPress={() => console.log("Play again")}>
          <Text style={styles.primaryBtnText}>Play Again</Text>
        </Pressable>
        <Link href="/" style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back to Home</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc",
    padding: 24 
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "700", 
    textAlign: "center",
    color: "#1e293b",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  replayBox: {
    height: 180, 
    borderWidth: 1, 
    borderColor: "#e2e8f0", 
    borderRadius: 12,
    justifyContent: "center", 
    alignItems: "center", 
    marginBottom: 32,
    backgroundColor: "#f1f5f9",
  },
  replayPlaceholder: {
    fontSize: 14,
    color: "#64748b",
    opacity: 0.8,
  },
  actions: {
    gap: 16,
  },
  primaryBtn: { 
    backgroundColor: "#3b82f6", 
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  primaryBtnText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "600" 
  },
  backLink: { 
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  backLinkText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "500"
  }
});
