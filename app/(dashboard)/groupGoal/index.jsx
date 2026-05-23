import { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedFlatList from "../../../components/ThemedFlatList";
import ThemedText     from "../../../components/ThemedText";
import ThemedView     from "../../../components/ThemedView";
import Spacer         from "../../../components/Spacer";

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

const MY_USER_ID = "u1";

const GROUPS = [
  {
    id: "g1",
    name: "Bali Trip Squad",
    emoji: "🌴",
    target_amount: 15000,
    target_date: "2025-08-31",
    members: [
      { id: "u1", name: "You",   daily_pledge: 50, total_contributed: 1200 },
      { id: "u2", name: "Amir",  daily_pledge: 40, total_contributed: 980 },
      { id: "u3", name: "Sarah", daily_pledge: 60, total_contributed: 1450 },
    ],
  },
  {
    id: "g2",
    name: "Emergency Fund",
    emoji: "🛡️",
    target_amount: 5000,
    target_date: "2025-09-30",
    members: [
      { id: "u1", name: "You",  daily_pledge: 20, total_contributed: 400 },
      { id: "u4", name: "Reza", daily_pledge: 30, total_contributed: 600 },
    ],
  },
];

const daysRemaining = (str) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((new Date(str) - today) / 86_400_000), 1);
};
const fmtDate = (str) =>
  new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
const totalSaved = (g) => g.members.reduce((s, m) => s + m.total_contributed, 0);

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

// ── Progress bar ──────────────────────────────────────────────────────────────
function GoldProgressBar({ progress }) {
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
      <Animated.View style={[s.progressFill, { width: barW, backgroundColor: T.accentGold }]} />
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

// ── Leaderboard ───────────────────────────────────────────────────────────────
function LeaderboardStrip({ members }) {
  const sorted = [...members].sort((a, b) => b.total_contributed - a.total_contributed);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <View style={s.leaderRow}>
      {sorted.map((m, i) => (
        <View key={m.id} style={s.leaderEntry}>
          <ThemedText style={s.leaderMedal}>{medals[i] ?? `#${i + 1}`}</ThemedText>
          <ThemedText style={[s.leaderName, { color: m.id === MY_USER_ID ? T.teal : T.textDark }]} numberOfLines={1}>
            {m.id === MY_USER_ID ? "You" : m.name}
          </ThemedText>
          <ThemedText style={[s.leaderPledge, { color: T.textLight }]}>RM {m.daily_pledge}/day</ThemedText>
        </View>
      ))}
    </View>
  );
}

