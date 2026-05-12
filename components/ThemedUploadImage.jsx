import React, { useState } from "react";
import {
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";

export default function ImageUpload({ purpose = "receipt" }) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  const [image, setImage] = useState(null);

  const handleImageAction = async (type) => {
    let result;

    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need camera access to take a photo.",
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
      });
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need gallery access to pick a photo.",
        );
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showOptions = () => {
    Alert.alert(
      `Upload ${purpose.charAt(0).toUpperCase() + purpose.slice(1)}`,
      "Would you like to take a photo or choose from your gallery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Choose from Gallery",
          onPress: () => handleImageAction("library"),
        },
        { text: "Take Photo", onPress: () => handleImageAction("camera") },
      ],
    );
  };

  return (
    <ThemedView style={[styles.container, { flex: 0 }]}>
      <TouchableOpacity
        style={[
          {
            backgroundColor: theme.navBackground,
            borderColor: theme.iconColor + "40",
          },
          styles.uploadBox,
          image && styles.hasImage,
        ]}
        onPress={showOptions}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.preview}
            resizeMode="contain"
          />
        ) : (
          <>
            <Ionicons name="images-outline" size={48} color={theme.iconColor} />
            <ThemedText style={styles.text}>Tap to upload {purpose}</ThemedText>
          </>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          onPress={() => setImage(null)}
          style={styles.retakeButton}
        >
          <Ionicons name="refresh" size={16} color="#FF3B30" />
          <ThemedText style={styles.removeText}>Retake</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "transparent",
  },
  uploadBox: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  hasImage: {
    borderStyle: "solid",
    borderColor: "transparent",
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  removeText: {
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 5,
  },
});
