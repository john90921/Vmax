import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedText from "../../../components/ThemedText";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedModal from "../../../components/ThemedModal";
import ThemedFlatList from "../../../components/ThemedFlatList";
import ThemedView from "../../../components/ThemedView";
import Spacer from "../../../components/Spacer";
import ProfileIcon from "../../../assets/img/profile_icon.png";
import { Colors } from "../../../constants/Colors";
import { useUser } from "../../../hooks/useUser";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");

const T = {
  accentGold:       "#F5C842",
  accentGoldMid:    "#F5DFA0",
  accentGoldLight:  "#FFF3C0",
  accentPurple:     "#7F77DD",
  accentPurpleDeep: "#534AB7",
  accentPurpleLight:"#EEEDFE",
  coral:            "#FF7058",
  teal:             "#40596B",
  textDark:         "#2C1810",
  textMid:          "#7A5C3C",
  textLight:        "#BFA080",
  bgWarm:           "#FFF8ED",
  bgBorder:         "#F5DFA0",
  bgCard:           "#FFFDF7",
};

function WarmDecoration() {
  return (
    <View style={styles.decoWrap} pointerEvents="none">
      <Svg width={SCREEN_W} height={160} viewBox={`0 0 ${SCREEN_W} 160`}>
        <Circle cx={SCREEN_W * 0.9} cy={10}  r={110} fill={T.accentGold}  fillOpacity={0.07} />
        <Circle cx={SCREEN_W * 0.1} cy={120} r={60}  fill={T.coral}       fillOpacity={0.05} />
        <Circle cx={SCREEN_W * 0.5} cy={-10} r={40}  fill={T.teal}        fillOpacity={0.04} />
        <Path
          d={`M0,80 Q${SCREEN_W*0.3},50 ${SCREEN_W*0.65},68 Q${SCREEN_W},84 ${SCREEN_W},54`}
          stroke={T.accentGold} strokeWidth="1" fill="none" strokeOpacity={0.25}
        />
      </Svg>
    </View>
  );
}

// Reusable menu row
function MenuItem({ icon, iconColor, label, sublabel, onPress, isLast, danger, badge }) {
  return (
    <>
      <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.menuIconWrap, { backgroundColor: danger ? "#FFF0EE" : T.accentPurpleLight }]}>
          <Ionicons name={icon} size={17} color={iconColor || (danger ? T.coral : T.accentPurpleDeep)} />
        </View>
        <View style={styles.menuRowText}>
          <ThemedText style={[styles.menuLabel, danger && { color: T.coral }]}>{label}</ThemedText>
          {sublabel ? <ThemedText style={styles.menuSublabel}>{sublabel}</ThemedText> : null}
        </View>
        {badge ? (
          <View style={styles.badgeWrap}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
        ) : null}
        <Ionicons name="chevron-forward" size={16} color={danger ? T.coral : T.textLight} />
      </TouchableOpacity>
      {!isLast && <View style={styles.menuDivider} />}
    </>
  );
}

