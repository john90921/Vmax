import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { getPrimaryColor } from "../constants/Colors";

function ThemedButton({ style, ...props }) {
  const { colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <Pressable
      style={({ pressed }) => [
        { ...styles.btn, backgroundColor: primaryColor },
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    />
  );
}
//oko
const styles = StyleSheet.create({
  btn: {
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ThemedButton;
