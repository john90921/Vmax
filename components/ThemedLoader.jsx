import { ActivityIndicator, useColorScheme, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

import ThemedView from "./ThemedView";

const ThemedLoader = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <ThemedView style={[styles.loader, style]} {...props}>
      <ActivityIndicator size="large" color={theme.text} />
    </ThemedView>
  );
};

export default ThemedLoader;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
