import { Tabs } from "expo-router";
import { View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { registerForPushNotificationsAsync } from "../../services/notification";
import UserOnly from "../../components/auth/UserOnly";
import FloatingChatButton from "../../components/chatbot/FloatingChatButton";
import { useTheme } from "../../hooks/useTheme";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
export default function DashboardLayout() {
  const { theme } = useTheme();
  const pathname = usePathname();

  // Show floating button on all dashboard pages except profile
  const showFloatingButton = !pathname.includes("/profile");
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token) return;

        console.log('Push token:', token);

        // Send token to backend
        const response = await fetch('https://api.example.com/push-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.id,
            token: token,
          }),
        });

        const data = await response.json();
        console.log('Token sent to backend:', data);
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    })();
  }, [user]);
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
          name="myGoal"
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
          name="groupGoal"
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
          name="expenses"
          options={{
            title: "Expenses",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                size={24}
                name={focused ? "receipt" : "receipt-outline"}
                color={focused ? theme.iconColorFocused : theme.iconColor}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
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
