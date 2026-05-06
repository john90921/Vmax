import { useColorScheme, View } from "react-native";
import { Colors } from "../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const ThemedView = ({ style, safe = true, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  if (!safe)
    return (
      <View style={[{ backgroundColor: theme.background }, style]} {...props} />
    );

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.background }, style]}
      {...props}
    />
  );
};

export default ThemedView;
