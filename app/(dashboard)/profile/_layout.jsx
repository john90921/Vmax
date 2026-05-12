import { Stack, useRouter } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/Colors";

export default function ProfileLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.navBackground },
        headerTitleStyle: { color: theme.title },
        headerTintColor: theme.iconColor,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Me",
          headerRight: () => (
            <Pressable
              onPress={() => {}}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Ionicons
                name="notifications"
                size={24}
                color={theme.iconColor}
                // style={{ marginRight: 65 }}
                style={{ marginRight: 10 }}
              />
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
