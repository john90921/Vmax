import React, { useState, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  SectionList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedText from "../../../components/ThemedText";
import ThemedModal from "../../../components/ThemedModal";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");

const T = {
  accentGold:       "#F5C842",
  accentGoldDeep:   "#C8A800",
  accentGoldLight:  "#FFF3C0",
  accentGoldMid:    "#F5DFA0",
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
      <Svg width={SCREEN_W} height={140} viewBox={`0 0 ${SCREEN_W} 140`}>
        <Circle cx={SCREEN_W * 0.9} cy={10}  r={100} fill={T.accentGold}  fillOpacity={0.07} />
        <Circle cx={SCREEN_W * 0.1} cy={100} r={55}  fill={T.coral}       fillOpacity={0.05} />
        <Circle cx={SCREEN_W * 0.5} cy={-10} r={36}  fill={T.teal}        fillOpacity={0.04} />
        <Path
          d={`M0,70 Q${SCREEN_W*0.3},44 ${SCREEN_W*0.65},62 Q${SCREEN_W},78 ${SCREEN_W},48`}
          stroke={T.accentGold} strokeWidth="1" fill="none" strokeOpacity={0.25}
        />
      </Svg>
    </View>
  );
}

const getCategoryInfo = (description) => {
  const desc = description.toLowerCase().trim();
  if (["food","lunch","dinner","breakfast","eat","restaurant","cafe","meal"].some(k => desc.includes(k)))
    return { emoji: "🍽️", color: "#FF6B6B18" };
  if (["travel","transport","taxi","flight","hotel","uber","car"].some(k => desc.includes(k)))
    return { emoji: "✈️", color: "#4ECDC418" };
  if (["office","supply","software","work","tool","equipment"].some(k => desc.includes(k)))
    return { emoji: "💼", color: "#45B7D118" };
  if (["conference","meeting","training","workshop","seminar"].some(k => desc.includes(k)))
    return { emoji: "🎯", color: "#96CEB418" };
  if (["entertainment","movie","game","event","ticket"].some(k => desc.includes(k)))
    return { emoji: "🎲", color: "#FFEAA718" };
  if (["rent","mortgage","property","house","apartment"].some(k => desc.includes(k)))
    return { emoji: "🏠", color: "#DDA0DD18" };
  if (["utilities","electric","water","internet","phone","subscription"].some(k => desc.includes(k)))
    return { emoji: "⚡", color: "#c2b5af18" };
  if (["shopping","shop","buy","purchase","clothes","store"].some(k => desc.includes(k)))
    return { emoji: "🛍️", color: "#FF69B418" };
  if (["health","medical","doctor","pharmacy","medicine","hospital"].some(k => desc.includes(k)))
    return { emoji: "💊", color: "#FF8C0018" };
  return { emoji: "💸", color: `${T.accentPurple}14` };
};

