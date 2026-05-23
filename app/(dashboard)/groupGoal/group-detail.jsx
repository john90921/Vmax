import { useRef, useEffect, useState } from "react";
import {
  StyleSheet, View, Pressable, Alert, Share,
  ScrollView, Dimensions, Animated, Clipboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import Spacer     from "../../../components/Spacer";

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

// ── same data source as index.jsx ────────────────────────────────────────────
const GROUPS = [
  {
    id: "g1",
    name: "Bali Trip Squad",
    emoji: "🌴",
    invite_code: "BALI01",
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
    invite_code: "EMRG42",
    target_amount: 5000,
    target_date: "2025-09-30",
    members: [
      { id: "u1", name: "You",  daily_pledge: 20, total_contributed: 400 },
      { id: "u4", name: "Reza", daily_pledge: 30, total_contributed: 600 },
    ],
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────
const totalSaved    = (g) => g.members.reduce((s, m) => s + m.total_contributed, 0);
const daysRemaining = (str) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(Math.ceil((new Date(str) - today) / 86_400_000), 1);
};
const fmtDate = (str) =>
  new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" });

// ── decoration ───────────────────────────────────────────────────────────────
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

// ── animated progress bar ────────────────────────────────────────────────────
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

// ── section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <View style={s.sectionLabelWrap}>
      <View style={[s.sectionLine, { backgroundColor: T.accentGoldMid }]} />
      <ThemedText style={[s.sectionLabelText, { color: T.textMid }]}>{children}</ThemedText>
      <View style={[s.sectionLine, { backgroundColor: T.accentGoldMid }]} />
    </View>
  );
}

// ── member row ────────────────────────────────────────────────────────────────
const MEDALS = ["🥇", "🥈", "🥉"];

function MemberRow({ member, rank, total }) {
  const pct    = total > 0 ? (member.total_contributed / total) * 100 : 0;
  const isMe   = member.id === MY_USER_ID;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: pct / 100, duration: 600, delay: rank * 80, useNativeDriver: false,
    }).start();
  }, [pct]);

  const barW = barAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"], extrapolate: "clamp" });

  return (
    <View style={[s.memberRow, isMe && { backgroundColor: T.accentGoldLight + "99", borderRadius: 14, paddingHorizontal: 10 }]}>
      <ThemedText style={s.memberMedal}>{MEDALS[rank] ?? `#${rank + 1}`}</ThemedText>

      <View style={s.memberInfo}>
        <View style={s.memberNameRow}>
          <ThemedText style={[s.memberName, { color: isMe ? T.teal : T.textDark }]}>
            {isMe ? "You" : member.name}
          </ThemedText>
          {isMe && (
            <View style={[s.meBadge, { backgroundColor: T.teal }]}>
              <ThemedText style={s.meBadgeText}>ME</ThemedText>
            </View>
          )}
        </View>

        <View style={[s.memberBarTrack, { backgroundColor: T.accentGoldMid + "55" }]}>
          <Animated.View style={[s.memberBarFill, { width: barW, backgroundColor: isMe ? T.teal : T.accentGold }]} />
        </View>

        <View style={s.memberStats}>
          <ThemedText style={[s.memberStat, { color: T.textLight }]}>
            RM {member.daily_pledge}/day
          </ThemedText>
          <ThemedText style={[s.memberStat, { color: T.textMid }]}>
            RM {member.total_contributed.toLocaleString("en-MY")} · {pct.toFixed(0)}%
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

// ── invite code card ──────────────────────────────────────────────────────────
function InviteCard({ code, groupName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    Share.share({
      message: `Join my PiggyGoal group "${groupName}"!\n\nUse invite code: ${code}\nhttps://piggygoal.app/join/${code}`,
    });
  };

  return (
    <View style={[s.inviteCard, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
      <ThemedText style={[s.inviteLabel, { color: T.textLight }]}>INVITE CODE</ThemedText>
      <Spacer height={6} />
      <View style={s.inviteCodeRow}>
        <ThemedText style={[s.inviteCode, { color: T.textDark }]}>{code}</ThemedText>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [s.copyBtn, { backgroundColor: copied ? T.green : T.accentGold, opacity: pressed ? 0.85 : 1 }]}
        >
          <ThemedText style={[s.copyBtnText, { color: copied ? "#fff" : T.textDark }]}>
            {copied ? "Copied ✓" : "Copy"}
          </ThemedText>
        </Pressable>
      </View>
      <Spacer height={12} />
      <Pressable
        onPress={handleShare}
        style={({ pressed }) => [s.shareBtn, { borderColor: T.accentGoldDeep + "60", opacity: pressed ? 0.75 : 1 }]}
      >
        <ThemedText style={[s.shareBtnText, { color: T.teal }]}>🔗 Share invite link</ThemedText>
      </Pressable>
    </View>
  );
}

// ── quick action button ───────────────────────────────────────────────────────
function ActionBtn({ emoji, label, onPress, accent }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.actionBtn, { backgroundColor: accent + "18", borderColor: accent + "40", opacity: pressed ? 0.8 : 1 }]}
    >
      <ThemedText style={s.actionEmoji}>{emoji}</ThemedText>
      <ThemedText style={[s.actionLabel, { color: T.textMid }]}>{label}</ThemedText>
    </Pressable>
  );
}

