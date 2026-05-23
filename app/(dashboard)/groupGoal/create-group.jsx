import { useState } from "react";
import { StyleSheet, View, Pressable, Alert, Share, ScrollView, Dimensions, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedView  from "../../../components/ThemedView";
import ThemedText  from "../../../components/ThemedText";
import Spacer      from "../../../components/Spacer";

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
};

const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const formatDate = (d) =>
  d?.toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) ?? "";

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

function GoldInput({ placeholder, value, onChangeText, keyboardType = "default" }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.inputWrap, { borderColor: focused ? T.accentGold : T.bgBorder }]}>
      <ThemedText
        style={[s.inputInner, { color: value ? T.textDark : T.textLight }]}
        // We can't use a real TextInput here without importing it separately,
        // but this pattern matches the codebase's ThemedTextInput approach
      >
        {/* placeholder shown as label above */}
      </ThemedText>
    </View>
  );
}

// Reusable styled text input row
function FieldRow({ label, placeholder, value, onChangeText, keyboardType = "default" }) {
  const [focused, setFocused] = useState(false);
  const { TextInput } = require("react-native");
  return (
    <View style={s.fieldWrap}>
      {value.length > 0 && (
        <ThemedText style={[s.fieldLabel, { color: T.textLight }]}>{label}</ThemedText>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={T.textLight}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[s.fieldInput, {
          borderColor: focused ? T.accentGold : T.bgBorder,
          color: T.textDark,
        }]}
      />
    </View>
  );
}

const CreateGroupScreen = () => {
  const router = useRouter();

  const [groupName,    setGroupName]    = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [dailyPledge,  setDailyPledge]  = useState("");
  const [targetDate,   setTargetDate]   = useState(null);
  const [showPicker,   setShowPicker]   = useState(false);
  const [focused,      setFocused]      = useState(null);

  const daysNeeded =
    targetAmount && dailyPledge
      ? Math.ceil(parseFloat(targetAmount) / parseFloat(dailyPledge))
      : null;
  const suggestedDate = daysNeeded
    ? new Date(Date.now() + daysNeeded * 86_400_000)
    : null;

  const handleCreate = () => {
    if (!groupName.trim() || !targetAmount || !dailyPledge) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }
    const code = generateInviteCode();
    const link = `https://piggygoal.app/join/${code}`;
    Alert.alert(
      "Group Created! 🎉",
      `Share this invite code:\n\n${code}`,
      [
        { text: "Share", onPress: () => Share.share({ message: `Join my PiggyGoal group "${groupName}"!\n\nCode: ${code}\n${link}` }) },
        { text: "Done", onPress: () => router.back() },
      ]
    );
  };

  const { TextInput } = require("react-native");

  const field = (key, placeholder, value, setter, kb = "default") => (
    <View style={s.fieldWrap}>
      {value.length > 0 && (
        <ThemedText style={[s.fieldLabel, { color: T.textLight }]}>{placeholder}</ThemedText>
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={T.textLight}
        value={value}
        onChangeText={setter}
        keyboardType={kb}
        onFocus={() => setFocused(key)}
        onBlur={() => setFocused(null)}
        style={[s.fieldInput, { borderColor: focused === key ? T.accentGold : T.bgBorder, color: T.textDark }]}
      />
    </View>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: T.bgWarm }}>
      <WarmDecoration />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* heading */}
        <View style={s.headingWrap}>
          <Text style={[s.headingMain, { color: T.textDark }]}>Better Together</Text>
          <Text style={[s.headingAccentText, { color: T.accentGoldDeep }]}>Create your group goal 🤝</Text>
          <Text style={[s.headingSub, { color: T.textLight }]}>Define your shared milestone</Text>
        </View>

        <Spacer height={24} />

        {/* form card */}
        <View style={[s.card, { backgroundColor: T.bgCard, borderColor: T.bgBorder }]}>

          {field("name", "Group name (e.g. Bali Trip Squad)", groupName, setGroupName)}
          {field("amount", "Shared target amount (RM)", targetAmount, setTargetAmount, "numeric")}

          {/* date picker */}
          <View style={s.fieldWrap}>
            {targetDate && (
              <ThemedText style={[s.fieldLabel, { color: T.textLight }]}>Target completion date</ThemedText>
            )}
            <Pressable
              onPress={() => setShowPicker(true)}
              style={[s.fieldInput, s.dateField, {
                borderColor: showPicker ? T.accentGold : T.bgBorder,
              }]}
            >
              <ThemedText style={{ color: targetDate ? T.textDark : T.textLight, fontSize: 15 }}>
                {targetDate ? formatDate(targetDate) : "Target completion date"}
              </ThemedText>
            </Pressable>
          </View>
          {showPicker && (
            <DateTimePicker
              value={targetDate || new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(_, d) => { setShowPicker(false); if (d) setTargetDate(d); }}
            />
          )}

          {field("pledge", "Your daily pledge (RM/day)", dailyPledge, setDailyPledge, "numeric")}

          {/* AI suggestion */}
          {daysNeeded && suggestedDate && (
            <>
              <Spacer height={4} />
              <View style={[s.suggestionCard, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
                <ThemedText style={[s.suggestionText, { color: T.textMid }]}>
                  💡 At RM {dailyPledge}/day you'll hit RM {targetAmount} in{" "}
                  <ThemedText style={{ fontWeight: "800", color: T.textDark }}>{daysNeeded} days</ThemedText>
                  {" "}— by {formatDate(suggestedDate)}.
                </ThemedText>
              </View>
            </>
          )}

          <Spacer height={12} />

          {/* privacy note */}
          <View style={[s.privacyRow, { backgroundColor: T.accentGoldLight, borderColor: T.accentGoldMid }]}>
            <ThemedText style={[s.privacyText, { color: T.textMid }]}>
              🔒 Members see each other's pledge and total saved — but never anyone's salary or expenses.
            </ThemedText>
          </View>
        </View>

        <Spacer height={24} />

        {/* CTA */}
        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => [s.createBtn, { backgroundColor: T.accentGold, opacity: pressed ? 0.88 : 1 }]}
        >
          <ThemedText style={[s.createBtnText, { color: T.textDark }]}>Create & Get Invite Code  🎉</ThemedText>
        </Pressable>

        <Spacer height={40} />
      </ScrollView>
    </ThemedView>
  );
};

