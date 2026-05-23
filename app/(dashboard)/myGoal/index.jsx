/**
 * myGoal/index.jsx  v3
 *
 * Key fix: registerScrollRef receives the FlatList ref object directly.
 * The ref is registered in a useLayoutEffect (not useEffect) so it's
 * available before the first tutorial step measures anything.
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Animated, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedFlatList   from "../../../components/ThemedFlatList";
import ThemedText       from "../../../components/ThemedText";
import ThemedView       from "../../../components/ThemedView";
import PiggyBankTracker from "../../../components/PiggyBankTracker";
import Spacer           from "../../../components/Spacer";

import { useTutorial } from "./GoalTutorialOverlay";

const { width: SCREEN_W } = Dimensions.get("window");

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

const SALARY         = 3000;
const EXPENSES_TODAY = 40;

const GOALS = [
  { id: "1", title: "New Laptop",     emoji: "💻", target_amount: 2000, current_amount: 800,  target_date: "2025-07-31", status: "active" },
  { id: "2", title: "Bali Trip",      emoji: "🌴", target_amount: 5000, current_amount: 1200, target_date: "2025-08-31", status: "active" },
  { id: "3", title: "Emergency Fund", emoji: "🛡️", target_amount: 1000, current_amount: 400,  target_date: "2025-09-30", status: "active" },
  { id: "4", title: "New Headphones", emoji: "🎧", target_amount: 600,  current_amount: 600,  target_date: "2025-03-31", completed_date: "2025-03-15", status: "completed" },
  { id: "5", title: "Birthday Gift",  emoji: "🎁", target_amount: 300,  current_amount: 300,  target_date: "2025-04-15", completed_date: "2025-04-10", status: "completed" },
];

const daysRemaining = (str) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((new Date(str) - today) / 86_400_000), 1);
};
const fmtDate = (str) =>
  new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });

// ── SVG decoration ────────────────────────────────────────────────────────────
function WarmDecoration() {
  return (
    <View style={s.decoWrap} pointerEvents="none">
      <Svg width={SCREEN_W} height={160} viewBox={`0 0 ${SCREEN_W} 160`}>
        <Circle cx={SCREEN_W * 0.9} cy={20}  r={110} fill={T.accentGold} fillOpacity={0.08} />
        <Circle cx={SCREEN_W * 0.1} cy={120} r={60}  fill={T.coral}      fillOpacity={0.06} />
        <Circle cx={SCREEN_W * 0.5} cy={-10} r={40}  fill={T.teal}       fillOpacity={0.05} />
        <Path
          d={`M0,80 Q${SCREEN_W*0.3},50 ${SCREEN_W*0.65},70 Q${SCREEN_W},85 ${SCREEN_W},55`}
          stroke={T.accentGold} strokeWidth="1.2" fill="none" strokeOpacity={0.3}
        />
      </Svg>
    </View>
  );
}

// ── Summary card ──────────────────────────────────────────────────────────────
// tutorialRef is a callback-ref from registerRef(); collapsable={false} is
// mandatory on Android so measureInWindow works inside a FlatList.
const SummaryCard = ({ label, value, valueColor, icon, infoKey }) => {
  const { showInfo } = useTutorial();
  return (
    <TouchableOpacity
      onPress={() => showInfo(infoKey)}
      activeOpacity={0.75}
      style={[s.summaryCard, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}
    >
      <ThemedText style={s.summaryIcon}>{icon}</ThemedText>
      <ThemedText style={[s.summaryLabel, { color: T.textLight }]}>{label}</ThemedText>
      <ThemedText style={[s.summaryValue, { color: valueColor ?? T.textDark }]}>{value}</ThemedText>
      <ThemedText style={[s.summaryHint, { color: T.textLight }]}>ⓘ</ThemedText>
    </TouchableOpacity>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
function GoldProgressBar({ progress, isGoalReached }) {
  const barAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: Math.min(Math.max(progress, 0), 1),
      damping: 18, stiffness: 80, useNativeDriver: false,
    }).start();
  }, [progress]);
  const barW = barAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"], extrapolate: "clamp" });
  return (
    <View style={[s.progressTrack, { backgroundColor: T.accentGoldMid + "55" }]}>
      <Animated.View style={[s.progressFill, { width: barW, backgroundColor: isGoalReached ? T.green : T.accentGold }]} />
      {[0.25, 0.5, 0.75].map((m) => (
        <View key={m} style={[s.progressMark, { left: `${m * 100}%` }]} />
      ))}
    </View>
  );
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children, lineColor }) {
  return (
    <View style={s.sectionLabelWrap}>
      <View style={[s.sectionLine, { backgroundColor: lineColor ?? T.accentGoldMid }]} />
      <ThemedText style={[s.sectionLabelText, { color: T.textMid }]}>{children}</ThemedText>
      <View style={[s.sectionLine, { backgroundColor: lineColor ?? T.accentGoldMid }]} />
    </View>
  );
}

// ── Goal card ─────────────────────────────────────────────────────────────────
function GoalCard({ item, contribution, daily_saveable, index, onPress, tutorialRef }) {
  const translateY = useRef(new Animated.Value(28)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 360, delay: index * 80, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 16, stiffness: 100, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const progress  = item.current_amount / item.target_amount;
  const pct       = Math.round(progress * 100);
  const remaining = item.target_amount - item.current_amount;
  const days      = daysRemaining(item.target_date);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
        {/*
          collapsable={false} — critical for Android measureInWindow inside lists.
          tutorialRef is only passed for index === 0.
        */}
        <View
          ref={tutorialRef}
          collapsable={false}
          style={[s.goalCard, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}
        >
          <View style={s.goalHeader}>
            <View style={[s.emojiBubble, { backgroundColor: T.accentGoldLight }]}>
              <ThemedText style={s.goalEmoji}>{item.emoji}</ThemedText>
            </View>
            <View style={s.goalTitleBlock}>
              <ThemedText style={[s.goalTitle, { color: T.textDark }]}>{item.title}</ThemedText>
              <ThemedText style={[s.goalSubtitle, { color: T.textLight }]}>
                🗓 {fmtDate(item.target_date)} · {days}d left
              </ThemedText>
            </View>
            <View style={[s.pctPill, { backgroundColor: T.accentGoldLight, borderColor: T.bgBorder }]}>
              <ThemedText style={[s.pctText, { color: T.textMid }]}>{pct}%</ThemedText>
            </View>
          </View>

          <Spacer height={14} />
          <GoldProgressBar progress={progress} isGoalReached={pct >= 100} />
          <Spacer height={10} />

          <View style={s.amountsRow}>
            <View>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>SAVED</ThemedText>
              <ThemedText style={[s.amtValue, { color: T.teal }]}>
                RM {item.current_amount.toLocaleString("en-MY")}
              </ThemedText>
              <ThemedText style={[s.amtLabel, { color: T.textLight, marginTop: 2 }]}>
                OF RM {item.target_amount.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.amtDivider, { backgroundColor: T.bgBorder }]} />
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>REMAINING</ThemedText>
              <ThemedText style={[s.amtValue, { color: T.coral }]}>
                RM {remaining.toLocaleString("en-MY")}
              </ThemedText>
            </View>
          </View>

          <Spacer height={12} />

          <View style={s.contribRow}>
            <ThemedText style={[s.contribHint, { color: T.textLight }]}>
              Saved today{" "}
              <ThemedText style={{ color: T.textLight, fontSize: 10 }}>
                (from RM {daily_saveable.toFixed(0)} saveable)
              </ThemedText>
            </ThemedText>
            <View style={[s.contribBadge, { backgroundColor: T.accentGold, shadowColor: T.accentGold }]}>
              <ThemedText style={s.contribText}>+ RM {contribution.toFixed(2)}</ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Completed card ────────────────────────────────────────────────────────────
