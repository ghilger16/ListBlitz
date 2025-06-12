import React, { useMemo } from "react";
import {
  Animated,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

import * as Haptics from "expo-haptics";

import { GameMode, MODE_COLORS } from "@Context";
import { useModeSelectAnimations } from "@Hooks";

interface ModeSelectProps {
  onModeChange: (newMode: GameMode) => void;
  mode: GameMode;
}

const getModeColor = (mode: GameMode) => {
  switch (mode) {
    case GameMode.CHILL:
      return MODE_COLORS.CHILL;
    case GameMode.BLITZ:
      return MODE_COLORS.BLITZ;
    case GameMode.BATTLE:
      return MODE_COLORS.BATTLE;
  }
};
const ModeSelect: React.FC<ModeSelectProps> = ({ onModeChange, mode }) => {
  const { scaleAnim, triggerScaleAnimation } = useModeSelectAnimations();

  const nextMode = useMemo(() => {
    return mode === GameMode.CHILL
      ? GameMode.BLITZ
      : mode === GameMode.BLITZ
      ? GameMode.BATTLE
      : GameMode.CHILL;
  }, [mode]);

  const handlePress = () => {
    triggerScaleAnimation();
    Haptics.selectionAsync();
    onModeChange(nextMode);
  };

  const color = getModeColor(mode);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handlePress}
        accessible
        accessibilityLabel={`Switch to ${nextMode} mode`}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View
            style={[
              styles.circle,
              {
                borderColor: color,
                backgroundColor: color,
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
  modeLabelBase: {
    fontWeight: "bold",
    color: "white",
    fontFamily: "Avenir-Heavy",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
  modeLabelBattle: {
    fontSize: 22,
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
  iconContainer: {
    alignItems: "center",
  },
});

const MODES: Record<GameMode, React.ReactNode> = {
  [GameMode.CHILL]: (
    <View style={styles.iconContainer}>
      <Text style={styles.iconEmoji}>😎</Text>
      <Text style={styles.modeLabel}>Chill</Text>
    </View>
  ),
  [GameMode.BLITZ]: (
    <View style={styles.iconContainer}>
      <Text style={styles.iconEmoji}>⚡</Text>
      <Text style={styles.modeLabel}>Blitz</Text>
    </View>
  ),
  [GameMode.BATTLE]: (
    <View style={styles.iconContainer}>
      <Text style={styles.iconEmoji}>⚔️</Text>
      <Text style={styles.modeLabelBattle}>Battle</Text>
    </View>
  ),
};
