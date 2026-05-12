import React from "react";
import { StyleSheet, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemedView from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedText from "../../../components/ThemedText";
import Spacer from "../../../components/Spacer";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import ImageUpload from "../../../components/ThemedUploadImage";

function AddExpenses() {
  const { method } = useLocalSearchParams();
  const isUploadMode = method !== "manual";

  return (
    <ThemedView safe style={styles.screen}>
      <ThemedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {isUploadMode ? <UploadReceipt /> : <ManualEntry />}

        <ThemedButton style={styles.saveButton}>
          <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
        </ThemedButton>
      </ThemedScrollView>
    </ThemedView>
  );
}

const UploadReceipt = () => {
  return (
    <ThemedCard style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="camera" size={18} color="#6849a7" />
        <ThemedText title style={styles.sectionTitle}>
          Receipt Upload
        </ThemedText>
      </View>
      <Link
        style={styles.switchLink}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "manual" },
        }}
      >
        <ThemedText style={styles.switchText}>
          Don&apos;t have a receipt? Switch to manual entry.
        </ThemedText>
      </Link>
      <Spacer height={18} />
      <ImageUpload purpose="receipt" />
      <ThemedTextInput
        placeholder="Expense description (optional)"
        style={styles.input}
      />
    </ThemedCard>
  );
};

const ManualEntry = () => {
  return (
    <ThemedCard style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Ionicons name="list" size={18} color="#6849a7" />
        <ThemedText title style={styles.sectionTitle}>
          Expense Details
        </ThemedText>
      </View>
      <Link
        style={styles.switchLink}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "upload" },
        }}
      >
        <ThemedText style={styles.switchText}>
          Prefer a scan? Switch to receipt upload.
        </ThemedText>
      </Link>
      <Spacer height={18} />
      <ThemedTextInput placeholder="Expense description" style={styles.input} />
      <ThemedTextInput
        placeholder="Total Amount"
        keyboardType="numeric"
        style={styles.input}
      />
    </ThemedCard>
  );
};

export default AddExpenses;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    alignItems: "stretch",
  },
  hero: {
    marginBottom: 16,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#6849a7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
    maxWidth: 420,
  },
  sectionCard: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft: 8,
  },
  switchLink: {
    alignSelf: "flex-start",
  },
  switchText: {
    color: "#6849a7",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  saveButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 4,
    paddingVertical: 18,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
