import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Animated,
  Image,
  Text,
  Dimensions,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemedView from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedText from "../../../components/ThemedText";
import Spacer from "../../../components/Spacer";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import ImageUpload from "../../../components/ThemedUploadImage";
import { useTheme } from "../../../hooks/useTheme";
import { getPrimaryColor } from "../../../constants/Colors";

function AddExpenses() {
  const { method } = useLocalSearchParams();
  const isUploadMode = method !== "manual";
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedView
      safe
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ThemedScrollView contentContainerStyle={styles.content}>
        {isUploadMode ? <UploadReceipt /> : <ManualEntry />}
      </ThemedScrollView>
      <CoinModal />
    </ThemedView>
  );
}

const UploadReceipt = () => {
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedCard
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.uiBackground,
          borderColor: theme.iconColor,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[styles.sectionIconWrap, { backgroundColor: primaryColor }]}
        >
          <Ionicons name="camera" size={18} color="#fff" />
        </View>
        <View style={styles.sectionHeaderText}>
          <ThemedText
            title
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Receipt Upload
          </ThemedText>
          <ThemedText
            style={[styles.sectionSubtitle, { color: theme.placeholderText }]}
          >
            Add a receipt and keep the details tidy.
          </ThemedText>
        </View>
      </View>
      <Link
        style={[
          styles.switchLink,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(184, 168, 216, 0.16)"
                : "rgba(104, 73, 167, 0.10)",
            borderColor: primaryColor,
          },
        ]}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "manual" },
        }}
      >
        <ThemedText
          style={[
            styles.switchText,
            { color: colorScheme === "dark" ? theme.text : primaryColor },
          ]}
        >
          Don&apos;t have a receipt? Switch to manual entry
        </ThemedText>
      </Link>
      <Spacer height={30} />
      <ImageUpload purpose="receipt" />
      <ThemedTextInput
        placeholder="Expense description (optional)"
        multiline={true}
        numberOfLines={3}
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedButton
        style={[styles.saveButton, { backgroundColor: primaryColor }]}
        onPress={() => {
          global.__showExpenseCoinModal && global.__showExpenseCoinModal();
        }}
      >
        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

const ManualEntry = () => {
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedCard
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.uiBackground,
          borderColor: theme.iconColor,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[styles.sectionIconWrap, { backgroundColor: primaryColor }]}
        >
          <Ionicons name="list" size={18} color="#fff" />
        </View>
        <View style={styles.sectionHeaderText}>
          <ThemedText
            title
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Expense Details
          </ThemedText>
          <ThemedText
            style={[styles.sectionSubtitle, { color: theme.placeholderText }]}
          >
            Enter the amount and description manually.
          </ThemedText>
        </View>
      </View>
      <Link
        style={[
          styles.switchLink,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(184, 168, 216, 0.16)"
                : "rgba(104, 73, 167, 0.10)",
            borderColor: primaryColor,
          },
        ]}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "upload" },
        }}
      >
        <ThemedText
          style={[
            styles.switchText,
            { color: colorScheme === "dark" ? theme.text : primaryColor },
          ]}
        >
          Prefer a scan? Try our receipt upload!
        </ThemedText>
      </Link>
      <Spacer height={50} />
      <ThemedTextInput
        placeholder="Expense description"
        multiline={true}
        numberOfLines={3}
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedTextInput
        placeholder="Total amount (RM)"
        keyboardType="numeric"
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedButton
        style={[styles.saveButton, { backgroundColor: primaryColor }]}
        onPress={() => {
          global.__showExpenseCoinModal && global.__showExpenseCoinModal();
        }}
      >
        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

function CoinModal() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const COIN_COUNT = 1;
  const coins = useRef(
    new Array(COIN_COUNT).fill(0).map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    })),
  ).current;
  const ellipsisDots = useRef(
    [0, 1, 2].map(() => new Animated.Value(0.35)),
  ).current;

  useEffect(() => {
    if (!visible) {
      ellipsisDots.forEach((dot) => dot.setValue(0.35));
      return undefined;
    }

    const loops = ellipsisDots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 120),
          Animated.timing(dot, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    loops.forEach((loop) => loop.start());

    return () => {
      loops.forEach((loop) => loop.stop());
      ellipsisDots.forEach((dot) => dot.setValue(0.35));
    };
  }, [ellipsisDots, visible]);

  const show = () => {
    setVisible(true);

    coins.forEach((c) => {
      c.translateY.setValue(0);
      c.translateX.setValue(0);
      c.rotate.setValue(0);
      c.scale.setValue(1);
    });

    const allAnim = coins.map((c, i) => {
      const toRight = 80 + i * 28;
      return Animated.sequence([
        Animated.timing(c.translateY, {
          toValue: -110 - i * 6,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 1050,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateX, {
            toValue: toRight,
            duration: 1050,
            useNativeDriver: true,
          }),
          Animated.timing(c.rotate, {
            toValue: 1440,
            duration: 1050,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(c.translateY, {
            toValue: 160,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 182,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 192,
            duration: 90,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 90,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(c.scale, {
          toValue: 0.92,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(c.scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(120, allAnim).start(() => {
      router.replace("/expenses");
    });
  };

  global.__showExpenseCoinModal = show;

  const flipDegs = coins.map((c) =>
    c.rotate.interpolate({
      inputRange: [0, 1440],
      outputRange: ["0deg", "1440deg"],
    }),
  );
  const spinDegs = coins.map((c) =>
    c.rotate.interpolate({
      inputRange: [0, 1440],
      outputRange: ["0deg", "360deg"],
    }),
  );

  return (
    <Modal transparent={false} visible={visible} animationType="fade">
      <View
        style={[styles.modalOverlay, { backgroundColor: theme.background }]}
      >
        <View style={styles.fullModalContent}>
          <View style={styles.modalMessageRow}>
            <ThemedText style={[styles.modalTitle, { color: theme.text }]}>
              Saving your expense
            </ThemedText>
            <View style={styles.modalDotsWrap}>
              {ellipsisDots.map((dot, index) => (
                <Animated.Text
                  key={index}
                  style={[
                    styles.modalDot,
                    {
                      color: theme.text,
                      opacity: dot,
                      transform: [
                        {
                          scale: dot.interpolate({
                            inputRange: [0.35, 1],
                            outputRange: [1, 1.55],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  .
                </Animated.Text>
              ))}
            </View>
          </View>
          <View style={styles.boxWrap}>
            <Image
              source={require("../../../assets/img/money-box.png")}
              style={styles.moneyBox}
              resizeMode="contain"
            />

            {coins.map((c, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.coin,
                  {
                    transform: [
                      { perspective: 900 },
                      { translateX: c.translateX },
                      { translateY: c.translateY },
                      { rotateX: flipDegs[idx] },
                      { rotateZ: spinDegs[idx] },
                      { scale: c.scale },
                    ],
                    opacity: 0.98,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AddExpenses;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    alignItems: "stretch",
  },
  sectionCard: {
    width: "100%",
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.72,
  },
  switchLink: {
    alignSelf: "stretch",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  switchText: {
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 15,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
  },
  fullModalContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  modalMessageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 100,
  },
  modalDotsWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 6,
  },
  modalDot: {
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 30,
    marginLeft: 2,
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  boxWrap: {
    width: 300,
    height: 240,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  moneyBox: {
    width: 260,
    height: 200,
    position: "absolute",
    bottom: 0,
  },
  coin: {
    position: "absolute",
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6B800",
    borderWidth: 3,
    borderColor: "#FFD54F",
    left: "50%",
    marginLeft: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
