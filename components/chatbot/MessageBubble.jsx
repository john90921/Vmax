import { StyleSheet } from "react-native";

import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";

const MessageBubble = ({ message }) => {
  const isUser = message.isUser;

  return (
    <ThemedView
      style={[
        styles.bubbleContainer,
        isUser ? styles.userContainer : styles.botContainer,
      ]}
    >
      <ThemedText style={[styles.text, isUser ? styles.userText : styles.botText]}>
        {message.text}
      </ThemedText>
    </ThemedView>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced from 12 to 8 for less height
    borderRadius: 18,
    marginVertical: 4,
  },
  userContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  botContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
});