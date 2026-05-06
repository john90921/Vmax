import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashReady(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (authChecked && splashReady) {
    return <Redirect href={user ? "/myGoal" : "/login"} />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedLogo style={styles.logo} />
      <Spacer />
      <ThemedText style={styles.appName} title={true}>
        Vmax
      </ThemedText>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 200,
  },
  logo: {
    width: 200,
    height: 200,
  },
  appName: {
    fontSize: 50,
    fontWeight: "bold",
    fontStyle: "italic",
  },
});
