import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

import ThemedView from "../../components/ThemedView";
import ThemedScrollView from "../../components/ThemedScrollView";
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedLogo from "../../components/ThemedLogo";
import { Colors } from "../../constants/Colors";
import { useUser } from "../../hooks/useUser";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();
  const { user, login } = useUser();

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView safe={true} safeEdges={["top", "right", "bottom", "left"]}>
        <ThemedScrollView>
          <Spacer />
          <ThemedLogo style={styles.logo} />

          <Spacer />
          <ThemedText title={true} style={styles.title}>
            Welcome Back!
          </ThemedText>

          <Spacer />
          <ThemedTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <ThemedTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ThemedButton onPress={handleLogin} style={styles.loginBtn}>
            <ThemedText title={true} style={styles.loginText}>
              LOGIN
            </ThemedText>
          </ThemedButton>
          {error && <Text style={styles.error}>{error}</Text>}

          <Spacer />
          <Link href="/register" replace>
            <ThemedText>
              New User?{" "}
              <ThemedText title={true} style={styles.signUpText}>
                Sign Up
              </ThemedText>
            </ThemedText>
          </Link>
        </ThemedScrollView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
  },
  loginText: {
    color: "#f2f2f2",
    fontSize: 16,
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  signUpText: {
    color: "#8969c9",
    fontSize: 16,
  },
});