const ExpensesIndex = () => {
  const { theme } = useTheme();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthFilter, setShowMonthFilter] = useState(false);

  const expenses = [
    { id: "1",  description: "Lunch with client",       receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 45.0,   created_at: "2026-05-01" },
    { id: "2",  description: "FKOM shopping",           receipt_uri: "https://instagram.fkul19-1.fna.fbcdn.net/v/t51.82787-19/648308314_18040284602566350_384478460884245737_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fkul19-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2gEIUFryfBbQl4zO_nC-XpTH_uHaZBrdQmfZjfYqKvkSO5tXKO5egVYD6ws2EJr4Wq0&_nc_ohc=GIY90nGBWO8Q7kNvwGWQh54&_nc_gid=3BHDyV_ziA6QqfKhBqaQoA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Af4nb3Zjp7VlS3-9pv10Y5Wp4WMTjAAaVctbeqaEPkGhlQ&oe=6A0E9FAF&_nc_sid=8b3546", amount: 30.5,   created_at: "2026-05-03" },
    { id: "3",  description: "",                        receipt_uri: "https://news.umpsa.edu.my/sites/default/files/gallery/UMPSA%20.jpg",                                                                                                                                                                                                                                                                                                                                                                                                                                                                        amount: 15.75,  created_at: "2026-05-03" },
    { id: "4",  description: "Conference registration", receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 120.0,  created_at: "2026-05-03" },
    { id: "5",  description: "Travel expenses",         receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 200.0,  created_at: "2026-05-10" },
    { id: "6",  description: "Team dinner",             receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 80.0,   created_at: "2026-04-12" },
    { id: "7",  description: "Software subscription",  receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 50.0,   created_at: "2026-03-12" },
    { id: "8",  description: "Client entertainment",   receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 150.0,  created_at: "2026-04-12" },
    { id: "9",  description: "Office rent",            receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 1000.0, created_at: "2026-04-19" },
    { id: "10", description: "Utilities",              receipt_uri: "",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          amount: 300.0,  created_at: "2026-05-25" },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getMonthFromDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const sections = useMemo(() => {
    const sorted = expenses.slice().sort((a, b) => {
      const da = new Date(a.created_at), db = new Date(b.created_at);
      return sortOrder === "desc" ? db - da : da - db;
    });
    const filtered = selectedMonth
      ? sorted.filter((e) => getMonthFromDate(e.created_at) === selectedMonth)
      : sorted;
    return filtered.reduce((grouped, expense) => {
      const key = formatDate(expense.created_at);
      const section = grouped.find((s) => s.title === key);
      if (section) section.data.push(expense);
      else grouped.push({ title: key, data: [expense] });
      return grouped;
    }, []);
  }, [expenses, sortOrder, selectedMonth]);

  const totalByDate = useMemo(() =>
  sections.reduce((acc, s) => {
    acc[s.title] = s.data.reduce((sum, i) => sum + i.amount, 0);
    return acc;
  }, {}), [sections]);

  const uniqueMonths = useMemo(() =>
    [...new Set(expenses.map((e) => getMonthFromDate(e.created_at)))].sort(
      (a, b) => new Date(`01 ${b}`) - new Date(`01 ${a}`)
    ), [expenses]);

  const currentMonth = getMonthFromDate(new Date().toISOString().slice(0, 10));
  const monthlyTotal = expenses
    .filter((e) => getMonthFromDate(e.created_at) === currentMonth)
    .reduce((sum, e) => sum + e.amount, 0);
  const biggest = Math.max(...expenses.map((e) => e.amount));
  const entryCount = expenses.length;

  return (
    <View style={[styles.root, { backgroundColor: T.bgWarm }]}>
      <WarmDecoration />

      {/* Summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.sumCard}>
          <ThemedText style={styles.sumIcon}>📅</ThemedText>
          <ThemedText style={styles.sumLabel}>This month</ThemedText>
          <ThemedText style={[styles.sumValue, { color: T.accentPurpleDeep }]}>
            RM {monthlyTotal.toFixed(2)}
          </ThemedText>
        </View>
        <View style={styles.sumCard}>
          <ThemedText style={styles.sumIcon}>🧾</ThemedText>
          <ThemedText style={styles.sumLabel}>Entries</ThemedText>
          <ThemedText style={styles.sumValue}>{entryCount}</ThemedText>
        </View>
        <View style={styles.sumCard}>
          <ThemedText style={styles.sumIcon}>📈</ThemedText>
          <ThemedText style={styles.sumLabel}>Biggest</ThemedText>
          <ThemedText style={[styles.sumValue, { color: T.coral }]}>
            RM {biggest.toFixed(0)}
          </ThemedText>
        </View>
      </View>

      {/* Filter row */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowMonthFilter(!showMonthFilter)}
        >
          <Ionicons name="options" size={16} color={T.accentPurpleDeep} />
          <ThemedText style={styles.filterBtnText}>
            {selectedMonth ? selectedMonth : "All months"}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          <Ionicons name="swap-vertical" size={16} color={T.accentPurpleDeep} />
          <ThemedText style={styles.filterBtnText}>
            {sortOrder === "desc" ? "Newest first" : "Oldest first"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Month dropdown */}
      {showMonthFilter && (
        <View style={styles.monthDropdown}>
          <TouchableOpacity
            onPress={() => { setSelectedMonth(null); setShowMonthFilter(false); }}
            style={[styles.monthOption, !selectedMonth && styles.monthOptionActive]}
          >
            <ThemedText style={[styles.monthOptionText, !selectedMonth && { color: T.accentPurpleDeep, fontWeight: "700" }]}>
              All months
            </ThemedText>
          </TouchableOpacity>
          {uniqueMonths.map((month) => (
            <TouchableOpacity
              key={month}
              onPress={() => { setSelectedMonth(month); setShowMonthFilter(false); }}
              style={[styles.monthOption, selectedMonth === month && styles.monthOptionActive]}
            >
              <ThemedText style={[styles.monthOptionText, selectedMonth === month && { color: T.accentPurpleDeep, fontWeight: "700" }]}>
                {month}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrap}>
            <View style={styles.sectionDot} />
            <ThemedText style={styles.sectionDateText}>{section.title}</ThemedText>
            <View style={styles.sectionHeaderSpacer} />
            <ThemedText style={styles.sectionTotalText}>
              RM {totalByDate[section.title]?.toFixed(2) || "0.00"}
            </ThemedText>
          </View>
        )}
        renderItem={({ item, index, section }) => {
          const { emoji, color } = getCategoryInfo(item.description);
          const isFirst = index === 0;
          const isLast  = index === section.data.length - 1;
          return (
            <View style={[
              styles.expenseRow,
              isFirst && styles.expenseRowFirst,
              isLast  && styles.expenseRowLast,
              !isLast && styles.expenseRowDivider,
            ]}>
              <View style={[styles.categoryDot, { backgroundColor: color }]}>
                <ThemedText style={styles.categoryEmoji}>{emoji}</ThemedText>
              </View>
              <View style={styles.expenseDetails}>
                <ThemedText
                  style={[
                    styles.expenseDescription,
                    { color: !item.description.trim() && item.receipt_uri ? T.textLight : T.textDark },
                  ]}
                  numberOfLines={1}
                >
                  {item.description.trim() || "Receipt uploaded"}
                </ThemedText>
                {item.receipt_uri && (
                  <TouchableOpacity
                    onPress={() => { setSelectedReceipt(item.receipt_uri); setSelectedExpense(item); }}
                    style={styles.receiptChip}
                  >
                    <Ionicons name="receipt-outline" size={10} color={T.accentPurpleDeep} />
                    <ThemedText style={styles.receiptChipText}>receipt</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
              <ThemedText style={styles.amountText}>RM {item.amount.toFixed(2)}</ThemedText>
            </View>
          );
        }}
        renderSectionFooter={() => <View style={styles.sectionGap} />}
        ListFooterComponent={
          <ThemedText style={styles.endText}>You're all caught up  ✦</ThemedText>
        }
      />

      <ThemedModal
        visible={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        fullScreen
        contentStyle={[styles.modalContent, { backgroundColor: T.bgWarm }]}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedReceipt(null)}
        >
          <View style={styles.modalImageContainer}>
            {selectedExpense && (
              <ThemedText style={styles.receiptDate}>{selectedExpense.created_at}</ThemedText>
            )}
            {selectedReceipt && (
              <Image
                source={{ uri: selectedReceipt }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </ThemedModal>
    </View>
  );
};

export default ExpensesIndex;

const styles = StyleSheet.create({
  root:    { flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  decoWrap:{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },

  summaryStrip: { flexDirection: "row", gap: 8, marginBottom: 14, zIndex: 1 },
  sumCard:      { flex: 1, backgroundColor: "#FFFDF7", borderWidth: 1.5, borderColor: "#F5DFA0", borderRadius: 14, padding: 10, alignItems: "center", gap: 3 },
  sumIcon:      { fontSize: 18 },
  sumLabel:     { fontSize: 9, letterSpacing: 0.8, textTransform: "uppercase", color: "#BFA080", textAlign: "center" },
  sumValue:     { fontSize: 13, fontWeight: "700", color: "#2C1810", textAlign: "center" },

  filterRow:    { flexDirection: "row", gap: 10, marginBottom: 14, zIndex: 1 },
  filterBtn:    { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: "#7F77DD", backgroundColor: "rgba(127,119,221,0.08)" },
  filterBtnText:{ fontSize: 13, fontWeight: "500", color: "#534AB7" },

  monthDropdown:    { backgroundColor: "#FFFDF7", borderWidth: 1.5, borderColor: "#F5DFA0", borderRadius: 14, marginBottom: 12, overflow: "hidden", zIndex: 10 },
  monthOption:      { paddingVertical: 12, paddingHorizontal: 16 },
  monthOptionActive:{ backgroundColor: "rgba(127,119,221,0.08)" },
  monthOptionText:  { fontSize: 13, color: "#7A5C3C" },

  listContent: { paddingBottom: 32 },

  // Compact date label
  sectionHeaderWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 0,
    paddingLeft: 4,
  },
  sectionDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: "#F5C842",
  },
  sectionDateText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.9,
    textTransform: "uppercase",
    color: "#BFA080",
  },

  // Grouped rows share one card border
  expenseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFDF7",
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: "#F5DFA0",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  expenseRowFirst: {
    borderTopWidth: 1.5,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  expenseRowLast: {
    borderBottomWidth: 1.5,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  expenseRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5DFA066",
  },

  sectionGap: { height: 2 },

  categoryDot:   { width: 34, height: 34, borderRadius: 9, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  categoryEmoji: { fontSize: 17 },
  expenseDetails:{ flex: 1, gap: 3 },
  expenseDescription: { fontSize: 13.5, fontWeight: "500", color: "#2C1810" },

  receiptChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingVertical: 2, paddingHorizontal: 7,
    borderRadius: 6,
    borderWidth: 1, borderColor: "rgba(83,74,183,0.25)",
    alignSelf: "flex-start",
  },
  receiptChipText: { color: "#534AB7", fontSize: 10, fontWeight: "600" },

  amountText: { fontSize: 14, fontWeight: "700", color: "#2C1810" },

  endText: { textAlign: "center", fontStyle: "italic", fontSize: 12, letterSpacing: 0.5, color: "#BFA080", marginTop: 12 },

  modalContent:       { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalBackdrop:      { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
  modalImageContainer:{ width: "100%", height: "80%", justifyContent: "flex-start", alignItems: "center", paddingTop: 16 },
  receiptDate:        { fontSize: 16, fontWeight: "600", marginBottom: 12, color: "#7A5C3C" },
  receiptImage:       { width: "100%", height: "90%", borderRadius: 18 },

  sectionHeaderSpacer: { flex: 1 },
  sectionTotalText: {
    fontSize: 11,
    fontWeight: "700",
    color: T.accentPurpleDeep,
    letterSpacing: 0.3,
  },
});