// ── screen ────────────────────────────────────────────────────────────────────
const GroupDetailScreen = () => {
  const { id }  = useLocalSearchParams();
  const router  = useRouter();

  const group = GROUPS.find((g) => g.id === id);

  // ── guard: group not found ──────────────────────────────────────────────
  if (!group) {
    return (
      <ThemedView style={[s.centered, { backgroundColor: T.bgWarm }]}>
        <ThemedText style={{ fontSize: 48 }}>🤔</ThemedText>
        <Spacer height={12} />
        <ThemedText style={[s.emptyTitle, { color: T.textDark }]}>Group not found</ThemedText>
        <Spacer height={8} />
        <ThemedText style={[s.emptyBody, { color: T.textMid }]}>
          This group may have been removed or the link is invalid.
        </ThemedText>
        <Spacer height={24} />
        <Pressable
          onPress={() => router.back()}
          style={[s.backBtn, { backgroundColor: T.accentGold }]}
        >
          <ThemedText style={{ color: T.textDark, fontWeight: "700" }}>← Go back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const saved     = totalSaved(group);
  const progress  = saved / group.target_amount;
  const pct       = Math.round(progress * 100);
  const days      = daysRemaining(group.target_date);
  const myMember  = group.members.find((m) => m.id === MY_USER_ID);
  const sorted    = [...group.members].sort((a, b) => b.total_contributed - a.total_contributed);

  const remaining = group.target_amount - saved;
  const totalDailyPledge = group.members.reduce((s, m) => s + m.daily_pledge, 0);
  const daysToGoal = totalDailyPledge > 0 ? Math.ceil(remaining / totalDailyPledge) : "—";

  const handleLogContribution = () => {
    Alert.alert(
      "Log Contribution",
      "This would open your contribution logging flow.",
      [{ text: "OK" }]
    );
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group?",
      `Are you sure you want to leave "${group.name}"? Your contributions will remain.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <WarmDecoration />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── hero header ── */}
        <View style={s.heroWrap}>
          <View style={[s.heroEmojiBubble, { backgroundColor: T.accentGoldLight }]}>
            <ThemedText style={s.heroEmoji}>{group.emoji}</ThemedText>
          </View>
          <ThemedText style={[s.heroName, { color: T.textDark }]}>{group.name}</ThemedText>
          <ThemedText style={[s.heroDate, { color: T.textLight }]}>
            🗓 {fmtDate(group.target_date)} · {days} days left
          </ThemedText>
        </View>

        <Spacer height={20} />

        {/* ── progress card ── */}
        <View style={[s.card, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>
          <View style={s.progressHeader}>
            <View>
              <ThemedText style={[s.amtLabel, { color: T.textLight }]}>TOTAL SAVED</ThemedText>
              <ThemedText style={[s.amtBig, { color: T.teal }]}>
                RM {saved.toLocaleString("en-MY")}
              </ThemedText>
              <ThemedText style={[s.amtSub, { color: T.textLight }]}>
                of RM {group.target_amount.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.pctCircle, { borderColor: T.accentGold }]}>
              <ThemedText style={[s.pctBig, { color: T.textDark }]}>{pct}%</ThemedText>
              <ThemedText style={[s.pctSub, { color: T.textLight }]}>done</ThemedText>
            </View>
          </View>

          <Spacer height={14} />
          <GoldProgressBar progress={progress} />
          <Spacer height={14} />

          {/* stat trio */}
          <View style={s.statTrio}>
            <View style={s.statItem}>
              <ThemedText style={[s.statLabel, { color: T.textLight }]}>REMAINING</ThemedText>
              <ThemedText style={[s.statVal, { color: T.coral }]}>
                RM {remaining.toLocaleString("en-MY")}
              </ThemedText>
            </View>
            <View style={[s.statDivider, { backgroundColor: T.bgBorder }]} />
            <View style={s.statItem}>
              <ThemedText style={[s.statLabel, { color: T.textLight }]}>DAYS LEFT</ThemedText>
              <ThemedText style={[s.statVal, { color: T.textDark }]}>{days}</ThemedText>
            </View>
            <View style={[s.statDivider, { backgroundColor: T.bgBorder }]} />
            <View style={s.statItem}>
              <ThemedText style={[s.statLabel, { color: T.textLight }]}>MEMBERS</ThemedText>
              <ThemedText style={[s.statVal, { color: T.textDark }]}>{group.members.length}</ThemedText>
            </View>
          </View>

          {/* projection hint */}
          {typeof daysToGoal === "number" && (
            <>
              <Spacer height={14} />
              <View style={[s.projectionRow, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
                <ThemedText style={[s.projectionText, { color: T.textMid }]}>
                  💡 At the current daily rate of{" "}
                  <ThemedText style={{ fontWeight: "800", color: T.textDark }}>
                    RM {totalDailyPledge}/day
                  </ThemedText>
                  , the group will reach the goal in{" "}
                  <ThemedText style={{ fontWeight: "800", color: T.textDark }}>
                    {daysToGoal} more days
                  </ThemedText>
                  .
                </ThemedText>
              </View>
            </>
          )}
        </View>

        <Spacer height={20} />

        {/* ── my contribution ── */}
        {myMember && (
          <>
            <SectionLabel>My Contribution</SectionLabel>
            <Spacer height={10} />
            <View style={[s.card, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>
              <View style={s.myRow}>
                <View>
                  <ThemedText style={[s.amtLabel, { color: T.textLight }]}>MY PLEDGE</ThemedText>
                  <View style={[s.pledgeBadge, { backgroundColor: T.accentGold }]}>
                    <ThemedText style={[s.pledgeText, { color: "#3D2600" }]}>
                      RM {myMember.daily_pledge}/day
                    </ThemedText>
                  </View>
                </View>
                <View style={[s.vertDivider, { backgroundColor: T.bgBorder }]} />
                <View style={{ alignItems: "flex-end" }}>
                  <ThemedText style={[s.amtLabel, { color: T.textLight }]}>MY TOTAL</ThemedText>
                  <ThemedText style={[s.amtBig, { color: T.teal, fontSize: 18 }]}>
                    RM {myMember.total_contributed.toLocaleString("en-MY")}
                  </ThemedText>
                </View>
              </View>
              <Spacer height={14} />
              <Pressable
                onPress={handleLogContribution}
                style={({ pressed }) => [s.logBtn, { backgroundColor: T.teal, opacity: pressed ? 0.88 : 1 }]}
              >
                <ThemedText style={[s.logBtnText, { color: "#fff" }]}>+ Log Today's Contribution</ThemedText>
              </Pressable>
            </View>

            <Spacer height={20} />
          </>
        )}

        {/* ── leaderboard ── */}
        <SectionLabel>Leaderboard</SectionLabel>
        <Spacer height={10} />
        <View style={[s.card, { backgroundColor: T.bgCard, borderColor: T.bgBorder, gap: 10 }]}>
          {sorted.map((m, i) => (
            <MemberRow key={m.id} member={m} rank={i} total={saved} />
          ))}
        </View>

        <Spacer height={20} />

        {/* ── actions ── */}
        <SectionLabel>Quick Actions</SectionLabel>
        <Spacer height={10} />
        <View style={s.actionsGrid}>
          <ActionBtn
            emoji="📊" label="View Activity"
            accent={T.teal}
            onPress={() => Alert.alert("Activity log coming soon!")}
          />
          <ActionBtn
            emoji="✏️" label="Edit Pledge"
            accent={T.accentGoldDeep}
            onPress={() => Alert.alert("Edit pledge coming soon!")}
          />
          <ActionBtn
            emoji="🔔" label="Reminders"
            accent={T.coral}
            onPress={() => Alert.alert("Reminders coming soon!")}
          />
          <ActionBtn
            emoji="🏆" label="Milestones"
            accent={T.green}
            onPress={() => Alert.alert("Milestones coming soon!")}
          />
        </View>

        <Spacer height={20} />

        {/* ── invite card ── */}
        <SectionLabel>Invite Friends</SectionLabel>
        <Spacer height={10} />
        <InviteCard code={group.invite_code} groupName={group.name} />

        <Spacer height={24} />

        {/* ── danger zone ── */}
        <Pressable
          onPress={handleLeaveGroup}
          style={({ pressed }) => [s.leaveBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <ThemedText style={[s.leaveBtnText, { color: T.coral }]}>Leave this group</ThemedText>
        </Pressable>

        <Spacer height={48} />
      </ScrollView>
    </ThemedView>
  );
};

export default GroupDetailScreen;

const s = StyleSheet.create({
  scroll:   { paddingHorizontal: 16, paddingTop: 24 },
  decoWrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },

  // hero
  heroWrap:       { alignItems: "center", zIndex: 1 },
  heroEmojiBubble:{ width: 72, height: 72, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  heroEmoji:      { fontSize: 36 },
  heroName:       { fontSize: 22, fontWeight: "800", letterSpacing: -0.4, textAlign: "center", marginBottom: 6 },
  heroDate:       { fontSize: 12, letterSpacing: 0.3, textAlign: "center" },

  // card
  card: {
    borderRadius: 22, borderWidth: 1.5, padding: 18, marginBottom: 0,
    shadowColor: "rgba(200,140,0,0.10)", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 18, elevation: 5,
  },

  // progress
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  amtLabel:       { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  amtBig:         { fontSize: 22, fontWeight: "800" },
  amtSub:         { fontSize: 11, marginTop: 2 },
  pctCircle:      { width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  pctBig:         { fontSize: 17, fontWeight: "800" },
  pctSub:         { fontSize: 9, fontWeight: "600", letterSpacing: 0.5 },

  progressTrack:  { height: 10, borderRadius: 10, overflow: "hidden", position: "relative" },
  progressFill:   { height: "100%", borderRadius: 10 },
  progressMark:   { position: "absolute", top: 0, width: 1, height: "100%", backgroundColor: "rgba(255,255,255,0.55)" },

  statTrio:     { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  statItem:     { alignItems: "center", flex: 1 },
  statLabel:    { fontSize: 9, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  statVal:      { fontSize: 14, fontWeight: "700" },
  statDivider:  { width: 1, height: 28 },

  projectionRow:  { borderRadius: 14, borderWidth: 1, padding: 12 },
  projectionText: { fontSize: 12, lineHeight: 18 },

  sectionLabelWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionLine:      { flex: 1, height: 1 },
  sectionLabelText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase" },

  // my contribution
  myRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  pledgeBadge:{ borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginTop: 6 },
  pledgeText: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  vertDivider:{ width: 1, height: 40 },
  logBtn:     { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  logBtnText: { fontSize: 14, fontWeight: "700" },

  // members / leaderboard
  memberRow:    { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 6 },
  memberMedal:  { fontSize: 22, width: 28, textAlign: "center" },
  memberInfo:   { flex: 1, gap: 4 },
  memberNameRow:{ flexDirection: "row", alignItems: "center", gap: 6 },
  memberName:   { fontSize: 13, fontWeight: "700" },
  meBadge:      { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  meBadgeText:  { color: "#fff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  memberBarTrack:{ height: 6, borderRadius: 6, overflow: "hidden" },
  memberBarFill: { height: "100%", borderRadius: 6 },
  memberStats:  { flexDirection: "row", justifyContent: "space-between" },
  memberStat:   { fontSize: 11 },

  // actions grid
  actionsGrid:  { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionBtn:    { flex: 1, minWidth: "44%", borderRadius: 16, borderWidth: 1.5, padding: 14, alignItems: "center", gap: 6 },
  actionEmoji:  { fontSize: 22 },
  actionLabel:  { fontSize: 11, fontWeight: "600", textAlign: "center" },

  // invite
  inviteCard:   { borderRadius: 18, borderWidth: 1.5, padding: 18 },
  inviteLabel:  { fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  inviteCodeRow:{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  inviteCode:   { fontSize: 26, fontWeight: "800", letterSpacing: 3 },
  copyBtn:      { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  copyBtnText:  { fontSize: 13, fontWeight: "700" },
  shareBtn:     { borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", paddingVertical: 12, alignItems: "center" },
  shareBtnText: { fontSize: 13, fontWeight: "600" },

  // leave
  leaveBtn:     { alignItems: "center", paddingVertical: 12 },
  leaveBtnText: { fontSize: 13, fontWeight: "600" },

  // empty state
  emptyTitle:   { fontSize: 18, fontWeight: "800", textAlign: "center" },
  emptyBody:    { fontSize: 14, textAlign: "center", lineHeight: 21 },
  backBtn:      { borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
});