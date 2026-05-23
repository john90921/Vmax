/**
 * PiggyBankTracker.jsx  (Expo Go compatible — no Reanimated, no LinearGradient)
 * Uses SVG from SVGRepo integrated with liquid fill animation.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';

import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  ClipPath,
  Rect,
  G,
} from 'react-native-svg';

const { width: SCREEN_W } = Dimensions.get('window');

const PALETTE = {
  pigCoin:          '#FFD700',
  pigCoinEdge:      '#C8A800',
  fillWater:        '#77c4ff',
  fillWaterDeep:    '#0b5998',
  bgCardBorder:     '#F5DFA0',
  accentGold:       '#F5C842',
  textDark:         '#2C1810',
  textMid:          '#7A5C3C',
  textLight:        '#BFA080',
  goalComplete:     '#4CAF50',
  goalCompleteLight:'#A5D6A7',
};

// The SVG viewBox is 508x508, we scale it down
const PIG_W = 150;
const PIG_H = 150;
const SCALE = PIG_W / 508;

// ── Coin drop ─────────────────────────────────────────────────────────────────
function CoinDrop({ x = 110, onComplete }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity    = useRef(new Animated.Value(0)).current;
  const scale      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 1,  duration: 80,  useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 60, duration: 420, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(scale,   { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => { if (finished && onComplete) onComplete(); });
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', left: x - 10, top: 0, zIndex: 10,
      transform: [{ translateY }, { scale }], opacity,
    }}>
      <Svg width={20} height={20}>
        <Circle cx={10} cy={10} r={9}  fill={PALETTE.pigCoin} />
        <Circle cx={10} cy={10} r={7}  fill="none" stroke={PALETTE.pigCoinEdge} strokeWidth={1.5} />
        <Path d="M8 5 L8 15 M7 7 Q10 6 12 8 Q13 10 10 11 Q13 11 13 13 Q13 16 8 15"
          stroke="#8B6914" strokeWidth={1} fill="none" strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
}

// ── Sparkle ───────────────────────────────────────────────────────────────────
function Sparkle({ x, y, delay = 0 }) {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1, damping: 8, stiffness: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.delay(400),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute', left: x - 8, top: y - 8, width: 16, height: 16,
      opacity, transform: [{ scale }],
    }}>
      <Svg width={16} height={16} viewBox="0 0 16 16">
        <Path d="M8 0 L9 6 L15 5 L10 9 L13 15 L8 11 L3 15 L6 9 L1 5 L7 6 Z"
          fill={PALETTE.accentGold} />
      </Svg>
    </Animated.View>
  );
}

// ── Piggy Bank SVG with liquid fill ──────────────────────────────────────────
function PiggyBankSVG({ fillPercent, isGoalReached }) {
  const fillAnim  = useRef(new Animated.Value(508)).current;
  const bodyScale = useRef(new Animated.Value(1)).current;
  const waveAnim  = useRef(new Animated.Value(0)).current;

  const [fillY,   setFillY]   = useState(508);
  const [waveVal, setWaveVal] = useState(0);

  // The pig body ellipse (in 508x508 space) is roughly:
  // cx=252, cy=301, rx=222, ry=171
  // So fill goes from top of ellipse (~130) to bottom (~472)
  const BODY_TOP = 145;
  const BODY_BOT = 460;

  useEffect(() => {
    const targetY = BODY_BOT - fillPercent * (BODY_BOT - BODY_TOP);
    Animated.spring(fillAnim, {
      toValue: targetY,
      damping: 14,
      stiffness: 60,
      useNativeDriver: false,
    }).start();
  }, [fillPercent]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (isGoalReached) {
      Animated.sequence([
        Animated.spring(bodyScale, { toValue: 1.06, damping: 5,  stiffness: 300, useNativeDriver: true }),
        Animated.spring(bodyScale, { toValue: 0.97, damping: 6,  useNativeDriver: true }),
        Animated.spring(bodyScale, { toValue: 1,    damping: 10, useNativeDriver: true }),
      ]).start();
    }
  }, [isGoalReached]);

  useEffect(() => {
    const id = fillAnim.addListener(({ value }) => setFillY(value));
    return () => fillAnim.removeListener(id);
  }, []);

  useEffect(() => {
    const id = waveAnim.addListener(({ value }) => setWaveVal(value));
    return () => waveAnim.removeListener(id);
  }, []);

  const o    = waveVal * Math.PI * 2;
  const amp  = 12;
  // Wave path in 508x508 space, clipped to ellipse
  const wavePath =
    `M30,${fillY + amp * Math.sin(o)}` +
    ` C130,${fillY + amp * Math.sin(o + 1)} 250,${fillY - amp * Math.sin(o + 1)} 370,${fillY + amp * Math.sin(o + 2)}` +
    ` C440,${fillY + amp * Math.sin(o + 3)} 474,${fillY - amp * Math.sin(o + 3)} 474,${fillY}` +
    ` L474,472 L30,472 Z`;

  const fillColor = isGoalReached ? PALETTE.goalComplete      : PALETTE.fillWaterDeep;
  const waveColor = isGoalReached ? PALETTE.goalCompleteLight : PALETTE.fillWater;
  const fillH     = Math.max(0, BODY_BOT - fillY);

  return (
    <Animated.View style={{ width: PIG_W, height: PIG_H, transform: [{ scale: bodyScale }] }}>
      <Svg
        width={PIG_W}
        height={PIG_H}
        viewBox="0 0 508 508"
      >
        <Defs>
          {/* Clip path = the pig body ellipse from the original SVG */}
          <ClipPath id="pigBodyClip">
            <Ellipse cx="252.2" cy="301.5" rx="222.5" ry="171.4" />
          </ClipPath>
        </Defs>

        {/* ── ORIGINAL SVG PATHS (all 508x508 coords) ── */}

        {/* Dark teal decorative arc / snout area */}
        <Path style={{fill:'#40596B'}} d="M160.2,122.2C144.1,106,121.6,96,96.9,96v82.8c21.9-16.5,48.3-29.5,77.6-38
          C170.5,134,165.8,127.7,160.2,122.2z"/>

        {/* Red left arm/leg */}
        <Path style={{fill:'#F1543F'}} d="M41.9,245.1H21.2C9.5,245.1,0,254.6,0,266.3v70.5C0,348.4,9.4,358,21.2,358H42
          c-8-17.7-12.4-36.6-12.4-56.4C29.6,281.7,34,262.8,41.9,245.1z"/>
        {/* Red right arm/leg */}
        <Path style={{fill:'#F1543F'}} d="M486.8,274.3h-45.5v54.3h45.5c11.7,0,21.2-9.5,21.2-21.2v-12C508,283.8,498.5,274.3,486.8,274.3z"/>
        {/* Red left foot */}
        <Path style={{fill:'#F1543F'}} d="M124.3,465.7c0,23.4,18.9,42.3,42.3,42.3h1.4c22,0,40.1-16.7,42.1-38.2c-31.5-4.7-60.6-14.4-85.8-28
          V465.7z"/>
        {/* Red right foot */}
        <Path style={{fill:'#F1543F'}} d="M294.2,469.8c2,21.5,20.1,38.2,42.1,38.2h1.4c23.4,0,42.3-18.9,42.3-42.3v-23.9
          C354.9,455.4,325.8,465.1,294.2,469.8z"/>

        {/* Main pig body (salmon/coral ellipse) */}
        <Ellipse style={{fill:'#FF7058'}} cx="252.2" cy="301.5" rx="222.5" ry="171.4"/>

        {/* ── LIQUID FILL (clipped to body ellipse) ── */}
        <G clipPath="url(#pigBodyClip)">
          <Rect
            x={30} y={fillY}
            width={444} height={fillH}
            fill={fillColor} fillOpacity={0.82}
          />
          <Path d={wavePath} fill={waveColor} fillOpacity={0.65} />
        </G>

        {/* Dark teal eye */}
        <Circle style={{fill:'#40596B'}} cx="97.9" cy="253.7" r="17.1"/>

        {/* Dark teal curved mouth/smile arc */}
        <Path style={{fill:'#40596B'}} d="M170.9,203.8l-8-8c23.8-23.8,55.5-37,89.2-37s65.4,13.1,89.2,37l-8,8
          c-21.7-21.7-50.6-33.7-81.3-33.7C221.5,170.1,192.6,182.1,170.9,203.8z"/>

        {/* Gold coin circle outer */}
        <Circle style={{fill:'#FFD15C'}} cx="252.2" cy="77.2" r="77.2"/>
        {/* Gold coin circle inner */}
        <Circle style={{fill:'#F8B64C'}} cx="252.2" cy="77.2" r="58.8"/>
        {/* Dollar sign on coin */}
        <Path style={{fill:'#FFD15C'}} d="M242.5,101c-1.7-2.2-2.8-4.9-3.4-7.9l-15,1.6c1.1,7.5,3.8,13.4,7.9,17.5c4.1,4.1,9.5,6.6,16.1,7.4
          v7.5h8.3v-7.8c7.5-1.1,13.3-4,17.5-8.7s6.3-10.6,6.3-17.5c0-6.2-1.7-11.3-5-15.2c-3.3-4-9.6-7.2-18.8-9.7V45.7
          c3.7,1.6,6,4.7,6.9,9.2l14.5-1.9c-1-5.7-3.3-10.3-6.9-13.7s-8.4-5.5-14.5-6.2v-5.7h-8.3V33c-6.6,0.7-11.9,3.1-15.8,7.4
          c-4,4.3-5.9,9.5-5.9,15.8c0,6.2,1.8,11.5,5.3,15.8s9,7.6,16.5,9.7v24.1C246.1,104.8,244.2,103.2,242.5,101z M256.5,84.2
          c3.4,1,5.9,2.4,7.4,4.3s2.3,4.1,2.3,6.6c0,2.9-0.9,5.4-2.7,7.5c-1.8,2.1-4.1,3.5-7,4L256.5,84.2L256.5,84.2z M242.6,61.2
          c-1.2-1.7-1.8-3.6-1.8-5.7c0-2.2,0.7-4.2,2-6.1c1.3-1.8,3.1-3.1,5.4-3.9v19.9C245.7,64.3,243.8,62.9,242.6,61.2z"/>

        {/* Goal star overlay */}
        {isGoalReached && (
          <Path
            d="M252,230 L257,248 L276,248 L261,259 L267,277 L252,266 L237,277 L243,259 L228,248 L247,248 Z"
            fill="#FFD700" fillOpacity={0.95}
          />
        )}
      </Svg>
    </Animated.View>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function SavingsProgressBar({ percent, isGoalReached }) {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: percent,
      damping: 18,
      stiffness: 80,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barWidth = barAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={{
        width: barWidth,
        backgroundColor: isGoalReached ? PALETTE.goalComplete : PALETTE.fillWater,
        height: '100%',
        borderRadius: 12,
      }} />
      {[25, 50, 75].map((mark) => (
        <View key={mark} style={[styles.progressMark, { left: `${mark}%` }]} />
      ))}
    </View>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function PiggyBankTracker({
  currentAmount = 0,
  goalAmount    = 10000,
  currency      = 'RM',
  goalLabel     = 'Savings Goal',
  onAddSavings,
}) {
  const [coins,      setCoins]      = useState([]);
  const [sparkles,   setSparkles]   = useState([]);
  const [prevAmount, setPrevAmount] = useState(currentAmount);

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale   = useRef(new Animated.Value(0.92)).current;

  const rawPercent    = goalAmount > 0 ? (currentAmount / goalAmount) * 100 : 0;
  const percent       = Math.min(rawPercent, 100);
  const fillRatio     = percent / 100;
  const isGoalReached = percent >= 100;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(cardScale,   { toValue: 1, damping: 14, stiffness: 120, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (currentAmount > prevAmount) {
      const id   = Date.now();
      const xPos = 95 + Math.random() * 30;
      setCoins((c) => [...c, { id, x: xPos }]);
      if (isGoalReached) {
        const sp = Array.from({ length: 6 }, (_, i) => ({
          id: `${id}-${i}`,
          x: 20 + Math.random() * 180,
          y: 10 + Math.random() * 140,
          delay: i * 80,
        }));
        setSparkles(sp);
        setTimeout(() => setSparkles([]), 1500);
      }
    }
    setPrevAmount(currentAmount);
  }, [currentAmount]);

  const removeCoin = useCallback((id) => {
    setCoins((c) => c.filter((coin) => coin.id !== id));
  }, []);

  const amountColor = isGoalReached ? PALETTE.goalComplete : PALETTE.textDark;

  return (
    <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
      <View style={[styles.inner, { backgroundColor: isGoalReached ? '#E8F5E9' : '#FFF8ED' }]}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.goalLabel}>{goalLabel}</Text>
            {isGoalReached && <Text style={styles.goalReachedBadge}>🎉 Goal Reached!</Text>}
          </View>
          <View style={styles.percentBadge}>
            <Text style={[styles.percentText, {
              color: isGoalReached ? PALETTE.goalComplete : PALETTE.textMid,
            }]}>
              {percent.toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Pig */}
        <View style={styles.pigContainer}>
          {coins.map((coin) => (
            <CoinDrop key={coin.id} x={coin.x} onComplete={() => removeCoin(coin.id)} />
          ))}
          {sparkles.map((sp) => (
            <Sparkle key={sp.id} x={sp.x} y={sp.y} delay={sp.delay} />
          ))}
          <PiggyBankSVG fillPercent={fillRatio} isGoalReached={isGoalReached} />
          <View style={styles.pigShadow} />
        </View>

        {/* Amounts */}
        <View style={styles.amountRow}>
          <View>
            <Text style={styles.amountLabel}>Saved</Text>
            <Text style={[styles.amountValue, { color: amountColor }]}>
              {currency} {currentAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.amountLabel}>Goal</Text>
            <Text style={styles.goalValue}>
              {currency} {goalAmount.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <SavingsProgressBar percent={percent} isGoalReached={isGoalReached} />
        <View style={styles.progressLabels}>
          {['0%', '25%', '50%', '75%', '100%'].map((l) => (
            <Text key={l} style={styles.progressLabelText}>{l}</Text>
          ))}
        </View>

        {!isGoalReached && (
          <Text style={styles.remainingText}>
            {currency} {(goalAmount - currentAmount).toLocaleString('en-MY', { minimumFractionDigits: 2 })} remaining
          </Text>
        )}

        {onAddSavings && !isGoalReached && (
          <TouchableOpacity style={styles.ctaButton} onPress={onAddSavings} activeOpacity={0.8}>
            <Text style={styles.ctaText}>+ Add Savings</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_W - 32,
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: 'rgba(200,140,0,0.2)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 10,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#F5DFA0',
  },
  inner: {
    padding: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5C3C',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  goalReachedBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
    marginTop: 2,
  },
  percentBadge: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#F5DFA0',
  },
  percentText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  pigContainer: {
    alignItems: 'center',
    height: PIG_H + 10,
    justifyContent: 'flex-end',
    position: 'relative',
    marginBottom: 8,
  },
  pigShadow: {
    position: 'absolute',
    bottom: 0,
    width: 140,
    height: 14,
    borderRadius: 70,
    backgroundColor: 'rgba(180,100,80,0.15)',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  amountLabel: {
    fontSize: 11,
    color: '#BFA080',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  goalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7A5C3C',
    textAlign: 'right',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#F5DFA0',
    marginHorizontal: 12,
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(200,180,140,0.2)',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 4,
  },
  progressMark: {
    position: 'absolute',
    top: 0,
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  progressLabelText: {
    fontSize: 9,
    color: '#BFA080',
    fontWeight: '600',
  },
  remainingText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#7A5C3C',
    fontWeight: '500',
    marginBottom: 12,
  },
  ctaButton: {
    backgroundColor: '#F5C842',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    elevation: 6,
    marginTop: 4,
  },
  ctaText: {
    color: '#5A3A00',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});