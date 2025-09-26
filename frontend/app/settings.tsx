import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function Settings() {
  const [highContrast, setHighContrast] = useState(false);
  const [haptics, setHaptics] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Customize your gaming experience</Text>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Display</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>High contrast mode</Text>
            <Text style={styles.settingDescription}>Enhance readability and visibility</Text>
          </View>
          <Switch 
            value={highContrast} 
            onValueChange={setHighContrast}
            trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
            thumbColor={highContrast ? "#ffffff" : "#ffffff"}
          />
        </View>
      </View>

      <View style={styles.group}>
        <Text style={styles.groupTitle}>Feedback</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Haptic feedback</Text>
            <Text style={styles.settingDescription}>Feel vibrations for better control</Text>
          </View>
          <Switch 
            value={haptics} 
            onValueChange={setHaptics}
            trackColor={{ false: "#e2e8f0", true: "#3b82f6" }}
            thumbColor={haptics ? "#ffffff" : "#ffffff"}
          />
        </View>
      </View>

      <Text style={styles.note}>
        Accessibility first: large tap targets, clear feedback, and a simple layout.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8fafc",
    padding: 24 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 32,
  },
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#64748b",
  },
  note: { 
    marginTop: 32, 
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  }
});
