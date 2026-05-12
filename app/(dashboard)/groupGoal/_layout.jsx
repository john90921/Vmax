import { Stack, useRouter } from "expo-router";
import { View, Pressable, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/Colors";

export default function GroupGoalLayout() {
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
          headerTitle: "Group Goals",
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
                  // router.push("/groupGoal/add-groupgoal");
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
    </Stack>
  );
}
