import React from "react";
import { StyleSheet, View, Text, Button, ImageBackground } from "react-native";

function HomeScreen(props) {
  return (
    <ImageBackground
      source={require("../assets/background-image.jpg")}
      style={styles.backgroundImage}
    ></ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    opacity: 0.3,
  },
});

export default HomeScreen;
