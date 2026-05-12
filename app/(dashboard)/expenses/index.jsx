import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  SectionList,
} from "react-native";

import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedModal from "../../../components/ThemedModal";

const ExpensesIndex = () => {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Mock data for demonstration purposes
  const expenses = [
    {
      id: "1",
      description: "Lunch with client",
      receipt_uri: "",
      amount: 45.0,
      created_at: "01 May 2026",
    },
    {
      id: "2",
      description: "Office supplies",
      receipt_uri: "",
      amount: 30.5,
      created_at: "03 May 2026",
    },
    {
      id: "3",
      description: "", // Example of Receipt Upload with no expenses description
      receipt_uri:
        "https://news.umpsa.edu.my/sites/default/files/gallery/UMPSA%20.jpg",
      amount: 15.75,
      created_at: "03 May 2026",
    },
    {
      id: "4",
      description: "Conference registration",
      receipt_uri: "",
      amount: 120.0,
      created_at: "03 May 2026",
    },
    {
      id: "5",
      description: "Travel expenses",
      receipt_uri: "",
      amount: 200.0,
      created_at: "10 May 2026",
    },
    {
      id: "6",
      description: "Team dinner",
      receipt_uri: "",
      amount: 80.0,
      created_at: "12 May 2026",
    },
    {
      id: "7",
      description: "Software subscription",
      receipt_uri: "",
      amount: 50.0,
      created_at: "12 May 2026",
    },
    {
      id: "8",
      description: "Client entertainment",
      receipt_uri: "",
      amount: 150.0,
      created_at: "12 May 2026",
    },
    {
      id: "9",
      description: "Office rent",
      receipt_uri: "",
      amount: 1000.0,
      created_at: "19 May 2026",
    },
    {
      id: "10",
      description: "Utilities",
      receipt_uri: "",
      amount: 300.0,
      created_at: "25 May 2026",
    },
  ];

  const sections = expenses
    .slice()
    .sort(
      (left, right) => new Date(right.created_at) - new Date(left.created_at),
    )
    .reduce((grouped, expense) => {
      const section = grouped.find(
        (entry) => entry.title === expense.created_at,
      );

      if (section) {
        section.data.push(expense);
      } else {
        grouped.push({ title: expense.created_at, data: [expense] });
      }

      return grouped;
    }, []);

  return (
    <ThemedView style={{ paddingHorizontal: 5 }}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <ThemedView style={styles.dateHeader}>
            <ThemedText title>{section.title}</ThemedText>
          </ThemedView>
        )}
        renderItem={({ item }) => (
          <ThemedCard style={styles.expenseCard}>
            <ThemedText>
              {item.description.trim() || "Kindly refer to receipt for details"}
            </ThemedText>
            <ThemedText>RM {item.amount.toFixed(2)}</ThemedText>
            {item.receipt_uri && (
              <TouchableOpacity
                onPress={() => setSelectedReceipt(item.receipt_uri)}
              >
                <ThemedText>View Receipt</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedCard>
        )}
      />

      <ThemedModal
        visible={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        fullScreen
        contentStyle={styles.fullScreenModal}
      >
        <View style={styles.modalHeader}>
          <ThemedText title>
            Receipt_{selectedReceipt ? selectedReceipt.split("/").pop() : ""}
          </ThemedText>
          <TouchableOpacity onPress={() => setSelectedReceipt(null)}>
            <ThemedText style={styles.closeText}>Close</ThemedText>
          </TouchableOpacity>
        </View>

        {selectedReceipt ? (
          <Image
            source={{ uri: selectedReceipt }}
            style={styles.receiptImage}
            resizeMode="contain"
          />
        ) : null}
      </ThemedModal>
    </ThemedView>
  );
};

export default ExpensesIndex;

const styles = StyleSheet.create({
  dateHeader: {
    marginTop: 20,
  },
  expenseCard: {
    marginVertical: 5,
  },
  fullScreenModal: {
    backgroundColor: "#fff",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  closeText: {
    fontWeight: "600",
  },
  receiptImage: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 18,
  },
});
