import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  View,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/Colors";
import ThemedModal from "../../../components/ThemedModal";

export default function ExpensesLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
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
            headerTitle: "Expenses",
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

                <View>
                  <Pressable
                    onPress={() => setMenuVisible(true)}
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
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="add-expenses"
          options={{
            headerTitle: "Log Today's Spending",
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={28} color={theme.iconColor} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <ThemedModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        contentStyle={[
          styles.dropdown,
          {
            backgroundColor: theme.navBackground,
            top: 70,
            right: 20,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            router.push({
              pathname: "/expenses/add-expenses",
              params: {
                method: "upload",
              },
            });
          }}
        >
          <Ionicons name="camera-outline" size={20} color={theme.title} />
          <Text style={[styles.menuText, { color: theme.title }]}>
            Upload Receipt
          </Text>
        </TouchableOpacity>

        <View
          style={[styles.separator, { backgroundColor: theme.title + "20" }]}
        />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            router.push({
              pathname: "/expenses/add-expenses",
              params: {
                method: "manual",
              },
            });
          }}
        >
          <Ionicons name="create-outline" size={20} color={theme.title} />
          <Text style={[styles.menuText, { color: theme.title }]}>
            Manual Entry
          </Text>
        </TouchableOpacity>
      </ThemedModal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    position: "absolute",
    width: 180,
    borderRadius: 14,
    padding: 6,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    // Elevation for Android
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
  separator: {
    height: 1,
    marginHorizontal: 10,
  },
});
