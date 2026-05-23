/**
 * (auth)/login.jsx — Redesigned Login Screen
 *
 * Design language: warm-luxury, consistent with PiggyBankTracker palette.
 * Palette pulled from PiggyBankTracker:
 *   accentGold  #F5C842   textDark  #2C1810   textMid  #7A5C3C
 *   textLight   #BFA080   bgBorder  #F5DFA0   fillWater #77c4ff
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
import { Link, useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import Svg, { Path, Circle, Ellipse, G } from "react-native-svg";

import ThemedView from "../../components/ThemedView";
import ThemedScrollView from "../../components/ThemedScrollView";
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { Colors } from "../../constants/Colors";
import { useUser } from "../../hooks/useUser";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

// ── Design tokens (mirrored from PiggyBankTracker) ──────────────────────────
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
  errorBg:        "#FFF0F0",
};

// ── Mini piggy coin icon ─────────────────────────────────────────────────────
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

// ── Decorative top arc ───────────────────────────────────────────────────────
function TopDecoration() {
  return (
    <View style={deco.container} pointerEvents="none">
      <Svg width={SCREEN_W} height={220} viewBox={`0 0 ${SCREEN_W} 220`}>
        {/* Large warm circle */}
        <Circle cx={SCREEN_W * 0.85} cy={-20} r={160}
          fill={T.accentGold} fillOpacity={0.13} />
        {/* Smaller accent circle */}
        <Circle cx={SCREEN_W * 0.1} cy={60} r={70}
          fill={T.coral} fillOpacity={0.08} />
        {/* Subtle teal dot */}
        <Circle cx={SCREEN_W * 0.5} cy={180} r={30}
          fill={T.teal} fillOpacity={0.06} />
        {/* Gold arc line */}
        <Path
          d={`M0,100 Q${SCREEN_W * 0.3},60 ${SCREEN_W * 0.7},90 Q${SCREEN_W},110 ${SCREEN_W},70`}
          stroke={T.accentGold} strokeWidth="1.5" fill="none" strokeOpacity={0.4}
        />
      </Svg>
    </View>
  );
}

const deco = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    pointerEvents: "none",
  },
});

// ── Branded pill label ───────────────────────────────────────────────────────
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

// ── Premium text field ───────────────────────────────────────────────────────
function PremiumInput({ label, icon, ...props }) {
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
    outputRange: [T.bgBorder, T.accentGold],
  });
  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.18],
  });

  return (
    <View style={inp.wrapper}>
      {label && <Text style={inp.label}>{label}</Text>}
      <Animated.View style={[
        inp.container,
        { borderColor, shadowOpacity, shadowColor: T.accentGold },
      ]}>
        {icon && <View style={inp.iconSlot}>{icon}</View>}
        <ThemedTextInput
          {...props}
          onFocus={() => { setFocused(true); props.onFocus?.(); }}
          onBlur={() => { setFocused(false); props.onBlur?.(); }}
          style={[inp.field, props.style]}
          placeholderTextColor={T.textLight}
        />
      </Animated.View>
    </View>
  );
}

const inp = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    paddingHorizontal: 20,
  },
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
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  iconSlot: {
    marginRight: 10,
    opacity: 0.5,
  },
  field: {
    flex: 1,
    fontSize: 15,
    color: T.textDark,
    paddingVertical: 14,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
});

// ── Gold CTA button ──────────────────────────────────────────────────────────
function GoldButton({ onPress, children, loading }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 10 }).start();
  const handlePressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 10 }).start();

  return (
    <Animated.View style={[btn.shadow, { transform: [{ scale }] }]}>
      <ThemedButton
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={btn.container}
        activeOpacity={0.9}
      >
        <Text style={btn.text}>{children}</Text>
      </ThemedButton>
    </Animated.View>
  );
}

const btn = StyleSheet.create({
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

// ── Divider ──────────────────────────────────────────────────────────────────
function OrDivider() {
  return (
    <View style={div.row}>
      <View style={div.line} />
      <Text style={div.text}>or continue with</Text>
      <View style={div.line} />
    </View>
  );
}

const div = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 18,
  },
  line: { flex: 1, height: 1, backgroundColor: T.bgBorder },
  text: {
    marginHorizontal: 12,
    fontSize: 11,
    color: T.textLight,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

// ── Main Login Screen ────────────────────────────────────────────────────────
const Login = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState(null);

  const router       = useRouter();
  const { login }    = useUser();
  const { theme }    = useTheme();

  // Entrance animations
  const headerY  = useRef(new Animated.Value(-30)).current;
  const headerO  = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(40)).current;
  const cardO    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(headerY,  { toValue: 0, damping: 18, stiffness: 120, useNativeDriver: true }),
      Animated.timing(headerO,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(cardY,    { toValue: 0, damping: 18, stiffness: 100, delay: 150, useNativeDriver: true }),
      Animated.timing(cardO,    { toValue: 1, duration: 500, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (e) {
      setError(e.message);
    }
  };

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
            <Text style={s.tagline}>Your smart savings companion</Text>
          </Animated.View>

          {/* ── Card ── */}
          <Animated.View style={[s.card, {
            opacity: cardO,
            transform: [{ translateY: cardY }],
          }]}>
            <PillLabel>Welcome Back</PillLabel>
            <Text style={s.cardTitle}>Sign in to your account</Text>

            <View style={s.fieldGroup}>
              <PremiumInput
                label="Email address"
                placeholder="hello@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <PremiumInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={s.forgotRow}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </View>

            {error && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠ {error}</Text>
              </View>
            )}

            <GoldButton onPress={handleLogin}>Login</GoldButton>

            {/* Footer */}
            <View style={s.footerRow}>
              <Text style={s.footerText}>Don't have an account?  </Text>
              <Link href="/register" replace>
                <Text style={s.footerLink}>Sign Up</Text>
              </Link>
            </View>
          </Animated.View>

          {/* Bottom breathing room */}
          <View style={{ height: 40 }} />
        </ThemedScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bgWarm,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 60,
  },

  // Header
  header: {
    alignItems: "center",
    paddingBottom: 32,
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

  // Card
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
    marginBottom: 22,
    letterSpacing: -0.3,
  },

  fieldGroup: {
    marginTop: 4,
  },

  forgotRow: {
    alignItems: "flex-end",
    paddingHorizontal: 22,
    marginTop: -4,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 12,
    color: T.teal,
    fontWeight: "600",
    letterSpacing: 0.2,
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

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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