// ── Group card ────────────────────────────────────────────────────────────────
function GroupCard({ item, index, onPress }) {
  const translateY = useRef(new Animated.Value(28)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 360, delay: index * 80, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 16, stiffness: 100, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const saved    = totalSaved(item);
  const progress = saved / item.target_amount;
  const pct      = Math.round(progress * 100);
  const days     = daysRemaining(item.target_date);
  const myMember = item.members.find((m) => m.id === MY_USER_ID);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
        <View style={[s.groupCard, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>

          {/* header */}
          <View style={s.cardHeader}>
            <View style={[s.emojiBubble, { backgroundColor: T.accentGoldLight }]}>
              <ThemedText style={s.cardEmoji}>{item.emoji}</ThemedText>
            </View>
            <View style={s.cardTitleBlock}>
              <ThemedText style={[s.cardTitle, { color: T.textDark }]}>{item.name}</ThemedText>
              <ThemedText style={[s.cardSubtitle, { color: T.textLight }]}>
                🗓 {fmtDate(item.target_date)} · {days}d left
              </ThemedText>
            </View>
            <View style={[s.pctPill, { backgroundColor: T.accentGoldLight, borderColor: T.bgBorder }]}>
              <ThemedText style={[s.pctText, { color: T.textMid }]}>{pct}%</ThemedText>
            </View>
          </View>

          <Spacer height={14} />
          <GoldProgressBar progress={progress} />
          <Spacer height={10} />

          {/* amounts */}
          <View style={s.amountsRow}>
            <View>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>SAVED</ThemedText>
              <ThemedText style={[s.amtValue, { color: T.teal }]}>
                RM {saved.toLocaleString("en-MY")}
              </ThemedText>
              <ThemedText style={[s.amtLabel, { color: T.textLight, marginTop: 2 }]}>
                OF RM {item.target_amount.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.amtDivider, { backgroundColor: T.bgBorder }]} />
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>MEMBERS</ThemedText>
              <ThemedText style={[s.amtValue, { color: T.coral }]}>
                👥 {item.members.length}
              </ThemedText>
            </View>
          </View>

          <Spacer height={12} />

          {/* my pledge badge */}
          {myMember && (
            <View style={s.pledgeRow}>
              <ThemedText style={[s.pledgeHint, { color: T.textLight }]}>Your daily pledge</ThemedText>
              <View style={[s.pledgeBadge, { backgroundColor: T.accentGold, shadowColor: T.accentGold }]}>
                <ThemedText style={s.pledgeText}>RM {myMember.daily_pledge}/day</ThemedText>
              </View>
            </View>
          )}

          <Spacer height={14} />

          {/* leaderboard */}
          <View style={[s.leaderSection, { borderTopColor: T.bgBorder }]}>
            <ThemedText style={[s.leaderLabel, { color: T.textLight }]}>LEADERBOARD</ThemedText>
            <Spacer height={8} />
            <LeaderboardStrip members={item.members} />
          </View>

        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onCreateGroup, onJoinGroup }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);
  return (
    <Animated.View style={[s.emptyWrap, { opacity: fadeAnim }]}>
      <ThemedText style={s.emptyEmoji}>🐷</ThemedText>
      <ThemedText style={[s.emptyTitle, { color: T.textDark }]}>Save Together, Achieve More</ThemedText>
      <ThemedText style={[s.emptyBody, { color: T.textMid }]}>
        Create a group goal with friends or family and stay accountable with a shared leaderboard.
      </ThemedText>
      <Spacer height={24} />
      <Pressable
        onPress={onCreateGroup}
        style={({ pressed }) => [s.emptyBtn, { backgroundColor: T.accentGold, opacity: pressed ? 0.85 : 1 }]}
      >
        <ThemedText style={[s.emptyBtnText, { color: T.textDark }]}>Create a Group Goal</ThemedText>
      </Pressable>
      <Spacer height={12} />
      <Pressable onPress={onJoinGroup} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
        <ThemedText style={[s.joinLink, { color: T.teal }]}>Have an invite code? Join a group →</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
const GroupGoalIndex = () => {
  const router = useRouter();
  const groups = GROUPS;

  if (groups.length === 0) {
    return (
      <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
        <WarmDecoration />
        <EmptyState
          onCreateGroup={() => router.push("/(dashboard)/groupGoal/create-group")}
          onJoinGroup={() => router.push("/(dashboard)/groupGoal/join-group")}
        />
      </ThemedView>
    );
  }

  const totalGroupSaved  = groups.reduce((s, g) => s + totalSaved(g), 0);
  const totalDailyPledge = groups
    .flatMap((g) => g.members)
    .filter((m) => m.id === MY_USER_ID)
    .reduce((s, m) => s + m.daily_pledge, 0);

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <ThemedFlatList
        contentContainerStyle={s.listContent}
        data={groups}
        keyExtractor={(item) => item.id}

        ListHeaderComponent={
          <>
            <WarmDecoration />
            <Spacer height={8} />

            {/* stat strip */}
            <View style={s.statRow}>
              <StatCard icon="👥" label="Groups"       value={`${groups.length}`}                            valueColor={T.textDark} />
              <StatCard icon="💰" label="Total Saved"  value={`RM ${totalGroupSaved.toLocaleString()}`}      valueColor={T.teal} />
              <StatCard icon="📅" label="Daily Pledge" value={`RM ${totalDailyPledge}/day`}                  valueColor={T.coral} />
            </View>

            <Spacer height={24} />
            <SectionLabel>Your Groups ({groups.length})</SectionLabel>
            <Spacer height={10} />
          </>
        }

        renderItem={({ item, index }) => (
          <GroupCard
            item={item}
            index={index}
            onPress={() => router.push(`/(dashboard)/groupGoal/group-detail?id=${item.id}`)}
          />
        )}

        ListFooterComponent={
          <>
            <Spacer height={22} />
            <Pressable
              onPress={() => router.push("/(dashboard)/groupGoal/join-group")}
              style={({ pressed }) => [s.joinCodeBtn, { borderColor: T.accentGoldDeep + "60", opacity: pressed ? 0.7 : 1 }]}
            >
              <ThemedText style={[s.joinCodeText, { color: T.teal }]}>🔗 Join via invite code</ThemedText>
            </Pressable>
            <Spacer height={14} />
            <ThemedText style={[s.endText, { color: T.textLight }]}>Keep saving together  ✦</ThemedText>
            <Spacer height={36} />
          </>
        }
      />
    </ThemedView>
  );
};

export default GroupGoalIndex;

const s = StyleSheet.create({
  listContent:      { paddingHorizontal: 16 },
  decoWrap:         { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },

  statRow:          { flexDirection: "row", gap: 8 },
  statCard:         { flex: 1, borderRadius: 16, borderWidth: 1.5, padding: 10, alignItems: "center", gap: 3 },
  statIcon:         { fontSize: 18 },
  statLabel:        { fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" },
  statValue:        { fontSize: 13, fontWeight: "700", textAlign: "center" },

  sectionLabelWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionLine:      { flex: 1, height: 1 },
  sectionLabelText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },

  groupCard: {
    borderRadius: 22, borderWidth: 1.5, padding: 18, marginBottom: 14,
    shadowColor: "rgba(200,140,0,0.12)", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 18, elevation: 6,
  },
  cardHeader:       { flexDirection: "row", alignItems: "center", gap: 12 },
  emojiBubble:      { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardEmoji:        { fontSize: 20 },
  cardTitleBlock:   { flex: 1 },
  cardTitle:        { fontSize: 15, fontWeight: "700", letterSpacing: -0.2, marginBottom: 2 },
  cardSubtitle:     { fontSize: 11 },
  pctPill:          { borderRadius: 10, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4 },
  pctText:          { fontSize: 13, fontWeight: "800" },

  progressTrack:    { height: 10, borderRadius: 10, overflow: "hidden", position: "relative" },
  progressFill:     { height: "100%", borderRadius: 10 },
  progressMark:     { position: "absolute", top: 0, width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.55)" },

  amountsRow:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  amtLabel:         { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
  amtValue:         { fontSize: 15, fontWeight: "700" },
  amtDivider:       { width: 1, height: 32 },

  pledgeRow:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pledgeHint:       { fontSize: 11 },
  pledgeBadge:      { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  pledgeText:       { color: "#3D2600", fontSize: 12, fontWeight: "800", letterSpacing: 0.3 },

  leaderSection:    { borderTopWidth: 1, paddingTop: 12 },
  leaderLabel:      { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  leaderRow:        { flexDirection: "row", justifyContent: "space-around" },
  leaderEntry:      { alignItems: "center", gap: 3 },
  leaderMedal:      { fontSize: 20 },
  leaderName:       { fontSize: 12, fontWeight: "700", maxWidth: 72, textAlign: "center" },
  leaderPledge:     { fontSize: 11 },

  joinCodeBtn:      { borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, alignItems: "center", borderStyle: "dashed" },
  joinCodeText:     { fontSize: 14, fontWeight: "600" },
  endText:          { textAlign: "center", fontStyle: "italic", fontSize: 12, letterSpacing: 0.5 },

  emptyWrap:        { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingTop: 80 },
  emptyEmoji:       { fontSize: 52, marginBottom: 14 },
  emptyTitle:       { fontSize: 20, fontWeight: "800", textAlign: "center", marginBottom: 10, letterSpacing: -0.3 },
  emptyBody:        { fontSize: 14, textAlign: "center", lineHeight: 21, color: T.textMid },
  emptyBtn:         { borderRadius: 18, paddingVertical: 15, paddingHorizontal: 32, width: "100%", alignItems: "center", shadowColor: T.accentGold, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  emptyBtnText:     { fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },
  joinLink:         { fontSize: 14, fontWeight: "600" },
});