export default CreateGroupScreen;

const s = StyleSheet.create({
  scroll:          { paddingHorizontal: 18, paddingTop: 34 },
  decoWrap:        { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },

  headingWrap:       { alignItems: "center", zIndex: 1 },
  headingMain:       { fontSize: 20, fontWeight: "700", color: T.textDark, letterSpacing: -0.3 },
  headingAccentText: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 },
  headingSub:        { fontSize: 13, fontWeight: "500", letterSpacing: 0.2, marginTop: 6 },

  card: {
    borderRadius: 24, borderWidth: 1.5, padding: 20, gap: 6,
    shadowColor: "rgba(200,140,0,0.10)", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 18, elevation: 5,
  },

  fieldWrap:       { gap: 4 },
  fieldLabel:      { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", marginLeft: 4 },
  fieldInput: {
    borderWidth: 1.5, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 16,
    fontSize: 15, backgroundColor: "transparent",
  },
  dateField:       { justifyContent: "center" },

  suggestionCard:  { borderRadius: 14, borderWidth: 1, padding: 13 },
  suggestionText:  { fontSize: 13, lineHeight: 20 },

  privacyRow:      { borderRadius: 14, borderWidth: 1, padding: 12 },
  privacyText:     { fontSize: 12, lineHeight: 18 },

  createBtn: {
    borderRadius: 20, paddingVertical: 17, alignItems: "center",
    shadowColor: T.accentGold, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
  },
  createBtnText:   { fontSize: 15, fontWeight: "800", letterSpacing: 0.3 },
});