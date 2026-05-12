import React from "react";
import { StyleSheet, View } from "react-native";

import ThemedView from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedText from "../../../components/ThemedText";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedCard from "../../../components/ThemedCard";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";

function addMyGoal(props) {
  return (
    <ThemedView safe={true}>
      <ThemedScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <ThemedText title={true} style={[styles.header, { marginBottom: 0 }]}>
            Small steps lead to big changes
          </ThemedText>
          <ThemedText title={true} style={styles.header}>
            Start your journey here!
          </ThemedText>
        </View>

        <ThemedCard style={styles.formCard}>
          <ThemedTextInput
            placeholder="Description for your goal"
            style={styles.input}
            multiline
          />

          <ThemedTextInput
            placeholder="Target amount"
            style={styles.input}
            keyboardType="numeric"
          />

          <ThemedTextInput placeholder="Target date" style={styles.input} />

          <ThemedText style={styles.note}>
            Our analysis suggests you will get there by 20 May 2026
          </ThemedText>
        </ThemedCard>

        <Spacer height={18} />

        <ThemedButton style={styles.primaryButton}>
          <ThemedText title style={styles.primaryButtonText}>
            Start Journey
          </ThemedText>
        </ThemedButton>
      </ThemedScrollView>
    </ThemedView>
  );
}

export default addMyGoal;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#e7e7e7",
    borderRadius: 16,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 0,
    width: "100%",
  },
  note: {
    fontSize: 13,
    color: "#6b6b6b",
    marginTop: 6,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
  },
});
