import { useColorScheme, View, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const ThemedView = ({
  style,
  safe = false,
  safeEdges = ["right", "bottom", "left"],
  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const Container = safe ? SafeAreaView : View;

  const safeAreaProps = safe && safeEdges ? { edges: safeEdges } : {};

  return (
    <Container
      style={[{ backgroundColor: theme.background }, styles.container, style]}
      {...safeAreaProps}
      {...props}
    />
  );
};

export default ThemedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
