/**
 * myGoal/_layout.jsx — fixed version
 *
 * Changes:
 * 1. Removed the extraneous goal-detail Stack.Screen that was duplicated
 * 2. Simplified the route structure: only 3 screens, no duplicates
 * 3. TutorialProvider wraps the Stack
 */

import { Stack, useRouter } from "expo-router";
import { View, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../../hooks/useTheme";
import { TutorialProvider } from "./GoalTutorialOverlay";

export default function MyGoalLayout() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <TutorialProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTitleStyle: { color: theme.title },
          headerTintColor: theme.iconColor,
          headerTitleAlign: "center",
        }}
      >
        {/* Main goals list screen */}
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "My Goals",
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>

                {/* Notifications icon */}
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

                {/* Add goal button */}
                <Pressable
                  onPress={() => router.push("/(dashboard)/myGoal/add-mygoal")}
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

        {/* Add/create goal screen */}
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

        {/* Goal detail/drill-down screen */}
        <Stack.Screen
          name="goal-detail"
          options={{
            headerTitle: "Goal Details",
            headerBackVisible: true,
          }}
        />
      </Stack>
    </TutorialProvider>
  );
}