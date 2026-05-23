import { Stack, useRouter } from "expo-router";
import { View, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../hooks/useTheme";

export default function GroupGoalLayout() {
  const { theme } = useTheme();
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
      {/* ── Group list ── */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Group Goals",
          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <Ionicons
                  name="notifications"
                  size={24}
                  color={theme.iconColor}
                  style={{ marginHorizontal: 10 }}
                />
              </Pressable>
              <Pressable
                onPress={() => router.push("/(dashboard)/groupGoal/create-group")}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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

      {/* ── Create a new group ── */}
      <Stack.Screen
        name="create-group"
        options={{
          headerTitle: "Create Group Goal",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={theme.iconColor} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* ── Join via invite code ── */}
      <Stack.Screen
        name="join-group"
        options={{
          headerTitle: "Join a Group",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color={theme.iconColor} />
            </TouchableOpacity>
          ),
        }}
      />

      {/* ── Group detail (drill-down) ── */}
      <Stack.Screen
        name="group-detail"
        options={{
          headerTitle: "Group Details",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}