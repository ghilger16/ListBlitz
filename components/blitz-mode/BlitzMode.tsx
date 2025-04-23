import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";

import { Player, useGameplay } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import * as Styled from "./BlitzMode.styled";
import { BlitzCounter } from "./blitz-counter";
import { ScoreRankings } from "./score-rankings";
import { LinearGradient } from "expo-linear-gradient";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";
import { useGetIcons } from "@Services";
import { G } from "react-native-svg";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: Player;
}

const TIMER_DURATION = 5;

export const BlitzMode: React.FC<BlitzModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const lottieRef = useRef<LottieView>(null);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading in the overlay

  useEffect(() => {
    if (isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleNextPlayer(score);
      setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
      resetGameState();
    }
  }, [isGameStarted, timer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  const resetGameState = () => {
    setIsGameStarted(false);
    setScore(0);
    setTimer(TIMER_DURATION);
  };

  const isRoundOver = currentPlayerIndex === players.length;

  useEffect(() => {
    if (isRoundOver) {
      setShowWinnerOverlay(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isRoundOver]);

  const handleNextRound = () => {
    // Reset the whole state for a new round
    setCurrentPlayerIndex(0);
    setScore(0);
    setTimer(TIMER_DURATION);
    setIsGameStarted(false);
    setShowWinnerOverlay(false);
    fadeAnim.setValue(0);
    // (Optional) Shuffle players or prompt if needed here
  };

  return showWinnerOverlay ? (
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
        colors={["#6a11cb", "#2575fc"]} // Purple to blue
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
        {/* <Styled.WinnerCard>
          <Styled.WinnerText>🏆 Winner: {players[0]?.name}!</Styled.WinnerText>
          <Styled.WinnerScore>Score: {players[0]?.score}</Styled.WinnerScore>

          <Styled.NextRoundButton onPress={handleNextRound}>
            <Styled.NextRoundButtonText>
              Play Next Round
            </Styled.NextRoundButtonText>
          </Styled.NextRoundButton>
        </Styled.WinnerCard> */}
      </LinearGradient>
      <ConfettiCannon
        count={100}
        origin={{ x: -10, y: 0 }}
        fadeOut
        fallSpeed={3000}
        explosionSpeed={400}
      />
      <G>
        <LottieView ref={lottieRef} source={ICONS[3]} autoPlay style={{width={75}}} />
      </G>

      <Styled.ScoreRankingsContainer>
        <ScoreRankings players={players} isRoundOver />
      </Styled.ScoreRankingsContainer>
    </Animated.View>
  ) : (
    <Styled.Wrapper>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
      />

      <Text
        style={{
          color: "#fff",
          fontFamily: "LuckiestGuy",
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          marginTop: 15,
        }}
      >
        Player {currentPlayer.id}
      </Text>

      <Text
        style={{
          color: "#ff0",
          fontSize: 16,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Current Player Index: {currentPlayerIndex}
      </Text>

      <Styled.CounterContainer>
        <BlitzCounter
          score={score}
          onIncrement={handleScoreIncrement}
          currentPlayer={currentPlayer}
          onStart={() => setIsGameStarted(true)}
          timer={timer}
          isGameStarted={isGameStarted}
        />
        <ScoreRankings players={players} />
      </Styled.CounterContainer>
    </Styled.Wrapper>
  );
};
