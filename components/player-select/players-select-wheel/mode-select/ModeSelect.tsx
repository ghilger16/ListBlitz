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
import { useScreenInfo } from "@Utils";

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
  const { isTablet, isSmallPhone } = useScreenInfo();

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
  const circleSize = isTablet ? 210 : isSmallPhone ? 105 : 130;

  const iconFontSize = isTablet ? 60 : isSmallPhone ? 35 : 40;
  const modeFontSize = isTablet ? 45 : isSmallPhone ? 18 : 26;
  const battleFontSize = isTablet ? 30 : isSmallPhone ? 15 : 22;
  const arrowFontSize = isTablet ? 50 : isSmallPhone ? 25 : 32;

  const MODES: Record<GameMode, React.ReactNode> = {
    [GameMode.CHILL]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji, { fontSize: iconFontSize }]}>😎</Text>
        <Text style={[styles.modeLabel, { fontSize: modeFontSize }]}>
          Chill
        </Text>
      </View>
    ),
    [GameMode.BLITZ]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji, { fontSize: iconFontSize }]}>⚡</Text>
        <Text style={[styles.modeLabel, { fontSize: modeFontSize }]}>
          Blitz
        </Text>
      </View>
    ),
    [GameMode.BATTLE]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji, { fontSize: iconFontSize }]}>⚔️</Text>
        <Text style={[styles.modeLabelBattle, { fontSize: battleFontSize }]}>
          Battle
        </Text>
      </View>
    ),
  };

  return (
    <View
      style={[
        styles.container,
        { marginTop: isTablet ? -415 : isSmallPhone ? -210 : -260 },
      ]}
    >
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
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
              },
            ]}
          >
            <View style={styles.arrowRow}>
              <Text style={[styles.arrow, { fontSize: arrowFontSize }]}>‹</Text>
              {MODES[mode]}
              <Text style={[styles.arrow, { fontSize: arrowFontSize }]}>›</Text>
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
    marginTop: -350,
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
