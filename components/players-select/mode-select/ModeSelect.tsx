import React, { useEffect, useRef } from "react";
import { GameMode } from "@Context";
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

interface ModeSelectProps {
  onModeChange: (newMode: GameMode) => void;
  mode: GameMode;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ onModeChange, mode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const nextMode =
      mode === GameMode.CHILL
        ? GameMode.BLITZ
        : mode === GameMode.BLITZ
        ? GameMode.BATTLE
        : GameMode.CHILL;

    onModeChange(nextMode);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View
            style={[
              styles.circle,
              {
                borderColor:
                  mode === GameMode.CHILL
                    ? "#FFD700"
                    : mode === GameMode.BLITZ
                    ? "#87CEFA"
                    : "#FF4C4C",
                backgroundColor:
                  mode === GameMode.CHILL
                    ? "#FFD700"
                    : mode === GameMode.BLITZ
                    ? "#87CEFA"
                    : "#FF4C4C",
              },
            ]}
          >
            <View style={styles.arrowRow}>
              <Text style={styles.arrow}>‹</Text>
              {MODES[mode]}
              <Text style={styles.arrow}>›</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ModeSelect;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -262,
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#fff",
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  modeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Avenir-Heavy",
    textAlign: "center",
    lineHeight: 30,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  iconEmoji: {
    fontSize: 40,
    marginBottom: 2,
  },
  modeLabel: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    fontFamily: "Avenir-Heavy",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 1,
  },
});

const MODES: Record<GameMode, React.ReactNode> = {
  [GameMode.CHILL]: (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.iconEmoji}>😎</Text>
      <Text style={styles.modeLabel}>Chill</Text>
    </View>
  ),
  [GameMode.BLITZ]: (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.iconEmoji}>⚡</Text>
      <Text style={styles.modeLabel}>Blitz</Text>
    </View>
  ),
  [GameMode.BATTLE]: (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.iconEmoji}>⚔️</Text>
      <Text style={[styles.modeLabel, { fontSize: 22 }]}>Battle</Text>
    </View>
  ),
};
