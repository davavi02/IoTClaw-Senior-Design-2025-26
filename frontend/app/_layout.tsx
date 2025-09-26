import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{ // This wraps all your screen options for the stack
          headerTitleStyle: { fontWeight: "600" },
          headerBackTitle: "Back",
        }}
      />
    </>
  );
}