const ProfileIndex = () => {
  const { theme, colorScheme, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useUser();

  const [activeModal, setActiveModal]           = useState(null);
  const [savedUsername, setSavedUsername]       = useState(user?.name || "");
  const [draftUsername, setDraftUsername]       = useState(user?.name || "");
  const [email]                                 = useState(user?.email || "No email registered");
  const [savedSalary, setSavedSalary]           = useState(user?.salary?.toString() || "0");
  const [draftSalary, setDraftSalary]           = useState(user?.salary?.toString() || "0");
  const [savedProfileImage, setSavedProfileImage] = useState(user?.profileImageUri || null);
  const [draftProfileImage, setDraftProfileImage] = useState(user?.profileImageUri || null);

  const isDarkMode = (themeMode === "system" ? colorScheme : themeMode) === "dark";

  const dailySavingsData = [
    { date: "15 May 2026", amount: "RM45.50" },
    { date: "14 May 2026", amount: "RM32.75" },
    { date: "13 May 2026", amount: "RM58.20" },
    { date: "12 May 2026", amount: "RM41.90" },
    { date: "11 May 2026", amount: "RM67.00" },
    { date: "10 May 2026", amount: "RM38.45" },
    { date: "09 May 2026", amount: "RM52.30" },
    { date: "08 May 2026", amount: "RM67.00" },
    { date: "05 May 2026", amount: "RM52.30" },
    { date: "04 May 2026", amount: "RM32.75" },
    { date: "03 May 2026", amount: "RM58.20" },
    { date: "02 May 2026", amount: "RM41.90" },
    { date: "01 May 2026", amount: "RM38.45" },
  ];

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") { Alert.alert("Permission Denied", "We need gallery access to pick a photo."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled) setDraftProfileImage(result.assets[0].uri);
  };

  const handleSaveAccount = () => {
    if (!draftUsername.trim()) { Alert.alert("Validation", "Username cannot be empty"); return; }
    setSavedUsername(draftUsername.trim());
    setSavedProfileImage(draftProfileImage);
    Alert.alert("Success", "Account updated successfully");
    setActiveModal(null);
  };

  const handleSaveSalary = () => {
    if (!draftSalary.trim() || isNaN(parseFloat(draftSalary))) { Alert.alert("Validation", "Salary must be a valid number"); return; }
    setSavedSalary(draftSalary.trim());
    Alert.alert("Success", "Salary updated successfully");
    setActiveModal(null);
  };

  const dailyBudget = savedSalary && !isNaN(parseFloat(savedSalary))
    ? (parseFloat(savedSalary) / 30).toFixed(2)
    : "—";

  return (
    <ThemedView safe style={[styles.root, { backgroundColor: T.bgWarm }]}>
      <WarmDecoration />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Pressable style={styles.avatarWrap} onPress={() => { setDraftUsername(savedUsername); setDraftProfileImage(savedProfileImage); setActiveModal("account"); }}>
            {savedProfileImage
              ? <Image source={{ uri: savedProfileImage }} style={styles.avatarImg} />
              : <Image source={ProfileIcon} style={styles.avatarImg} />}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </Pressable>
          <View style={styles.heroText}>
            <ThemedText style={styles.heroName}>{savedUsername || "Set your name"}</ThemedText>
            <ThemedText style={styles.heroEmail}>{email}</ThemedText>
          </View>
        </View>

        {/* Stats strip */}
        {/* <View style={styles.statsStrip}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>💰</ThemedText>
            <ThemedText style={styles.statLabel}>Monthly</ThemedText>
            <ThemedText style={[styles.statValue, { color: T.accentPurpleDeep }]}>
              {savedSalary !== "0" ? `RM ${parseFloat(savedSalary).toLocaleString()}` : "—"}
            </ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>📆</ThemedText>
            <ThemedText style={styles.statLabel}>Daily budget</ThemedText>
            <ThemedText style={[styles.statValue, { color: T.teal }]}>RM {dailyBudget}</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>✦</ThemedText>
            <ThemedText style={styles.statLabel}>Savings / day</ThemedText>
            <ThemedText style={[styles.statValue, { color: T.coral }]}>RM 45.50</ThemedText>
          </View>
        </View> */}

        {/* Section: Personal */}
        {/* <View style={styles.sectionHeaderWrap}>
          <View style={styles.sectionDot} />
          <ThemedText style={styles.sectionLabel}>Personal</ThemedText>
        </View> */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="shield-checkmark-outline"
            label="Account"
            sublabel={savedUsername || "Not set"}
            badge={!savedUsername ? "Set now" : null}
            onPress={() => { setDraftUsername(savedUsername); setDraftProfileImage(savedProfileImage); setActiveModal("account"); }}
          />
          <MenuItem
            icon="cash-outline"
            label="Current Salary"
            sublabel={savedSalary !== "0" ? `RM ${parseFloat(savedSalary).toLocaleString()} / month` : "Not set"}
            badge={savedSalary === "0" ? "Set now" : null}
            onPress={() => { setDraftSalary(savedSalary); setActiveModal("salary"); }}
          />
          <MenuItem
            icon="wallet-outline"
            label="Daily Savings"
            sublabel="View your saving history"
            isLast
            onPress={() => setActiveModal("savings")}
          />
        </View>

        {/* Section: Preferences */}
        {/* <View style={styles.sectionHeaderWrap}>
          <View style={styles.sectionDot} />
          <ThemedText style={styles.sectionLabel}>Preferences</ThemedText>
        </View> */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="contrast-outline"
            label="Theme Mode"
            sublabel={isDarkMode ? "Dark" : "Light"}
            onPress={() => setActiveModal("theme")}
            isLast
          />
        </View>

        {/* Section: Account */}
        {/* <View style={styles.sectionHeaderWrap}>
          <View style={styles.sectionDot} />
          <ThemedText style={styles.sectionLabel}>Account</ThemedText>
        </View> */}
        <View style={styles.menuCard}>
          <MenuItem
            icon="log-out-outline"
            label="Logout"
            danger
            isLast
            onPress={() => setActiveModal("logout")}
          />
        </View>

      </ScrollView>

      {/* ── Account Modal ── */}
      <ThemedModal visible={activeModal === "account"} onClose={() => setActiveModal(null)} fullScreen contentStyle={styles.modalContent} overlayStyle={styles.modalOverlay}>
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: T.bgCard }]}>
            <ThemedText style={styles.modalTitle}>Account</ThemedText>
            <Spacer height={24} />
            <View style={styles.avatarEditWrap}>
              <View style={styles.modalAvatarRing}>
                {draftProfileImage
                  ? <Image source={{ uri: draftProfileImage }} style={styles.modalAvatarImg} />
                  : <Image source={ProfileIcon} style={styles.modalAvatarImg} />}
              </View>
              <Pressable style={[styles.modalCameraBtn, { backgroundColor: T.accentPurpleDeep }]} onPress={handlePickImage}>
                <Ionicons name="camera" size={15} color="#fff" />
              </Pressable>
            </View>
            <Spacer height={20} />
            <ThemedText style={styles.inputLabel}>Username</ThemedText>
            <ThemedTextInput value={draftUsername} onChangeText={setDraftUsername} placeholder="Enter your username" style={styles.input} />
            <Spacer height={20} />
            <ThemedButton style={styles.saveBtn} onPress={handleSaveAccount}>
              <ThemedText style={styles.saveBtnText}>Save Changes</ThemedText>
            </ThemedButton>
          </View>
        </View>
      </ThemedModal>

      {/* ── Salary Modal ── */}
      <ThemedModal visible={activeModal === "salary"} onClose={() => setActiveModal(null)} fullScreen contentStyle={styles.modalContent} overlayStyle={styles.modalOverlay}>
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: T.bgCard }]}>
            <ThemedText style={styles.modalTitle}>Current Salary</ThemedText>
            <Spacer height={24} />
            <ThemedText style={styles.inputLabel}>Monthly Salary</ThemedText>
            <View style={styles.salaryRow}>
              <View style={styles.currencyTag}>
                <ThemedText style={styles.currencyText}>RM</ThemedText>
              </View>
              <ThemedTextInput value={draftSalary} onChangeText={setDraftSalary} placeholder="0.00" keyboardType="decimal-pad" style={[styles.input, { flex: 1, marginBottom: 0 }]} />
            </View>
            <Spacer height={8} />
            <ThemedText style={styles.salaryHint}>Daily budget: RM {draftSalary && !isNaN(parseFloat(draftSalary)) ? (parseFloat(draftSalary) / 30).toFixed(2) : "—"}</ThemedText>
            <Spacer height={20} />
            <ThemedButton style={styles.saveBtn} onPress={handleSaveSalary}>
              <ThemedText style={styles.saveBtnText}>Save Salary</ThemedText>
            </ThemedButton>
          </View>
        </View>
      </ThemedModal>

      {/* ── Daily Savings Modal ── */}
      <ThemedModal visible={activeModal === "savings"} onClose={() => setActiveModal(null)} fullScreen contentStyle={styles.modalContent} overlayStyle={styles.modalOverlay}>
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: T.bgCard, flex: 1, maxHeight: "75%" }]}>
            <ThemedText style={styles.modalTitle}>Daily Savings</ThemedText>
            <ThemedText style={styles.modalSubtitle}>Your saving history</ThemedText>
            <Spacer height={16} />
            <ThemedFlatList
              data={dailySavingsData}
              keyExtractor={(_, i) => i.toString()}
              scrollEnabled
              style={{ flex: 1 }}
              renderItem={({ item, index }) => (
                <View style={[styles.savingsRow, index === dailySavingsData.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.savingsDot} />
                  <ThemedText style={styles.savingsDate}>{item.date}</ThemedText>
                  <ThemedText style={[styles.savingsAmount, { color: T.accentPurpleDeep }]}>{item.amount}</ThemedText>
                </View>
              )}
              ListFooterComponent={<Spacer height={8} />}
            />
          </View>
        </View>
      </ThemedModal>

      {/* ── Theme Modal ── */}
      <ThemedModal visible={activeModal === "theme"} onClose={() => setActiveModal(null)} fullScreen contentStyle={styles.modalContent} overlayStyle={styles.modalOverlay}>
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: T.bgCard }]}>
            <ThemedText style={styles.modalTitle}>Theme Mode</ThemedText>
            <Spacer height={24} />
            {[
              { mode: "dark",  icon: "moon",  label: "Dark Mode"  },
              { mode: "light", icon: "sunny", label: "Light Mode" },
            ].map(({ mode, icon, label }) => {
              const active = isDarkMode ? mode === "dark" : mode === "light";
              return (
                <Pressable
                  key={mode}
                  style={[styles.themeOption, { borderColor: active ? T.accentPurpleDeep : T.bgBorder, backgroundColor: active ? T.accentPurpleLight : "transparent" }]}
                  onPress={() => { setThemeMode(mode); setActiveModal(null); }}
                >
                  <View style={[styles.themeIconWrap, { backgroundColor: active ? T.accentPurpleDeep : T.bgBorder }]}>
                    <Ionicons name={icon} size={18} color={active ? "#fff" : T.textLight} />
                  </View>
                  <ThemedText style={[styles.themeLabel, active && { color: T.accentPurpleDeep, fontWeight: "700" }]}>{label}</ThemedText>
                  {active && <Ionicons name="checkmark-circle" size={18} color={T.accentPurpleDeep} style={{ marginLeft: "auto" }} />}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ThemedModal>

      {/* ── Logout Modal ── */}
      <ThemedModal visible={activeModal === "logout"} onClose={() => setActiveModal(null)} fullScreen contentStyle={styles.modalContent} overlayStyle={styles.modalOverlay}>
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: T.bgCard }]}>
            <View style={styles.logoutIconWrap}>
              <Ionicons name="log-out" size={28} color={T.coral} />
            </View>
            <Spacer height={12} />
            <ThemedText style={styles.modalTitle}>Logout</ThemedText>
            <ThemedText style={styles.logoutMsg}>Are you sure you want to logout?</ThemedText>
            <Spacer height={24} />
            <ThemedButton style={[styles.saveBtn, { backgroundColor: T.coral }]} onPress={() => { logout(); setActiveModal(null); }}>
              <ThemedText style={styles.saveBtnText}>Yes, Logout</ThemedText>
            </ThemedButton>
            <Pressable style={styles.cancelBtn} onPress={() => setActiveModal(null)}>
              <ThemedText style={styles.cancelBtnText}>Cancel</ThemedText>
            </Pressable>
          </View>
        </View>
      </ThemedModal>

    </ThemedView>
  );
};

