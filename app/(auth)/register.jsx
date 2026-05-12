import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { Link } from "expo-router";
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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState(null);

  const { user, register } = useUser();

  const handleSignUp = async () => {
    setError(null);
    try {
      if (password !== confirmedPassword) {
        setError("Passwords do not match");
        return;
      }
      await register(email, password);
      console.log("current user is: ", user);
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
            Create Account
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
          <ThemedTextInput
            placeholder="Confirm Password"
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            secureTextEntry
          />
          <ThemedButton onPress={handleSignUp} style={styles.signUpBtn}>
            <ThemedText title={true} style={styles.signUpText}>
              SIGN UP
            </ThemedText>
          </ThemedButton>
          {error && <Text style={styles.error}>{error}</Text>}

          <Spacer />
          <Link href="/login" replace>
            <ThemedText>
              Already have an account?{" "}
              <ThemedText title={true} style={styles.loginText}>
                Login
              </ThemedText>
            </ThemedText>
          </Link>
        </ThemedScrollView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

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
  signUpBtn: {
    width: "80%",
  },
  signUpText: {
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
    margin: 10,
  },
  loginText: {
    color: "#8969c9",
    fontSize: 16,
  },
});
