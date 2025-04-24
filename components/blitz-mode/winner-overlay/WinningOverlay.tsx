import React, { useRef } from "react";
import { Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";
import * as Styled from "../BlitzMode.styled";
import { useGetIcons } from "@Services";
import { Score } from "../blitz-counter/BlitzCounter.styled";
import { ScoreRankings } from "../score-rankings";

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

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#192c43",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeAnim,
      }}
    >
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Styled.NextRoundButton onPress={handleNextRound}>
          <Styled.NextRoundButtonText>
            Play Next Round
          </Styled.NextRoundButtonText>
        </Styled.NextRoundButton>
      </LinearGradient>
      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        fadeOut
        fallSpeed={4000}
        explosionSpeed={400}
      />
      <LottieView
        source={ICONS[3]}
        autoPlay
        loop={false}
        style={{
          marginTop: 50,
          width: 250,
          height: 250,
        }}
      />
      <Styled.ScoreRankingsContainer>
        <ScoreRankings players={players} isRoundOver />
      </Styled.ScoreRankingsContainer>
    </Animated.View>
  );
};
