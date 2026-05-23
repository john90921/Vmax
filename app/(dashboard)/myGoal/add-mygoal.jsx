/**
 * myGoal/add-mygoal.jsx — Premium redesign
 * Mirrors PremiumInput + GoldButton patterns from Login screen exactly.
 */

import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Animated, Text, Dimensions, Keyboard, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedView       from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedTextInput  from "../../../components/ThemedTextInput";
import ThemedButton     from "../../../components/ThemedButton";
import Spacer           from "../../../components/Spacer";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Design tokens (identical to Login) ───────────────────────────────────────
const T = {
  accentGold:      "#F5C842",
  accentGoldDeep:  "#C8A800",
  accentGoldLight: "#FFF3C0",
  coral:           "#FF7058",
  teal:            "#40596B",
  textDark:        "#2C1810",
  textMid:         "#7A5C3C",
  textLight:       "#BFA080",
  bgWarm:          "#FFF8ED",
  bgBorder:        "#F5DFA0",
  bgCard:          "#FFFDF7",
};

// ── Mock salary data (from profile) ──────────────────────────────────────────
const SALARY         = 3000;
const DAILY_SAVEABLE = 60; // pulled fresh from formula layer in production

const formatDate = (d) =>
  d
    ? d.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })
    : "";

// ── Top decoration (mirrored from Login) ─────────────────────────────────────
function TopDecoration() {
  return (
    <View style={dec.wrap} pointerEvents="none">
      <Svg width={SCREEN_W} height={200} viewBox={`0 0 ${SCREEN_W} 200`}>
        <Circle cx={SCREEN_W * 0.85} cy={-20} r={160} fill={T.accentGold}  fillOpacity={0.11} />
        <Circle cx={SCREEN_W * 0.1}  cy={60}  r={70}  fill={T.coral}       fillOpacity={0.07} />
        <Circle cx={SCREEN_W * 0.5}  cy={180} r={30}  fill={T.teal}        fillOpacity={0.05} />
        <Path
          d={`M0,100 Q${SCREEN_W*0.3},60 ${SCREEN_W*0.7},90 Q${SCREEN_W},110 ${SCREEN_W},70`}
          stroke={T.accentGold} strokeWidth="1.5" fill="none" strokeOpacity={0.35}
        />
      </Svg>
    </View>
  );
}

const dec = StyleSheet.create({
  wrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },
});

// ── Premium animated input (identical pattern to Login) ───────────────────────
function PremiumInput({ label, ...props }) {
  const [focused,  setFocused]  = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0, duration: 200, useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor    = borderAnim.interpolate({ inputRange: [0,1], outputRange: [T.bgBorder, T.accentGold] });
  const shadowOpacity  = borderAnim.interpolate({ inputRange: [0,1], outputRange: [0, 0.18] });

  return (
    <View style={inp.wrapper}>
      {label && <Text style={inp.label}>{label}</Text>}
      <Animated.View style={[inp.container, { borderColor, shadowOpacity, shadowColor: T.accentGold }]}>
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
  wrapper:   { marginBottom: 14 },
  label:     { fontSize: 11, fontWeight: "700", color: T.textMid, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, marginLeft: 2 },
  container: { flexDirection: "row", alignItems: "center", backgroundColor: T.bgCard, borderRadius: 16, borderWidth: 1.5, paddingHorizontal: 14, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 },
  field:     { flex: 1, fontSize: 15, color: T.textDark, paddingVertical: 14, backgroundColor: "transparent", borderWidth: 0 },
});

// ── Pressable date field (same visual as PremiumInput) ────────────────────────
function DateField({ label, value, onPress, focused }) {
  const borderAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(borderAnim, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: false }).start();
  }, [focused]);
  const borderColor   = borderAnim.interpolate({ inputRange: [0,1], outputRange: [T.bgBorder, T.accentGold] });
  const shadowOpacity = borderAnim.interpolate({ inputRange: [0,1], outputRange: [0, 0.18] });

  return (
    <View style={inp.wrapper}>
      {label && <Text style={inp.label}>{label}</Text>}
      <Animated.View style={[inp.container, { borderColor, shadowOpacity, shadowColor: T.accentGold }]}>
        <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 14 }}>
          <Text style={{ fontSize: 15, color: value ? T.textDark : T.textLight }}>
            {value || "Select a target date"}
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ── Gold CTA button (identical to Login) ──────────────────────────────────────
function GoldButton({ onPress, children }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={[btn.shadow, { transform: [{ scale }] }]}>
      <ThemedButton
        onPress={onPress}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, damping: 10 }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, damping: 10 }).start()}
        style={btn.container}
        activeOpacity={0.9}
      >
        <Text style={btn.text}>{children}</Text>
      </ThemedButton>
    </Animated.View>
  );
}

