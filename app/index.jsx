import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Redirect } from "expo-router";

import ThemedView from "../components/ThemedView";
import ThemedLogo from "../components/ThemedLogo";
import ThemedText from "../components/ThemedText";
import Spacer from "../components/Spacer";
import { useUser } from "../hooks/useUser";

// Splash screen that checks auth status and redirects accordingly
const Home = () => {
  const { user, authChecked } = useUser();
  const [splashReady, setSplashReady] = useState(false);
  const [fadeOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashReady(true);
    }, 1500);

    Animated.timing(fadeOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(timer);
  }, [fadeOpacity]);

  if (authChecked && splashReady) {
    return <Redirect href={user ? "/myGoal" : "/login"} />;
  }

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.fadeContent, { opacity: fadeOpacity }]}>
        <ThemedLogo style={styles.logo} />
        <Spacer />
        <ThemedText style={styles.appName} title={true}>
          Vmax
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 200,
  },
  fadeContent: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
  appName: {
    fontSize: 50,
    // fontStyle: "italic",
  },
});