function CompletedGoalCard({ item }) {
  return (
    <View style={[s.completedCard, { backgroundColor: T.greenLight, borderColor: T.green + "40" }]}>
      <ThemedText style={s.goalEmoji}>{item.emoji}</ThemedText>
      <View style={{ flex: 1 }}>
        <ThemedText style={[s.completedTitle, { color: T.teal }]}>{item.title}</ThemedText>
        <ThemedText style={[s.completedMeta, { color: T.textLight }]}>
          RM {item.target_amount.toLocaleString()} · Done {fmtDate(item.completed_date)}
        </ThemedText>
      </View>
      <ThemedText style={[s.checkmark, { color: T.green }]}>✓</ThemedText>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
const MyGoalIndex = () => {
  const router = useRouter();
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const { showInfo } = useTutorial(); 

  const active    = GOALS.filter((g) => g.status === "active");
  const completed = GOALS.filter((g) => g.status === "completed");

  const daily_budget   = SALARY / 30;
  const daily_saveable = Math.max(daily_budget - EXPENSES_TODAY, 0);

  const contributions = useMemo(() => {
    const weights    = active.map((g) => 1 / daysRemaining(g.target_date));
    const sumWeights = weights.reduce((a, b) => a + b, 0);
    return active.map((_, i) =>
      sumWeights > 0 ? daily_saveable * (weights[i] / sumWeights) : 0
    );
  }, [active, daily_saveable]);

  const totalCurrent = active.reduce((sum, g) => sum + g.current_amount, 0);
  const totalTarget  = active.reduce((sum, g) => sum + g.target_amount,  0);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <ThemedFlatList
        contentContainerStyle={s.listContent}
        data={active}
        keyExtractor={(item) => item.id}

        ListHeaderComponent={
          <>
            <WarmDecoration />
            <PiggyBankTracker
              currentAmount={totalCurrent}
              goalAmount={totalTarget}
              currency="RM"
              goalLabel="All Active Goals"
              onAddSavings={() => router.push("/(dashboard)/myGoal/add-mygoal")}
            />
            <Spacer height={6} />

            <View style={s.summaryRow}>
              <SummaryCard icon="💼" label="Daily Budget"  value={`RM ${daily_budget.toFixed(0)}`}    valueColor={T.textDark} infoKey="dailyBudget" />
<SummaryCard icon="🧾" label="Spent Today"   value={`RM ${EXPENSES_TODAY}`}             valueColor={T.coral}    infoKey="spentToday" />
<SummaryCard icon="🪙" label="Saveable"      value={`RM ${daily_saveable.toFixed(0)}`}  valueColor={T.teal}     infoKey="saveable" />
            </View>

            <Spacer height={24} />
            <SectionLabel>Active Goals ({active.length})</SectionLabel>
            <Spacer height={10} />
          </>
        }

        renderItem={({ item, index }) => (
          <GoalCard
            item={item}
            contribution={contributions[index] ?? 0}
            daily_saveable={daily_saveable}
            index={index}
            onPress={() => router.push(`/(dashboard)/myGoal/goal-detail?id=${item.id}`)}
          />
        )}

        ListFooterComponent={
          <>
            <Spacer height={22} />
            <Pressable onPress={() => setCompletedExpanded((v) => !v)}>
              <SectionLabel lineColor={T.green + "70"}>
                Completed ({completed.length}) {completedExpanded ? "▲" : "▼"}
              </SectionLabel>
            </Pressable>
            {completedExpanded && (
              <>
                <Spacer height={8} />
                {completed.map((g) => <CompletedGoalCard key={g.id} item={g} />)}
              </>
            )}
            <Spacer height={14} />
            <ThemedText style={[s.endText, { color: T.textLight }]}>You're all caught up  ✦</ThemedText>
            <Spacer height={36} />
          </>
        }
      />
    </ThemedView>
  );
};

export default MyGoalIndex;

const s = StyleSheet.create({
  listContent:      { paddingHorizontal: 16 },
  decoWrap:         { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },

  summaryRow:       { flexDirection: "row", gap: 8 },
  summaryCard:      { flex: 1, borderRadius: 16, borderWidth: 1.5, padding: 10, alignItems: "center", gap: 3 },
  summaryIcon:      { fontSize: 18 },
  summaryLabel:     { fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" },
  summaryValue:     { fontSize: 14, fontWeight: "700", textAlign: "center" },

  sectionLabelWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionLine:      { flex: 1, height: 1 },
  sectionLabelText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },

  goalCard: {
    borderRadius: 22, borderWidth: 1.5, padding: 18, marginBottom: 14,
    shadowColor: "rgba(200,140,0,0.12)", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 18, elevation: 6,
  },
  goalHeader:       { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBubble:      { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  goalEmoji:        { fontSize: 20 },
  goalTitleBlock:   { flex: 1 },
  goalTitle:        { fontSize: 15, fontWeight: "700", letterSpacing: -0.2, marginBottom: 2 },
  goalSubtitle:     { fontSize: 11 },
  pctPill:          { borderRadius: 10, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4 },
  pctText:          { fontSize: 13, fontWeight: "800" },

  progressTrack:    { height: 10, borderRadius: 10, overflow: "hidden", position: "relative" },
  progressFill:     { height: "100%", borderRadius: 10 },
  progressMark:     { position: "absolute", top: 0, width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.55)" },

  amountsRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amtLabel:         { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
  amtValue:         { fontSize: 15, fontWeight: "700" },
  amtDivider:       { width: 1, height: 32 },

  contribRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  contribHint:      { fontSize: 11 },
  contribBadge:     { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  contribText:      { color: "#3D2600", fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },

  completedCard:    { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  completedTitle:   { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  completedMeta:    { fontSize: 11 },
  checkmark:        { fontSize: 18, fontWeight: "800" },

  endText:          { textAlign: "center", fontStyle: "italic", fontSize: 12, letterSpacing: 0.5 },
  summaryHint: { fontSize: 10, marginTop: 2 },
});