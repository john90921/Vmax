import { Pressable, StyleSheet, Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";

import ChatDialog from "./ChatDialog";

const FloatingChatButton = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enhanced pulse animation with rotation for premium feel
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [scaleAnim, rotateAnim]);

  const handlePress = () => {
    setDialogVisible(true);
  };

  const handleClose = () => {
    setDialogVisible(false);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              { scale: scaleAnim },
              { rotate },
            ],
          },
        ]}
      >
        <Pressable style={styles.button} onPress={handlePress}>
          <View style={styles.gradient}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
          </View>
        </Pressable>
      </Animated.View>
      <ChatDialog visible={dialogVisible} onClose={handleClose} />
    </>
  );
};

export default FloatingChatButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  button: {
    width: 55,
    height: 55,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  gradient: {
    flex: 1,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#667eea", // Fallback color, can add gradient later
  },
});