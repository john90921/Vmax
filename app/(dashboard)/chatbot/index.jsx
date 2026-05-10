import { useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import Spacer from "../../../components/Spacer";
import MessageBubble from "../../../components/chatbot/MessageBubble";

const ChatbotIndex = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your Vmax assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const router = useRouter();

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate API call - replace with real backend call
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! This is a placeholder response.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      flatListRef.current?.scrollToEnd();
    }, 1000);

    flatListRef.current?.scrollToEnd();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.header}>
        <ThemedText title={true} style={styles.title}>
          Vmax Assistant
        </ThemedText>
      </ThemedView>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <ThemedTextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <ThemedButton
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}
          style={styles.sendButton}
        >
          <ThemedText style={styles.sendText}>Send</ThemedText>
        </ThemedButton>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});