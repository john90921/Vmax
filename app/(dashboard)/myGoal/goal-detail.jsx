/**
 * myGoal/goal-detail.jsx
 *
 * Displays full detail for a single saving goal.
 * Receives `id` via query param: router.push(`/(dashboard)/myGoal/goal-detail?id=${item.id}`)
 */

import { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import Spacer     from "../../../components/Spacer";

// ── Design tokens (matching index.jsx) ───────────────────────────────────────
const T = {
  accentGold:      "#F5C842",
  accentGoldDeep:  "#C8A800",
  accentGoldLight: "#FFF3C0",
  accentGoldMid:   "#F5DFA0",
  coral:           "#FF7058",
  teal:            "#40596B",
  textDark:        "#2C1810",
  textMid:         "#7A5C3C",
  textLight:       "#BFA080",
  bgWarm:          "#FFF8ED",
  bgBorder:        "#F5DFA0",
  bgCard:          "#FFFDF7",
  green:           "#4CAF50",
  greenLight:      "#E8F5E9",
};

const { width: SCREEN_W } = Dimensions.get("window");

// ── Shared goal data (mirrors index.jsx — replace with a shared store/API) ───
const GOALS = [
  { id: "1", title: "New Laptop",     emoji: "💻", target_amount: 2000, current_amount: 800,  target_date: "2025-07-31", status: "active" },
  { id: "2", title: "Bali Trip",      emoji: "🌴", target_amount: 5000, current_amount: 1200, target_date: "2025-08-31", status: "active" },
  { id: "3", title: "Emergency Fund", emoji: "🛡️", target_amount: 1000, current_amount: 400,  target_date: "2025-09-30", status: "active" },
  { id: "4", title: "New Headphones", emoji: "🎧", target_amount: 600,  current_amount: 600,  target_date: "2025-03-31", completed_date: "2025-03-15", status: "completed" },
  { id: "5", title: "Birthday Gift",  emoji: "🎁", target_amount: 300,  current_amount: 300,  target_date: "2025-04-15", completed_date: "2025-04-10", status: "completed" },
];

// ── Mock daily contributions (replace with real data per goal id) ─────────────
const MOCK_CONTRIBUTIONS = {
  "1": [
    { date: "2025-05-22", amount: 18.50 },
    { date: "2025-05-21", amount: 22.10 },
    { date: "2025-05-20", amount: 15.80 },
    { date: "2025-05-19", amount: 20.00 },
    { date: "2025-05-18", amount: 17.40 },
    { date: "2025-05-17", amount: 25.00 },
  ],
  "2": [
    { date: "2025-05-22", amount: 32.70 },
    { date: "2025-05-21", amount: 28.40 },
    { date: "2025-05-20", amount: 35.10 },
    { date: "2025-05-19", amount: 18.60 },
    { date: "2025-05-18", amount: 32.70 },
    { date: "2025-05-17", amount: 29.90 },
  ],
  "3": [
    { date: "2025-05-22", amount: 12.30 },
    { date: "2025-05-21", amount: 10.00 },
    { date: "2025-05-20", amount: 14.50 },
    { date: "2025-05-19", amount: 8.70 },
    { date: "2025-05-18", amount: 11.20 },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const daysRemaining = (str) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((new Date(str) - today) / 86_400_000), 1);
};

const fmtDate = (str) =>
  new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });

const fmtContribDate = (str) =>
  new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });

