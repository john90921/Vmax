import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  View,
  Modal,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import ThemedView from "../ThemedView";
import ThemedText from "../ThemedText";
import ThemedTextInput from "../ThemedTextInput";
import ThemedButton from "../ThemedButton";
import MessageBubble from "./MessageBubble";

const ChatDialog = ({ visible, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your Vmax assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, keyboardOffset > 0 && styles.overlayKeyboard]}>
        <TouchableOpacity style={[styles.overlayTouchable, keyboardOffset > 0 && styles.overlayTouchableKeyboard]} activeOpacity={1} onPress={onClose}>
          <View style={[styles.dialog, keyboardOffset > 0 && styles.dialogKeyboard]}>
            <View style={styles.container}>
              <View style={styles.header}>
                <ThemedText title={true} style={styles.title}>
                  Vmax Assistant
                </ThemedText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <ThemedText style={styles.closeText}>×</ThemedText>
                </TouchableOpacity>
              </View>

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
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChatDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayKeyboard: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  overlayTouchable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  overlayTouchableKeyboard: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 30,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    height: "80%",
    maxWidth: 420,
    maxHeight: 550,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  dialogKeyboard: {
    height: "95%",
    maxHeight: 520,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: "#666",
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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