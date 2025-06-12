import React from "react";
import { Animated, View, StyleSheet, TouchableOpacity } from "react-native";

import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";

import { useGlowAnimation, usePulseAnimation } from "@Hooks";
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
      <TouchableOpacity style={styles.startButton} onPress={handleNextRound}>
        <Animated.Text
          style={[styles.startText, { textShadowColor: glowInterpolation }]}
        >
          Next Round
        </Animated.Text>
      </TouchableOpacity>
      <View style={styles.rankingsContainer}>
        <ScoreRankings players={players} isRoundOver />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
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
    flex: 1,
    justifyContent: "center",
    marginTop: 50,
    paddingHorizontal: 35,
    zIndex: 1,
  },
  winnerText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginTop: 100,
    fontFamily: "LuckiestGuy",
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  trophyIcon: {
    marginTop: -20,
    marginBottom: 50,
    width: 250,
    height: 250,
    alignSelf: "center",
  },
});
