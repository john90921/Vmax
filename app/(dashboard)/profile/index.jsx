import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Spacer from "../../../components/Spacer";
import ThemedCard from "../../../components/ThemedCard";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedModal from "../../../components/ThemedModal";
import { Colors } from "../../../constants/Colors";
import { useUser } from "../../../hooks/useUser";

const ProfileIndex = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { user, logout } = useUser();

  const [salary, setSalary] = useState("");
  const [savedSalary, setSavedSalary] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const displayName = user?.name ?? "Anonymous User";
  const email = user?.email ?? "No email registered";
  const activeSalary = savedSalary || salary;
  const parsedSalary = Number(activeSalary) || 0;
  const dailySavings = parsedSalary > 0 ? parsedSalary / 30 : 0;

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <ThemedText title style={styles.avatarText}>
              img
            </ThemedText>
          </View>

          <View style={styles.heroCopy}>
            <ThemedText title style={styles.name}>
              {displayName}
            </ThemedText>
            <ThemedText style={styles.email}>{email}</ThemedText>
          </View>
        </View>

        <ThemedCard style={[styles.statCard, styles.salaryCard]}>
          <View style={styles.statTopRow}>
            <Ionicons
              name="logo-usd"
              size={18}
              color={theme.iconColorFocused}
            />
            <ThemedText style={styles.statLabelSmall}>
              Current salary
            </ThemedText>
          </View>
          <View style={styles.statTopRow}>
            <ThemedText title style={styles.statValueLarge}>
              {activeSalary ? `RM ${parsedSalary.toFixed(0)}` : "RM 0"}
            </ThemedText>
            <Pressable
              onPress={() => setModalVisible(true)}
              style={{ flex: 1 }}
            >
              <ThemedText
                style={[
                  styles.statLabelSmall,
                  {
                    flex: 1,
                    textAlign: "right",
                    color: "#007bff",
                  },
                ]}
              >
                update your salary here
              </ThemedText>
            </Pressable>
          </View>
        </ThemedCard>

        <Spacer height={10} />
        <ThemedCard style={[styles.statCard, styles.savingsCard]}>
          <View style={styles.statTopRow}>
            <Ionicons name="wallet" size={18} color={theme.iconColorFocused} />
            <ThemedText style={styles.statLabelSmall}>
              Average daily savings
            </ThemedText>
          </View>
          <ThemedText title style={styles.statValueLarge}>
            {parsedSalary > 0 ? `RM ${dailySavings.toFixed(0)}` : "RM 0"}
          </ThemedText>
        </ThemedCard>

        <ThemedModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          overlayStyle={styles.modalOverlay}
          contentStyle={[
            styles.modalContent,
            { backgroundColor: theme.uiBackground },
          ]}
        >
          <ThemedText title style={styles.modalTitle}>
            Update Salary
          </ThemedText>

          <ThemedTextInput
            placeholder="Salary (RM)"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
            style={styles.input}
          />

          <View style={styles.modalButtonsRow}>
            <ThemedButton
              style={[styles.primaryButton, styles.modalButton]}
              onPress={() => {
                setSavedSalary(salary);
                setModalVisible(false);
              }}
            >
              <ThemedText title style={styles.buttonText}>
                Save
              </ThemedText>
            </ThemedButton>

            <ThemedButton
              style={[styles.secondaryButton, styles.modalButton]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText style={styles.secondaryText}>Cancel</ThemedText>
            </ThemedButton>
          </View>
        </ThemedModal>

        <Spacer />
        <ThemedButton
          style={[styles.logoutButton, styles.logoutFull]}
          onPress={logout}
        >
          <ThemedText title style={styles.logoutText}>
            Logout
          </ThemedText>
        </ThemedButton>
      </ScrollView>
    </ThemedView>
  );
};

export default ProfileIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    gap: 16,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
  },
  heroCopy: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    lineHeight: 26,
    marginBottom: 4,
  },
  email: {
    color: "#6b6b6b",
  },
  statCard: {
    flex: 1,
    padding: 16,
    gap: 8,
    minHeight: 110,
    borderRadius: 14,
  },
  statTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statLabelSmall: {
    fontSize: 12,
    opacity: 0.8,
  },
  statValueLarge: {
    fontSize: 20,
    marginTop: 4,
  },
  input: {
    width: "100%",
    marginBottom: 0,
  },
  modalOverlay: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.42)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 540,
    minHeight: 220,
    padding: 22,
    borderRadius: 18,
    gap: 12,
  },
  modalTitle: {
    marginBottom: 6,
  },
  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  modalButton: {
    flex: 1,
  },
  primaryButton: {
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  secondaryText: {
    color: "#333",
  },
  panel: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  logoutPanel: {
    borderWidth: 0,
  },
  logoutButton: {
    backgroundColor: Colors.warning,
    borderRadius: 12,
    paddingVertical: 12,
  },
  logoutFull: {
    width: "100%",
  },
  logoutText: {
    color: "#fff",
  },
});
