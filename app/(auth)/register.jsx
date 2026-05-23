/**
 * (auth)/register.jsx — Redesigned Register Screen
 *
 * Design language: warm-luxury, consistent with PiggyBankTracker palette.
 * Shares all design tokens and sub-components with login.jsx.
 */

import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  View,
  Dimensions,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import { useState, useRef, useEffect } from "react";
import Svg, { Path, Circle } from "react-native-svg";

import ThemedView from "../../components/ThemedView";
import ThemedScrollView from "../../components/ThemedScrollView";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { Colors } from "../../constants/Colors";
import { useUser } from "../../hooks/useUser";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Design tokens ────────────────────────────────────────────────────────────
const T = {
  accentGold:     "#F5C842",
  accentGoldDeep: "#C8A800",
  accentGoldLight:"#FFF3C0",
  coral:          "#FF7058",
  teal:           "#40596B",
  textDark:       "#2C1810",
  textMid:        "#7A5C3C",
  textLight:      "#BFA080",
  bgWarm:         "#FFF8ED",
  bgBorder:       "#F5DFA0",
  bgCard:         "#FFFDF7",
  error:          "#E53935",
  success:        "#4CAF50",
  successLight:   "#E8F5E9",
};

// ── Mini coin icon ───────────────────────────────────────────────────────────
function CoinIcon({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      <Circle cx="22" cy="22" r="21" fill={T.accentGold} />
      <Circle cx="22" cy="22" r="17" fill="none" stroke={T.accentGoldDeep} strokeWidth="2" />
      <Path
        d="M20 12 L20 32 M18 16 Q22 14 25 17 Q27 20 22 22 Q27 22 27 26 Q27 32 20 31"
        stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round"
      />
    </Svg>
  );
}

// ── Decorative background ────────────────────────────────────────────────────
function TopDecoration() {
  return (
    <View style={deco.container} pointerEvents="none">
      <Svg width={SCREEN_W} height={200} viewBox={`0 0 ${SCREEN_W} 200`}>
        <Circle cx={SCREEN_W * 0.15} cy={-10} r={130}
          fill={T.coral} fillOpacity={0.07} />
        <Circle cx={SCREEN_W * 0.9} cy={80} r={90}
          fill={T.accentGold} fillOpacity={0.11} />
        <Circle cx={SCREEN_W * 0.45} cy={170} r={40}
          fill={T.teal} fillOpacity={0.05} />
        <Path
          d={`M0,80 Q${SCREEN_W * 0.4},40 ${SCREEN_W * 0.65},75 Q${SCREEN_W * 0.85},100 ${SCREEN_W},60`}
          stroke={T.accentGold} strokeWidth="1.5" fill="none" strokeOpacity={0.35}
        />
      </Svg>
    </View>
  );
}

const deco = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
});

// ── Pill label ───────────────────────────────────────────────────────────────
function PillLabel({ children }) {
  return (
    <View style={pill.container}>
      <CoinIcon size={14} />
      <Text style={pill.text}>{children}</Text>
    </View>
  );
}

const pill = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: T.accentGoldLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: T.bgBorder,
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: T.textMid,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

// ── Password strength indicator ──────────────────────────────────────────────
function StrengthBar({ password }) {
  const getStrength = (pwd) => {
    if (!pwd || pwd.length < 4) return 0;
    let score = 0;
    if (pwd.length >= 8)        score++;
    if (/[A-Z]/.test(pwd))      score++;
    if (/[0-9]/.test(pwd))      score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const labels   = ["", "Weak", "Fair", "Good", "Strong"];
  const colors   = ["transparent", "#E53935", "#FF9800", "#F5C842", "#4CAF50"];

  if (!password) return null;

  return (
    <View style={str.container}>
      <View style={str.bars}>
        {[1, 2, 3, 4].map((n) => (
          <View key={n} style={[
            str.bar,
            { backgroundColor: n <= strength ? colors[strength] : "#F0E8D8" },
          ]} />
        ))}
      </View>
      <Text style={[str.label, { color: colors[strength] }]}>
        {labels[strength]}
      </Text>
    </View>
  );
}

const str = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -8,
    marginBottom: 10,
    gap: 8,
  },
  bars: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    width: 48,
    textAlign: "right",
  },
});

// ── Premium input ────────────────────────────────────────────────────────────
function PremiumInput({ label, valid, ...props }) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      valid === true ? T.success : T.bgBorder,
      T.accentGold,
    ],
  });

  return (
    <View style={inp.wrapper}>
      {label && <Text style={inp.label}>{label}</Text>}
      <Animated.View style={[inp.container, { borderColor }]}>
        <ThemedTextInput
          {...props}
          onFocus={() => { setFocused(true); props.onFocus?.(); }}
          onBlur={() => { setFocused(false); props.onBlur?.(); }}
          style={[inp.field, props.style]}
          placeholderTextColor={T.textLight}
        />
        {valid === true && (
          <Text style={inp.checkmark}>✓</Text>
        )}
      </Animated.View>
    </View>
  );
}