const btn = StyleSheet.create({
  shadow: { borderRadius: 18, shadowColor: T.accentGold, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4, marginTop: 6 },
  container: { backgroundColor: T.accentGold, borderRadius: 18, paddingVertical: 16, alignItems: "center", width: "100%" },
  text:      { color: "#3D2600", fontWeight: "800", fontSize: 15, letterSpacing: 1.5, textTransform: "uppercase" },
});

// ── AI suggestion pill ────────────────────────────────────────────────────────
function SuggestionPill({ children }) {
  if (!children) return null;
  return (
    <View style={sug.wrap}>
      <Text style={sug.icon}>💡</Text>
      <Text style={sug.text}>{children}</Text>
    </View>
  );
}

const sug = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: T.accentGoldLight, borderRadius: 14, borderWidth: 1, borderColor: T.bgBorder, padding: 14, marginBottom: 14 },
  icon: { fontSize: 16, marginTop: 1 },
  text: { flex: 1, fontSize: 13, color: T.textMid, lineHeight: 19 },
});

// ── Screen ────────────────────────────────────────────────────────────────────
const AddMyGoal = () => {
  const router = useRouter();
  const [goalName,     setGoalName]     = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [date,         setDate]         = useState(null);
  const [showPicker,   setShowPicker]   = useState(false);

  // Entrance animation
  const cardY = useRef(new Animated.Value(36)).current;
  const cardO = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardY, { toValue: 0, damping: 18, stiffness: 100, useNativeDriver: true }),
      Animated.timing(cardO, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // AI date suggestion
  const daysNeeded = targetAmount && DAILY_SAVEABLE > 0
    ? Math.ceil(parseFloat(targetAmount) / DAILY_SAVEABLE)
    : null;
  const suggestedDate = daysNeeded ? new Date(Date.now() + daysNeeded * 86_400_000) : null;

  const suggestionText = daysNeeded
    ? daysNeeded > 365
      ? `⚠️ At your current saving rate (RM ${DAILY_SAVEABLE}/day), this goal may take over a year. Consider reducing spending or the target amount.`
      : `At RM ${DAILY_SAVEABLE}/day you'll reach this in ${daysNeeded} days — by ${formatDate(suggestedDate)}.`
    : null;

  const handleStart = () => {
    // Validate + submit → replace with API call
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: T.bgWarm }}>
        <TopDecoration />

        <ThemedScrollView
          contentContainerStyle={pg.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Heading */}
          <Animated.View style={[pg.headingBlock, { opacity: cardO, transform: [{ translateY: cardY }] }]}>
            <Text style={pg.heading}>Small Steps Lead to</Text>
            <Text style={[pg.headingAccent, { color: T.accentGoldDeep }]}>Big Changes 💰</Text>
            <Text style={[pg.sub, { color: T.textLight }]}>Define your next milestone</Text>
          </Animated.View>

          {/* Form card */}
          <Animated.View style={[pg.card, { opacity: cardO, transform: [{ translateY: cardY }] }]}>

            <PremiumInput
              label="Goal name"
              placeholder="e.g. Bali Trip, New Laptop…"
              value={goalName}
              onChangeText={setGoalName}
            />

            <PremiumInput
              label="Target amount (RM)"
              placeholder="e.g. 5000"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
            />

            <DateField
              label="Target completion date"
              value={formatDate(date)}
              onPress={() => setShowPicker(true)}
              focused={showPicker}
            />

            {showPicker && (
              <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(_, selected) => {
                  setShowPicker(false);
                  if (selected) setDate(selected);
                }}
              />
            )}

            <SuggestionPill>{suggestionText}</SuggestionPill>

            {/* Daily allocation preview */}
            {targetAmount && !daysNeeded && null}

            <GoldButton onPress={handleStart}>Start Journey</GoldButton>

          </Animated.View>

          <Spacer height={40} />
        </ThemedScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddMyGoal;

const pg = StyleSheet.create({
  scroll:       { flexGrow: 1, paddingTop: 34, paddingHorizontal: 18, paddingBottom: 36 },
  headingBlock: { alignItems: "center", marginBottom: 20, zIndex: 1 },
  heading:      { fontSize: 20, fontWeight: "700", color: "#2C1810", letterSpacing: -0.3 },
  headingAccent:{ fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 },
  sub:          { fontSize: 13, fontWeight: "500", letterSpacing: 0.2, marginTop: 6 },
  card: {
    backgroundColor: T.bgCard,
    borderRadius: 28,
    padding: 22,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    shadowColor: "rgba(200,140,0,0.15)",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 12,
  },
});