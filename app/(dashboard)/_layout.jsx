import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";

import UserOnly from "../../components/auth/UserOnly";
import FloatingChatButton from "../../components/chatbot/FloatingChatButton";

export default function DashboardLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const pathname = usePathname();

  // Show floating button on all dashboard pages except profile
  const showFloatingButton = !pathname.includes("/profile");

  return (
    // UserOnly will function correctly after auth logic is implemented
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 90,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}
      >
        <Tabs.Screen
          name="myGoal/index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? "home" : "home-outline"}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="groupGoal/index"
          options={{
            title: "Group Goals",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? "people" : "people-outline"}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses/index"
          options={{
            title: "Spending Log",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? "cash" : "cash-outline"}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: "My Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? "person" : "person-outline"}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            ),
          }}
        />
      </Tabs>
      {showFloatingButton && <FloatingChatButton />}
    </UserOnly>
  );
}
