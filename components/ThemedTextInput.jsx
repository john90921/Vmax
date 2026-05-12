import { TextInput, useColorScheme, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedTextInput = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
        },
        styles.textInput,
        style,
      ]}
      placeholderTextColor={theme.placeholderText}
      {...props}
    />
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  textInput: {
    padding: 20,
    borderRadius: 6,
    marginBottom: 10,
    width: "80%",
  },
});
