import { Stack, useRouter } from "expo-router";
import {
  View,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/Colors";

export default function MyGoalLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

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
          headerTitle: "My Goals",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  style={{ marginHorizontal: 10 }}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/myGoal/add-mygoal");
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Ionicons
                  name="add-circle"
                  size={34}
                  color={theme.iconColor}
                  style={{ marginHorizontal: 10 }}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="add-mygoal"
        options={{
          headerTitle: "Your Next Milestone",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={theme.iconColor} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