export default ProfileIndex;

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: T.bgWarm },
  decoWrap:    { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },
  scrollContent:{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 36 },

  // Hero
  hero:          { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16, zIndex: 1 },
  avatarWrap:    { width: 72, height: 72, position: "relative" },
  avatarImg:     { width: 72, height: 72, borderRadius: 20, resizeMode: "cover", borderWidth: 2, borderColor: T.accentGoldMid },
  avatarEditBadge:{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: 8, backgroundColor: T.accentPurpleDeep, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: T.bgWarm },
  heroText:      { flex: 1 },
  heroName:      { fontSize: 20, fontWeight: "700", color: T.textDark, marginBottom: 3 },
  heroEmail:     { fontSize: 13, color: T.textLight },

  // Stats
  statsStrip:    { flexDirection: "row", gap: 8, marginBottom: 20, zIndex: 1 },
  statCard:      { flex: 1, backgroundColor: T.bgCard, borderWidth: 1.5, borderColor: T.bgBorder, borderRadius: 14, padding: 10, alignItems: "center", gap: 3 },
  statIcon:      { fontSize: 16 },
  statLabel:     { fontSize: 9, letterSpacing: 0.7, textTransform: "uppercase", color: T.textLight, textAlign: "center" },
  statValue:     { fontSize: 12, fontWeight: "700", color: T.textDark, textAlign: "center" },

  // Section label
  sectionHeaderWrap: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6, marginTop: 4, paddingLeft: 2 },
  sectionDot:        { width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.accentGold },
  sectionLabel:      { fontSize: 10, fontWeight: "700", letterSpacing: 0.9, textTransform: "uppercase", color: T.textLight },

  // Menu card
  menuCard:      { backgroundColor: T.bgCard, borderWidth: 1.5, borderColor: T.bgBorder, borderRadius: 16, marginBottom: 14, overflow: "hidden" },
  menuRow:       { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  menuIconWrap:  { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuRowText:   { flex: 1 },
  menuLabel:     { fontSize: 14, fontWeight: "600", color: T.textDark },
  menuSublabel:  { fontSize: 11, color: T.textLight, marginTop: 1 },
  menuDivider:   { height: 1, backgroundColor: T.bgBorder, marginHorizontal: 14 },
  badgeWrap:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: "#FFF3C0", marginRight: 6 },
  badgeText:     { fontSize: 10, fontWeight: "700", color: "#C8A800" },

  // Modal shared
  modalContent:  { top: 0, left: 0, right: 0, bottom: 0 },
  modalOverlay:  { backgroundColor: "rgba(44,24,16,0.35)" },
  modalCenter:   { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  modalCard:     { width: "100%", borderRadius: 24, padding: 24, borderWidth: 1.5, borderColor: T.bgBorder },
  modalTitle:    { fontSize: 18, fontWeight: "700", color: T.textDark, textAlign: "center" },
  modalSubtitle: { fontSize: 12, color: T.textLight, textAlign: "center", marginTop: 3 },

  // Inputs
  inputLabel:    { fontSize: 11, fontWeight: "600", color: T.textMid, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6 },
  input:         { borderRadius: 12, borderWidth: 1.5, borderColor: T.bgBorder, paddingHorizontal: 14, height: 52, backgroundColor: T.bgWarm, fontSize: 14, color: T.textDark, marginBottom: 0 },

  // Avatar edit in modal
  avatarEditWrap:  { alignItems: "center", position: "relative", alignSelf: "center" },
  modalAvatarRing: { width: 90, height: 90, borderRadius: 22, overflow: "hidden", borderWidth: 2.5, borderColor: T.bgBorder },
  modalAvatarImg:  { width: "100%", height: "100%", resizeMode: "cover" },
  modalCameraBtn:  { position: "absolute", bottom: 0, right: -6, width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: T.bgCard },

  // Salary
  salaryRow:     { flexDirection: "row", alignItems: "center", gap: 8 },
  currencyTag:   { height: 52, justifyContent: "center", paddingHorizontal: 4 },
  currencyText:  { fontSize: 14, fontWeight: "700", color: T.textMid },
  salaryHint:    { fontSize: 12, color: T.textLight, marginTop: 6 },

  // Save button
  saveBtn:       { width: "100%", borderRadius: 14, paddingVertical: 16, backgroundColor: T.accentPurpleDeep, alignItems: "center", shadowColor: T.accentPurpleDeep, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 5 },
  saveBtnText:   { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Cancel
  cancelBtn:     { width: "100%", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 10, borderWidth: 1.5, borderColor: T.bgBorder },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: T.textMid },

  // Daily savings list
  savingsRow:    { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: T.bgBorder },
  savingsDot:    { width: 5, height: 5, borderRadius: 2.5, backgroundColor: T.accentGold },
  savingsDate:   { flex: 1, fontSize: 13, fontWeight: "500", color: T.textMid },
  savingsAmount: { fontSize: 13, fontWeight: "700" },

  // Theme options
  themeOption:   { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 10 },
  themeIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  themeLabel:    { fontSize: 14, fontWeight: "500", color: T.textDark },

  // Logout
  logoutIconWrap:{ width: 56, height: 56, borderRadius: 16, backgroundColor: "#FFF0EE", alignItems: "center", justifyContent: "center", alignSelf: "center" },
  logoutMsg:     { fontSize: 13, color: T.textLight, textAlign: "center", marginTop: 6, lineHeight: 20 },
});