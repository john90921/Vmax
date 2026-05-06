import { Pressable, StyleSheet } from "react-native";

import Spacer from "../../../components/Spacer";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import { useUser } from "../../../hooks/useUser";

const MyGoalIndex = () => {
  const { logout } = useUser();

  return (
    <ThemedView style={styles.container}>
      <Spacer />
      <ThemedText title={true} style={styles.heading}>
        My Goal Screen
      </ThemedText>
      <Pressable onPress={logout}>
        <ThemedText>Logout</ThemedText>
      </Pressable>
    </ThemedView>
  );
};

export default MyGoalIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