// ── Animated progress bar ─────────────────────────────────────────────────────
function ProgressBar({ progress, isComplete }) {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: Math.min(Math.max(progress, 0), 1),
      damping: 18, stiffness: 80, useNativeDriver: false,
    }).start();
  }, [progress]);

  const barW = barAnim.interpolate({
    inputRange: [0, 1], outputRange: ["0%", "100%"], extrapolate: "clamp",
  });

  return (
    <View>
      <View style={[s.progressTrack, { backgroundColor: T.accentGoldMid + "55" }]}>
        <Animated.View
          style={[
            s.progressFill,
            { width: barW, backgroundColor: isComplete ? T.green : T.accentGold },
          ]}
        />
        {/* Milestone ticks */}
        {[0.25, 0.5, 0.75].map((m) => (
          <View key={m} style={[s.progressTick, { left: `${m * 100}%` }]} />
        ))}
      </View>
      {/* Milestone labels */}
      <View style={s.milestoneLabelRow}>
        {["0%", "25%", "50%", "75%", "100%"].map((lbl) => (
          <ThemedText key={lbl} style={[s.milestoneLabel, { color: T.textLight }]}>
            {lbl}
          </ThemedText>
        ))}
      </View>
    </View>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, valueColor }) {
  return (
    <View style={[s.statCard, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>
      <ThemedText style={s.statIcon}>{icon}</ThemedText>
      <ThemedText style={[s.statLabel, { color: T.textLight }]}>{label}</ThemedText>
      <ThemedText style={[s.statValue, { color: valueColor ?? T.textDark }]}>{value}</ThemedText>
    </View>
  );
}

// ── Contribution row ──────────────────────────────────────────────────────────
function ContribRow({ date, amount, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 300, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        s.contribRow,
        { backgroundColor: T.bgCard, borderColor: T.bgBorder },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[s.contribDot, { backgroundColor: T.accentGoldMid }]} />
      <ThemedText style={[s.contribDate, { color: T.textMid }]}>
        {fmtContribDate(date)}
      </ThemedText>
      <ThemedText style={[s.contribAmt, { color: T.teal }]}>
        + RM {amount.toFixed(2)}
      </ThemedText>
    </Animated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function GoalDetailScreen() {
  const { id }  = useLocalSearchParams();
  const router  = useRouter();

  const goal = GOALS.find((g) => g.id === id);

  // Guard: goal not found
  if (!goal) {
    return (
      <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm, justifyContent: "center", alignItems: "center" }}>
        <ThemedText style={{ color: T.textMid, fontSize: 16 }}>Goal not found.</ThemedText>
        <Spacer height={16} />
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={{ color: T.teal, fontWeight: "700" }}>← Go back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const progress     = goal.current_amount / goal.target_amount;
  const pct          = Math.round(progress * 100);
  const remaining    = goal.target_amount - goal.current_amount;
  const days         = daysRemaining(goal.target_date);
  const isComplete   = goal.status === "completed";
  const contributions = MOCK_CONTRIBUTIONS[id] ?? [];

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero card ── */}
        <View style={[s.heroCard, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>
          {/* Goal identity row */}
          <View style={s.goalIdentityRow}>
            <View style={[s.emojiBubble, { backgroundColor: T.accentGoldLight }]}>
              <ThemedText style={s.goalEmoji}>{goal.emoji}</ThemedText>
            </View>
            <View style={s.goalTitleBlock}>
              <ThemedText style={[s.goalTitle, { color: T.textDark }]}>{goal.title}</ThemedText>
              <ThemedText style={[s.goalTarget, { color: T.textLight }]}>
                Target: RM {goal.target_amount.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.pctPill, { backgroundColor: T.accentGoldLight, borderColor: T.bgBorder }]}>
              <ThemedText style={[s.pctText, { color: T.textMid }]}>{pct}%</ThemedText>
            </View>
          </View>

          <Spacer height={18} />

          {/* Progress bar */}
          <ProgressBar progress={progress} isComplete={isComplete} />

          <Spacer height={18} />

          {/* Saved / Remaining */}
          <View style={s.amountsRow}>
            <View>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>SAVED</ThemedText>
              <ThemedText style={[s.amtValue, { color: T.teal }]}>
                RM {goal.current_amount.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.amtDivider, { backgroundColor: T.bgBorder }]} />
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>REMAINING</ThemedText>
              <ThemedText style={[s.amtValue, { color: isComplete ? T.green : T.coral }]}>
                {isComplete ? "Completed 🎉" : `RM ${remaining.toLocaleString("en-MY")}`}
              </ThemedText>
            </View>
          </View>
        </View>

        <Spacer height={14} />

        {/* ── Stat row ── */}
        <View style={s.statRow}>
          <StatCard
            icon="📅"
            label="TARGET"
            value={fmtDate(goal.target_date)}
            valueColor={T.textDark}
          />
          <StatCard
            icon="⏳"
            label="DAYS LEFT"
            value={isComplete ? "Done" : `${days}d`}
            valueColor={isComplete ? T.green : T.coral}
          />
          <StatCard
            icon="🎯"
            label="PROGRESS"
            value={`${pct}%`}
            valueColor={T.textDark}
          />
        </View>

        <Spacer height={20} />

        {/* ── Action buttons ── */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.btnTopUp, { backgroundColor: T.accentGold }]}
            activeOpacity={0.82}
            onPress={() => {
              // TODO: navigate to top-up screen or open modal
            }}
          >
            <ThemedText style={s.btnTopUpText}>+ TOP-UP</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btnEdit, { borderColor: T.bgBorder, backgroundColor: T.bgCard }]}
            activeOpacity={0.82}
            onPress={() => {
              // TODO: navigate to edit screen
            }}
          >
            <ThemedText style={[s.btnEditText, { color: T.textMid }]}>✏️ EDIT GOAL</ThemedText>
          </TouchableOpacity>
        </View>

        <Spacer height={28} />

        {/* ── Daily contributions ── */}
        <ThemedText style={[s.sectionTitle, { color: T.textMid }]}>
          DAILY CONTRIBUTIONS
        </ThemedText>
        <Spacer height={12} />

        {contributions.length === 0 ? (
          <View style={[s.emptyContrib, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>
            <ThemedText style={{ color: T.textLight, fontSize: 13 }}>
              No contributions recorded yet.
            </ThemedText>
          </View>
        ) : (
          contributions.map((c, i) => (
            <ContribRow key={c.date} date={c.date} amount={c.amount} index={i} />
          ))
        )}

        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  heroCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: "rgba(200,140,0,0.10)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 5,
  },
  goalIdentityRow:  { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBubble:      { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  goalEmoji:        { fontSize: 24 },
  goalTitleBlock:   { flex: 1 },
  goalTitle:        { fontSize: 18, fontWeight: "800", letterSpacing: -0.3, marginBottom: 3 },
  goalTarget:       { fontSize: 12 },
  pctPill:          { borderRadius: 12, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  pctText:          { fontSize: 15, fontWeight: "800" },

  progressTrack:    { height: 11, borderRadius: 10, overflow: "hidden", position: "relative" },
  progressFill:     { height: "100%", borderRadius: 10 },
  progressTick:     { position: "absolute", top: 0, width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.6)" },
  milestoneLabelRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  milestoneLabel:   { fontSize: 9, fontWeight: "600", letterSpacing: 0.3 },

  amountsRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amtLabel:         { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  amtValue:         { fontSize: 20, fontWeight: "800" },
  amtDivider:       { width: 1, height: 36 },

  statRow:          { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "rgba(200,140,0,0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  statIcon:         { fontSize: 22 },
  statLabel:        { fontSize: 9, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },
  statValue:        { fontSize: 13, fontWeight: "800", textAlign: "center" },

  actionRow:        { flexDirection: "row", gap: 12 },
  btnTopUp: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: T.accentGold,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTopUpText:     { fontSize: 14, fontWeight: "900", color: "#3D2600", letterSpacing: 1 },
  btnEdit: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnEditText:      { fontSize: 14, fontWeight: "700", letterSpacing: 0.5 },

  sectionTitle:     { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, textAlign: "center" },

  contribRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  contribDot:       { width: 8, height: 8, borderRadius: 4 },
  contribDate:      { flex: 1, fontSize: 13, fontWeight: "500" },
  contribAmt:       { fontSize: 14, fontWeight: "700" },

  emptyContrib: {
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 20,
    alignItems: "center",
  },
});