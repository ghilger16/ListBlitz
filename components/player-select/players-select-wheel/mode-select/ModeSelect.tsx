import React, { useMemo } from "react";
import { Animated, Text, View, TouchableWithoutFeedback } from "react-native";

import * as Haptics from "expo-haptics";

import { GameMode, MODE_COLORS } from "@Context";
import { useModeSelectAnimations, useResponsiveStyles } from "@Hooks";

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

  const styles = useResponsiveStyles(BASE_STYLES, (device) => ({
    container: {
      marginTop: device.isLargeTablet
        ? -495
        : device.isTablet
        ? -415
        : device.isSmallPhone
        ? -210
        : -260,
    },
    circle: {
      width: device.isLargeTablet
        ? 260
        : device.isTablet
        ? 210
        : device.isSmallPhone
        ? 105
        : 130,
      height: device.isLargeTablet
        ? 260
        : device.isTablet
        ? 210
        : device.isSmallPhone
        ? 105
        : 130,
      borderRadius: device.isLargeTablet
        ? 130
        : device.isTablet
        ? 105
        : device.isSmallPhone
        ? 52
        : 65,
    },
    iconEmoji: {
      fontSize: device.isLargeTablet
        ? 70
        : device.isTablet
        ? 60
        : device.isSmallPhone
        ? 35
        : 40,
    },
    modeLabel: {
      fontSize: device.isLargeTablet
        ? 50
        : device.isTablet
        ? 45
        : device.isSmallPhone
        ? 18
        : 26,
    },
    modeLabelBattle: {
      fontSize: device.isLargeTablet
        ? 35
        : device.isTablet
        ? 30
        : device.isSmallPhone
        ? 15
        : 22,
    },
    arrow: {
      fontSize: device.isLargeTablet
        ? 60
        : device.isTablet
        ? 50
        : device.isSmallPhone
        ? 25
        : 32,
    },
  }));

  const nextMode = useMemo(() => {
    return mode === GameMode.BATTLE
      ? GameMode.BLITZ
      : mode === GameMode.BLITZ
      ? GameMode.CHILL
      : GameMode.BATTLE;
  }, [mode]);

  const handlePress = () => {
    triggerScaleAnimation();
    Haptics.selectionAsync();
    onModeChange(nextMode);
  };

  const color = getModeColor(mode);

  const MODES: Record<GameMode, React.ReactNode> = {
    [GameMode.BATTLE]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji]}>{`⚔️`}</Text>
        <Text style={[styles.modeLabelBattle]}>Battle</Text>
      </View>
    ),
    [GameMode.BLITZ]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji]}>{`⚡`}</Text>
        <Text style={[styles.modeLabel]}>Blitz</Text>
      </View>
    ),
    [GameMode.CHILL]: (
      <View style={styles.iconContainer}>
        <Text style={[styles.iconEmoji]}>{`😎`}</Text>
        <Text style={[styles.modeLabel]}>Chill</Text>
      </View>
    ),
  };

  return (
    <View style={[styles.container]}>
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
              <Text style={[styles.arrow]}>‹</Text>
              {MODES[mode]}
              <Text style={[styles.arrow]}>›</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const BASE_STYLES = {
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
} as const;

export default ModeSelect;
