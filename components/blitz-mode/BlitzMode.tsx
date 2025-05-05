import React, { useEffect, useState, useRef } from "react";
import { Text, Animated } from "react-native";

import { Player } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import * as Styled from "./BlitzMode.styled";
import { BlitzCounter } from "./blitz-counter";
import { ScoreRankings } from "./score-rankings";

import { WinnerOverlay } from "./winner-overlay/WinningOverlay";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: Player;
  handleNextRound: () => void;
}

const TIMER_DURATION = 5;

export const BlitzMode: React.FC<BlitzModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
  handleNextRound,
}) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false); // New state for countdown
  const [countdown, setCountdown] = useState(3); // Countdown timer
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading in the overlay

  useEffect(() => {
    if (isCountdownActive) {
      if (countdown > 0) {
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(countdownInterval);
      } else {
        setIsCountdownActive(false);
        setIsGameStarted(true); // Start the game after countdown
      }
    }
  }, [isCountdownActive, countdown]);

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
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isRoundOver]);

  const handleNextRoundClick = () => {
    handleNextRound();
    setCurrentPlayerIndex(0);
    setScore(0);
    setTimer(TIMER_DURATION);
    setIsGameStarted(false);
    setShowWinnerOverlay(false);
    fadeAnim.setValue(0);
    // (Optional) Shuffle players or prompt if needed here
  };

  const handleStartGame = () => {
    setCountdown(3); // Reset countdown
    setIsCountdownActive(true); // Start countdown
  };

  return showWinnerOverlay ? (
    <WinnerOverlay
      players={players}
      handleNextRound={handleNextRoundClick}
      fadeAnim={fadeAnim}
    />
  ) : (
    <Styled.Wrapper>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
        isObscured={!isGameStarted}
        countdown={isCountdownActive ? countdown : null}
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
      <Styled.CounterContainer>
        <BlitzCounter
          score={score}
          onIncrement={handleScoreIncrement}
          currentPlayer={currentPlayer}
          onStart={handleStartGame}
          timer={timer}
          isGameStarted={isGameStarted}
          isCountdownActive={isCountdownActive}
        />
        <ScoreRankings players={players} />
      </Styled.CounterContainer>
    </Styled.Wrapper>
  );
};
