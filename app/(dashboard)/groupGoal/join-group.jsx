import { useState } from "react";
import { StyleSheet, View, Pressable, Alert, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedView from "../../../components/ThemedView";
import ThemedText from "../../../components/ThemedText";
import Spacer     from "../../../components/Spacer";

const { width: SCREEN_W } = Dimensions.get("window");

const T = {
  accentGold:      "#F5C842",
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

const JoinGroupScreen = () => {
  const router = useRouter();
  const { TextInput } = require("react-native");

  const [inviteCode,   setInviteCode]   = useState("");
  const [dailyPledge,  setDailyPledge]  = useState("");
  const [previewGroup, setPreviewGroup] = useState(null);
  const [focused,      setFocused]      = useState(null);

  const handleLookup = () => {
    const code = inviteCode.trim().toUpperCase();
    if (!code) return;
    if (code === "BALI01") {
      setPreviewGroup({ name: "Bali Trip Squad", target_amount: 15000, target_date: "2025-08-31", members: 3, total_saved: 3630 });
    } else {
      Alert.alert("Code not found", "Make sure the invite code is correct and try again.");
      setPreviewGroup(null);
    }
  };

  const handleJoin = () => {
    if (!dailyPledge) { Alert.alert("Set your pledge", "Enter your daily pledge amount before joining."); return; }
    Alert.alert("Joined! 🎉", `You're now part of "${previewGroup.name}". RM ${dailyPledge}/day pledged.`, [
      { text: "View Group", onPress: () => router.back() },
    ]);
  };

  const fmtDate = (str) =>
    new Date(str).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <WarmDecoration />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.headingWrap}>
          <ThemedText style={[s.headingSub, { color: T.textLight }]}>Got an invite?</ThemedText>
          <ThemedText style={[s.headingMain, { color: T.textDark }]}>Join a Group</ThemedText>
          <View style={[s.headingAccent, { backgroundColor: T.accentGold }]} />
        </View>

        <Spacer height={24} />

        <View style={[s.card, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>

          {/* code row */}
          <View style={s.fieldWrap}>
            {inviteCode.length > 0 && (
              <ThemedText style={[s.fieldLabel, { color: T.textLight }]}>Invite code</ThemedText>
            )}
            <View style={s.codeRow}>
              <TextInput
                placeholder="Invite code (e.g. BALI01)"
                placeholderTextColor={T.textLight}
                value={inviteCode}
                onChangeText={(t) => { setInviteCode(t); setPreviewGroup(null); }}
                autoCapitalize="characters"
                onFocus={() => setFocused("code")}
                onBlur={() => setFocused(null)}
                style={[s.fieldInput, s.codeInput, {
                  borderColor: focused === "code" ? T.accentGold : T.bgBorder,
                  color: T.textDark,
                }]}
              />
              <Pressable
                onPress={handleLookup}
                style={({ pressed }) => [s.lookupBtn, { backgroundColor: T.accentGold, opacity: pressed ? 0.85 : 1 }]}
              >
                <ThemedText style={[s.lookupBtnText, { color: T.textDark }]}>Look up</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* group preview */}
          {previewGroup && (
            <>
              <View style={[s.previewCard, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
                <ThemedText style={[s.previewName, { color: T.textDark }]}>{previewGroup.name}</ThemedText>
                <Spacer height={8} />
                <View style={s.previewRow}>
                  <ThemedText style={[s.previewMeta, { color: T.textMid }]}>🎯 Target</ThemedText>
                  <ThemedText style={[s.previewValue, { color: T.teal }]}>RM {previewGroup.target_amount.toLocaleString()}</ThemedText>
                </View>
                <View style={s.previewRow}>
                  <ThemedText style={[s.previewMeta, { color: T.textMid }]}>💰 Saved so far</ThemedText>
                  <ThemedText style={[s.previewValue, { color: T.teal }]}>RM {previewGroup.total_saved.toLocaleString()}</ThemedText>
                </View>
                <View style={s.previewRow}>
                  <ThemedText style={[s.previewMeta, { color: T.textMid }]}>👥 Members</ThemedText>
                  <ThemedText style={[s.previewValue, { color: T.textDark }]}>{previewGroup.members}</ThemedText>
                </View>
                <View style={s.previewRow}>
                  <ThemedText style={[s.previewMeta, { color: T.textMid }]}>🗓 Deadline</ThemedText>
                  <ThemedText style={[s.previewValue, { color: T.coral }]}>{fmtDate(previewGroup.target_date)}</ThemedText>
                </View>
              </View>

              <View style={s.fieldWrap}>
                {dailyPledge.length > 0 && (
                  <ThemedText style={[s.fieldLabel, { color: T.textLight }]}>Your daily pledge</ThemedText>
                )}
                <TextInput
                  placeholder="Your daily pledge (RM/day)"
                  placeholderTextColor={T.textLight}
                  value={dailyPledge}
                  onChangeText={setDailyPledge}
                  keyboardType="numeric"
                  onFocus={() => setFocused("pledge")}
                  onBlur={() => setFocused(null)}
                  style={[s.fieldInput, {
                    borderColor: focused === "pledge" ? T.accentGold : T.bgBorder,
                    color: T.textDark,
                  }]}
                />
              </View>

              <View style={[s.privacyRow, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
                <ThemedText style={[s.privacyText, { color: T.textMid }]}>
                  🔒 Members see your pledge but not your salary.
                </ThemedText>
              </View>
            </>
          )}
        </View>

        {previewGroup && (
          <>
            <Spacer height={24} />
            <Pressable
              onPress={handleJoin}
              style={({ pressed }) => [s.joinBtn, { backgroundColor: T.teal, opacity: pressed ? 0.88 : 1 }]}
            >
              <ThemedText style={[s.joinBtnText, { color: "#fff" }]}>Join Group  →</ThemedText>
            </Pressable>
          </>
        )}

        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  );
};

export default JoinGroupScreen;

const s = StyleSheet.create({
  scroll:        { paddingHorizontal: 18, paddingTop: 140 },
  decoWrap:      { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },

  headingWrap:   { alignItems: "center" },
  headingSub:    { fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  headingMain:   { fontSize: 24, fontWeight: "800", letterSpacing: -0.5, textAlign: "center", marginBottom: 10 },
  headingAccent: { width: 40, height: 3, borderRadius: 2 },

  card: {
    borderRadius: 24, borderWidth: 1.5, padding: 20, gap: 12,
    shadowColor: "rgba(200,140,0,0.10)", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 18, elevation: 5,
  },

  fieldWrap:     { gap: 4 },
  fieldLabel:    { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 4 },
  fieldInput:    { borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, backgroundColor: "transparent" },

  codeRow:       { flexDirection: "row", gap: 8, alignItems: "center" },
  codeInput:     { flex: 1 },
  lookupBtn:     { borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, justifyContent: "center" },
  lookupBtnText: { fontSize: 14, fontWeight: "700" },

  previewCard:   { borderRadius: 16, borderWidth: 1.5, padding: 16, gap: 4 },
  previewName:   { fontSize: 16, fontWeight: "800", textAlign: "center", marginBottom: 4 },
  previewRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 2 },
  previewMeta:   { fontSize: 13 },
  previewValue:  { fontSize: 13, fontWeight: "700" },

  privacyRow:    { borderRadius: 14, borderWidth: 1, padding: 12 },
  privacyText:   { fontSize: 12, lineHeight: 18 },

  joinBtn: {
    borderRadius: 20, paddingVertical: 17, alignItems: "center",
    shadowColor: T.teal, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 14, elevation: 6,
  },
  joinBtnText:   { fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },
});