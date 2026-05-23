import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";

const T = {
  accentGold:  "#F5C842",
  accentGoldMid: "#F5DFA0",
  teal:        "#40596B",
  textDark:    "#2C1810",
  textMid:     "#7A5C3C",
  textLight:   "#BFA080",
  bgCard:      "#FFFDF7",
  bgBorder:    "#F5DFA0",
};

const CARD_INFO = {
  dailyBudget: { title: "Daily Budget 💼", description: "Your monthly salary ÷ 30. This is the total you can spend or save in a day." },
  spentToday:  { title: "Spent Today 🧾",  description: "Expenses logged today. Keep this low — every ringgit saved goes to your goals!" },
  saveable:    { title: "Saveable Amount 🪙", description: "Daily budget minus today's spending. Automatically split across all active goals." },
};

const TutorialContext = createContext(null);
export const useTutorial = () => {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be inside <TutorialProvider>");
  return ctx;
};

export function TutorialProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showInfo = useCallback((key) => {
    const data = CARD_INFO[key];
    if (!data) return;
    setInfo(data);
    setVisible(true);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const dismiss = useCallback(() => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setVisible(false);
      setInfo(null);
    });
  }, [fadeAnim]);

  return (
    <TutorialContext.Provider value={{ showInfo }}>
      {children}
      {visible && info && (
        <Modal transparent animationType="none" visible statusBarTranslucent hardwareAccelerated>
          <Animated.View style={[s.backdrop, { opacity: fadeAnim }]}>
            <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={dismiss} />
            <Animated.View style={[s.card, { opacity: fadeAnim }]}>
              <Text style={s.title}>{info.title}</Text>
              <Text style={s.desc}>{info.description}</Text>
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </TutorialContext.Provider>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(28,14,4,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: T.bgCard,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    padding: 24,
    width: "100%",
    shadowColor: "rgba(200,140,0,0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 24,
  },
  title: { fontSize: 17, fontWeight: "800", color: T.textDark, marginBottom: 10, letterSpacing: -0.2 },
  desc:  { fontSize: 14, color: T.textMid, lineHeight: 22 },
});