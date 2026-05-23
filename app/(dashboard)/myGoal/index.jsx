import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Spacer from "../../../components/Spacer";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedFlatList from "../../../components/ThemedFlatList";
import ThemedCard from "../../../components/ThemedCard";
import PiggyBankTracker from "../../../components/PiggyBankTracker";

const MyGoalIndex = () => {
  const router = useRouter();

  const data = [
    { id: "1", title: "My Goal 1", target_amount: 1000, current_amount: 300, target_date: "31 December 2024", completed_date: null, status: "active" },
    { id: "2", title: "My Goal 2", target_amount: 2000, current_amount: 2000, target_date: "31 January 2025", completed_date: "15 January 2025", status: "completed" },
    { id: "3", title: "My Goal 3", target_amount: 3000, current_amount: 3000, target_date: "31 February 2025", completed_date: "26 February 2025", status: "completed" },
    { id: "4", title: "My Goal 4", target_amount: 4000, current_amount: 1000, target_date: "31 March 2025", completed_date: null, status: "active" },
    { id: "5", title: "My Goal 5", target_amount: 5000, current_amount: 2500, target_date: "30 April 2025", completed_date: null, status: "active" },
    { id: "6", title: "My Goal 6", target_amount: 6000, current_amount: 6000, target_date: "31 May 2025", completed_date: "15 May 2025", status: "completed" },
    { id: "7", title: "My Goal 7", target_amount: 7000, current_amount: 3500, target_date: "30 June 2025", completed_date: null, status: "active" },
    { id: "8", title: "My Goal 8", target_amount: 8000, current_amount: 4000, target_date: "31 July 2025", completed_date: null, status: "active" },
    { id: "9", title: "My Goal 9", target_amount: 9000, current_amount: 4500, target_date: "31 August 2025", completed_date: null, status: "active" },
    { id: "10", title: "My Goal 10", target_amount: 10000, current_amount: 10000, target_date: "30 September 2025", completed_date: "15 September 2025", status: "completed" },
  ];

  const totalCurrent = data.filter((i) => i.status === "active").reduce((sum, i) => sum + i.current_amount, 0);
  const totalTarget  = data.filter((i) => i.status === "active").reduce((sum, i) => sum + i.target_amount, 0);

  return (
    <ThemedView>
      <ThemedFlatList
        contentContainerStyle={styles.listContent}
        data={data.filter((item) => item.status === "active")}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <PiggyBankTracker
              currentAmount={totalCurrent}
              goalAmount={totalTarget}
              currency="RM"
              goalLabel="All Active Goals"
              onAddSavings={() => router.push("/(dashboard)/myGoal/add-mygoal")}
            />
            <ThemedView style={styles.dashboardContainer}>
              <ThemedCard style={styles.unallocatedCard}>
                <ThemedText>Unallocated Funds</ThemedText>
                <ThemedText title={true}>RM 500</ThemedText>
              </ThemedCard>
              <ThemedView style={styles.dailySummaryContainer}>
                <ThemedCard style={styles.dailySummaryCard}>
                  <ThemedText>Daily Income</ThemedText>
                  <ThemedText title={true}>RM 200</ThemedText>
                </ThemedCard>
                <ThemedCard style={styles.dailySummaryCard}>
                  <ThemedText>Expenses Today</ThemedText>
                  <ThemedText title={true}>RM 42</ThemedText>
                </ThemedCard>
                <ThemedCard style={styles.dailySummaryCard}>
                  <ThemedText>Goal Contribution</ThemedText>
                  <ThemedText title={true}>RM 158</ThemedText>
                </ThemedCard>
              </ThemedView>
            </ThemedView>
            <Spacer height={20} />
            <ThemedText title={true} style={styles.flatListLabel}>
              Active Goals ({data.filter((i) => i.status === "active").length})
            </ThemedText>
          </>
        }
        renderItem={({ item }) => (
          <ThemedCard style={styles.goalCard}>
            <ThemedText>{item.title}</ThemedText>
            <ThemedText>Target: RM {item.target_amount}</ThemedText>
            <ThemedText>Current: RM {item.current_amount}</ThemedText>
            <ThemedText>Target Date of Completion: {item.target_date}</ThemedText>
            <Spacer height={10} />
            <ThemedText title={true}>
              + RM 26.33 ((Daily Income - Expenses)/No. of Active Goals)
            </ThemedText>
          </ThemedCard>
        )}
        ListFooterComponent={
          <>
            <Spacer height={20} />
            <ThemedText title={true} style={styles.flatListLabel}>
              Completed Goals ({data.filter((i) => i.status === "completed").length})
            </ThemedText>
            <ThemedFlatList
              data={data.filter((i) => i.status === "completed")}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ThemedCard style={styles.goalCard}>
                  <ThemedText>{item.title}</ThemedText>
                  <ThemedText>Target: RM {item.target_amount}</ThemedText>
                  <ThemedText>Target Date of Completion: {item.target_date}</ThemedText>
                  <ThemedText>Date of Completion: {item.completed_date}</ThemedText>
                </ThemedCard>
              )}
            />
            <ThemedText style={styles.endOfFlatListText}>
              You're all caught up!
            </ThemedText>
          </>
        }
      />
    </ThemedView>
  );
};

export default MyGoalIndex;

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 5 },
  dashboardContainer: { width: "100%", paddingTop: 5 },
  unallocatedCard: { alignItems: "center", marginBottom: 5 },
  dailySummaryContainer: { display: "flex", flexDirection: "row", gap: 5 },
  dailySummaryCard: { flex: 1, alignItems: "center" },
  flatListLabel: { fontSize: 16, textAlign: "center" },
  goalCard: { marginBottom: 10 },
  endOfFlatListText: { textAlign: "center", fontStyle: "italic", color: "gray", marginVertical: 5 },
});