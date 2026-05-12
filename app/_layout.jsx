import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Colors } from "../constants/Colors";
import { UserProvider } from "../contexts/UserContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <UserProvider>
      <StatusBar value="auto" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          headerShown: false,
        }}
      >
        {/* Groups */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />

        {/* Individual Screens */}
        <Stack.Screen name="index" />
      </Stack>
    </UserProvider>
  );
}