const inp = StyleSheet.create({
  wrapper: { marginBottom: 14, paddingHorizontal: 20 },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: T.textMid,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 6,
    marginLeft: 2,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDF7",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    shadowColor: T.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  field: {
    flex: 1,
    fontSize: 15,
    color: T.textDark,
    paddingVertical: 14,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  checkmark: {
    color: T.success,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});

// ── Gold CTA button ──────────────────────────────────────────────────────────
function GoldButton({ onPress, children }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 10 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10 }).start();

  return (
    <Animated.View style={[gbtn.shadow, { transform: [{ scale }] }]}>
      <ThemedButton
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={gbtn.container}
        activeOpacity={0.9}
      >
        <Text style={gbtn.text}>{children}</Text>
      </ThemedButton>
    </Animated.View>
  );
}

const gbtn = StyleSheet.create({
  shadow: {
    marginHorizontal: 20,
    marginTop: 6,
  },
  container: {
    backgroundColor: T.accentGold,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "#3D2600",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});

// ── Benefit chips ────────────────────────────────────────────────────────────
function BenefitsRow() {
  const chips = ["🐷 Track Goals", "📊 Smart Budget", "🏆 Milestones"];
  return (
    <View style={ben.row}>
      {chips.map((c) => (
        <View key={c} style={ben.chip}>
          <Text style={ben.chipText}>{c}</Text>
        </View>
      ))}
    </View>
  );
}

const ben = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 6,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: "rgba(245,200,66,0.12)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: T.bgBorder,
  },
  chipText: {
    fontSize: 11,
    color: T.textMid,
    fontWeight: "600",
  },
});

// ── Main Register Screen ─────────────────────────────────────────────────────
const Register = () => {
  const [email,             setEmail]             = useState("");
  const [password,          setPassword]          = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error,             setError]             = useState(null);

  const { register } = useUser();
  const { theme }    = useTheme();

  // Entrance animations
  const headerY = useRef(new Animated.Value(-30)).current;
  const headerO = useRef(new Animated.Value(0)).current;
  const cardY   = useRef(new Animated.Value(40)).current;
  const cardO   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY,  { toValue: 0, damping: 18, stiffness: 120, useNativeDriver: true }),
      Animated.timing(headerO,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(cardY,    { toValue: 0, damping: 18, stiffness: 100, delay: 150, useNativeDriver: true }),
      Animated.timing(cardO,    { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    setError(null);
    try {
      if (password !== confirmedPassword) {
        setError("Passwords do not match.");
        return;
      }
      await register(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

  const passwordsMatch =
    confirmedPassword.length > 0 && password === confirmedPassword;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={s.root}>
        <TopDecoration />

        <ThemedScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <Animated.View style={[s.header, {
            opacity: headerO,
            transform: [{ translateY: headerY }],
          }]}>
            <View style={s.logoMark}>
              <CoinIcon size={40} />
            </View>
            <Text style={s.appName}>Vmax</Text>
            <Text style={s.tagline}>Start saving smarter today</Text>
          </Animated.View>

          {/* ── Card ── */}
          <Animated.View style={[s.card, {
            opacity: cardO,
            transform: [{ translateY: cardY }],
          }]}>
            <PillLabel>Create Account</PillLabel>
            <Text style={s.cardTitle}>Join Vmax for free</Text>

            <BenefitsRow />

            <View style={s.fieldGroup}>
              <PremiumInput
                label="Email address"
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                valid={email.includes("@") && email.includes(".") ? true : undefined}
              />
              <PremiumInput
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <StrengthBar password={password} />
              <PremiumInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmedPassword}
                onChangeText={setConfirmedPassword}
                secureTextEntry
                valid={passwordsMatch ? true : undefined}
              />
            </View>

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠ {error}</Text>
              </View>
            )}

            <GoldButton onPress={handleSignUp}>Create Account</GoldButton>

            <Text style={s.terms}>
              By signing up you agree to our{" "}
              <Text style={s.termsLink}>Terms</Text> &{" "}
              <Text style={s.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Footer */}
            <View style={s.footerRow}>
              <Text style={s.footerText}>Already have an account?  </Text>
              <Link href="/login" replace>
                <Text style={s.footerLink}>Login</Text>
              </Link>
            </View>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ThemedScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bgWarm,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    paddingBottom: 22,
    paddingTop: 10,
    zIndex: 1,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: T.accentGoldLight,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: T.accentGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: T.textDark,
    letterSpacing: -0.5,
    marginBottom: 1,
  },
  tagline: {
    fontSize: 13,
    color: T.textLight,
    fontWeight: "500",
    letterSpacing: 0.3,
  },

  card: {
    marginHorizontal: 16,
    backgroundColor: T.bgCard,
    borderRadius: 28,
    paddingTop: 26,
    paddingBottom: 28,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    shadowColor: "rgba(200,140,0,0.15)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: T.textDark,
    textAlign: "center",
    marginBottom: 18,
    letterSpacing: -0.3,
  },

  fieldGroup: {
    marginTop: 4,
  },

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 14,
    backgroundColor: "#FFF0F0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFCDD2",
    padding: 12,
  },
  errorText: {
    color: T.error,
    fontSize: 13,
    fontWeight: "500",
  },

  terms: {
    textAlign: "center",
    fontSize: 11,
    color: T.textLight,
    marginTop: 14,
    marginHorizontal: 24,
    lineHeight: 17,
  },
  termsLink: {
    color: T.teal,
    fontWeight: "700",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  footerText: {
    fontSize: 13,
    color: T.textLight,
    fontWeight: "500",
  },
  footerLink: {
    fontSize: 13,
    fontWeight: "800",
    color: T.teal,
    letterSpacing: 0.2,
  },
});