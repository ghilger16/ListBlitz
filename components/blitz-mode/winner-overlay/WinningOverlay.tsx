import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";
import { ScoreRankings } from "../score-rankings";
import { useGetIcons } from "@Services";

interface WinnerOverlayProps {
  players: { id: number; name: string; score: number }[];
  handleNextRound: () => void;
  fadeAnim: Animated.Value;
}

export const WinnerOverlay: React.FC<WinnerOverlayProps> = ({
  players,
  handleNextRound,
  fadeAnim,
}) => {
  const { data: ICONS = [] } = useGetIcons();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.gradient}>
        <TouchableOpacity style={styles.button} onPress={handleNextRound}>
          <Text style={styles.buttonText}>Play Next Round</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        fadeOut
        fallSpeed={4000}
        explosionSpeed={400}
      />
      <Animated.Text
        style={[styles.winnerText, { transform: [{ scale: pulseAnim }] }]}
      >
        Winner!
      </Animated.Text>
      <LottieView
        source={ICONS[3]}
        autoPlay
        loop={false}
        style={{
          marginTop: -20,
          marginBottom: 50,
          width: 250,
          height: 250,
          alignSelf: "center",
        }}
      />
      <View style={styles.rankingsContainer}>
        <ScoreRankings players={players} isRoundOver />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -100,
    left: 0,
    right: 0,
    bottom: -40,
    backgroundColor: "#192c43",
    justifyContent: "center",
    alignItems: "stretch",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    zIndex: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  rankingsContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 85,
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
});
