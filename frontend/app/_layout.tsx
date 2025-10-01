/**
 * Root Layout Component
 * 
 * This is the main layout component that wraps all screens in the app.
 * It configures the navigation stack and global UI elements like the status bar.
 * 
 * Key responsibilities:
 * - Set up navigation stack with consistent styling
 * - Configure status bar appearance
 * - Apply global navigation options
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      {/* Status bar configuration - automatically adapts to system theme */}
      <StatusBar style="auto" />
      
      {/* Navigation stack with consistent styling for all screens */}
      <Stack
        screenOptions={{
          // Consistent header title styling across all screens
          headerTitleStyle: { 
            fontWeight: "600",
            fontSize: 18,
            color: "#ffffff", // White text for dark theme
          },
          // Back button text
          headerBackTitle: "Back",
          // Header background for dark theme
          headerStyle: {
            backgroundColor: "#0f0f23", // Match app background
          },
          // Header text color
          headerTintColor: "#ffffff",
          // Hide header by default (most screens have custom headers)
          headerShown: false,
        }}
      />
    </>
  );
}
