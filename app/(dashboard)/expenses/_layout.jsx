import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { View, Pressable, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemedModal from "../../../components/ThemedModal";
import { useTheme } from "../../../hooks/useTheme";

const T = {
  accentGold:       "#F5C842",
  accentGoldMid:    "#F5DFA0",
  accentPurpleDeep: "#534AB7",
  textDark:         "#2C1810",
  bgWarm:           "#FFF8ED",
  bgCard:           "#FFFDF7",
};

export default function ExpensesLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: T.bgCard },
          headerTitleStyle: { color: T.textDark, fontWeight: "700" },
          headerTintColor: T.accentPurpleDeep,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBottomBorderColor: T.accentGoldMid,
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
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={T.accentPurpleDeep}
                    style={{ marginHorizontal: 6 }}
                  />
                </Pressable>
                <Pressable
                  onPress={() => setMenuVisible(true)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View style={styles.addBtn}>
                    <Ionicons name="add" size={20} color="#fff" />
                  </View>
                </Pressable>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="add-expenses"
          options={{
            headerTitle: "Log Today's Spending",
            headerBackVisible: false,
            headerStyle: { backgroundColor: T.bgWarm },
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={26} color={T.accentPurpleDeep} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>

      <ThemedModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        contentStyle={[styles.dropdown, { top: 70, right: 16 }]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            router.push({ pathname: "/expenses/add-expenses", params: { method: "upload" } });
          }}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: "rgba(127,119,221,0.12)" }]}>
            <Ionicons name="camera-outline" size={18} color={T.accentPurpleDeep} />
          </View>
          <View>
            <Text style={[styles.menuText, { color: T.textDark }]}>Upload Receipt</Text>
            <Text style={styles.menuSub}>Scan & auto-extract</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            setMenuVisible(false);
            router.push({ pathname: "/expenses/add-expenses", params: { method: "manual" } });
          }}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: "rgba(245,200,66,0.15)" }]}>
            <Ionicons name="create-outline" size={18} color="#C8A800" />
          </View>
          <View>
            <Text style={[styles.menuText, { color: T.textDark }]}>Manual Entry</Text>
            <Text style={styles.menuSub}>Type it in yourself</Text>
          </View>
        </TouchableOpacity>
      </ThemedModal>
    </>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#534AB7", alignItems: "center", justifyContent: "center",
    marginHorizontal: 8,
    shadowColor: "#534AB7", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  dropdown: {
    position: "absolute", width: 210,
    backgroundColor: "#FFFDF7", borderRadius: 16, padding: 8,
    borderWidth: 1.5, borderColor: "#F5DFA0",
    shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 12,
  },
  menuItem:    { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 10 },
  menuIconWrap:{ width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuText:    { fontSize: 14, fontWeight: "600" },
  menuSub:     { fontSize: 11, color: "#BFA080", marginTop: 1 },
  separator:   { height: 1, backgroundColor: "#F5DFA0", marginHorizontal: 10 },
});