import React from "react";
import { Animated, View, StyleSheet, TouchableOpacity } from "react-native";

import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";

import {
  useGlowAnimation,
  usePulseAnimation,
  useResponsiveStyles,
} from "@Hooks";
import { useGetTrophyIcon } from "@Context";
import { ScoreRankings } from "../score-rankings";
import { Player } from "@Context";

interface WinnerOverlayProps {
  players: Player[];
  handleNextRound: () => void;
  fadeAnim: Animated.Value;
}

export const WinnerOverlay: React.FC<WinnerOverlayProps> = ({
  players,
  handleNextRound,
  fadeAnim,
}) => {
  const { data: trophyIcon } = useGetTrophyIcon();

  const pulseAnim = usePulseAnimation();
  const glowAnim = useGlowAnimation();

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 1)"],
  });

  const styles = useResponsiveStyles(
    BASE_STYLES,
    ({ isSmallPhone, isLargePhone, isTablet, isLargeTablet }) => {
      const fs = (base: number) => {
        if (isLargeTablet) return base * 1.5;
        if (isTablet) return base * 1.25;
        if (isLargePhone) return base * 1.1;
        if (isSmallPhone) return base * 0.9;
        return base;
      };

      const trophySize = isLargeTablet
        ? 500
        : isTablet
        ? 400
        : isLargePhone
        ? 300
        : isSmallPhone
        ? 200
        : 275;

      const winnerTop = isLargeTablet
        ? 80
        : isTablet
        ? 150
        : isLargePhone
        ? 140
        : isSmallPhone
        ? 100
        : 130;

      const trophyMarginTop = isLargeTablet ? -10 : isTablet ? -15 : -20;
      const trophyMarginBottom = isLargeTablet
        ? 60
        : isTablet
        ? 50
        : isLargePhone
        ? 40
        : 30;

      const btnPadV = isLargeTablet
        ? 22
        : isTablet
        ? 18
        : isLargePhone
        ? 16
        : isSmallPhone
        ? 12
        : 15;

      const btnPadH = isLargeTablet
        ? 56
        : isTablet
        ? 48
        : isLargePhone
        ? 44
        : isSmallPhone
        ? 36
        : 40;

      const btnRadius = isLargeTablet || isTablet ? 60 : 50;

      const rankingsTop = isLargeTablet
        ? 40
        : isTablet
        ? 20
        : isLargePhone
        ? 60
        : isSmallPhone
        ? 70
        : 45;

      return {
        winnerText: { fontSize: fs(48), marginTop: winnerTop },
        trophyIcon: {
          width: trophySize,
          height: trophySize,
          marginTop: trophyMarginTop,
          marginBottom: trophyMarginBottom,
        },
        startText: { fontSize: fs(28) },
        startButton: {
          paddingVertical: btnPadV,
          paddingHorizontal: btnPadH,
          borderRadius: btnRadius,
        },
        rankingsContainer: {
          marginTop: rankingsTop,
        },
      };
    }
  );

  return (
    <Animated.View style={[styles.container]}>
      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        fadeOut
        fallSpeed={5000}
        explosionSpeed={500}
      />
      <Animated.Text
        style={[styles.winnerText, { transform: [{ scale: pulseAnim }] }]}
      >
        Winner!
      </Animated.Text>
      <LottieView
        source={trophyIcon}
        autoPlay
        loop={false}
        style={styles.trophyIcon}
      />
      <View style={styles.rankingsContainer}>
        <ScoreRankings players={players} isRoundOver />
      </View>
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={1}
        onPress={handleNextRound}
      >
        <Animated.Text
          style={[styles.startText, { textShadowColor: glowInterpolation }]}
        >
          Next Round
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const BASE_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  startButton: {
    backgroundColor: "#FF6600",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 8,
    shadowColor: "rgba(255, 165, 0, 0.5)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: "#FFCC00",
    marginBottom: 15,
  },
  startText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    fontFamily: "SourGummy",
  },
  rankingsContainer: {
    marginBottom: 80, // increased space to separate rankings from bottom button
    alignItems: "center",
    width: "100%",
  },
  winnerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",

    fontFamily: "LuckiestGuy",
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  trophyIcon: {
    marginTop: -20,
    marginBottom: 50,
    width: 210,
    height: 210,
    alignSelf: "center",
  },
});
