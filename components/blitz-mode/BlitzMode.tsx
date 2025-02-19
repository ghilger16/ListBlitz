import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useGameplay } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import * as Styled from "./BlitzMode.styled";
import { BlitzCounter } from "./blitz-counter";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: () => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: number;
}

const TIMER_DURATION = 45;

export const BlitzMode: React.FC<BlitzModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
}) => {
  const { updatePlayerScore } = useGameplay();
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isGameStarted, timer]);

  const handleScoreIncrement = () => {
    if (!isGameStarted) {
      // Prevent score from going beyond 5
      setScore((prev) => prev + 1);
    }
  };

  return (
    <Styled.Wrapper>
      <Text>Current Player: {players[currentPlayer - 1]?.name}</Text>
      <PromptDisplay prompt={currentPrompt} />
      <Styled.CounterContainer>
        <BlitzCounter
          score={score}
          onIncrement={handleScoreIncrement}
          currentPlayerIndex={currentPlayer}
          onStart={() => setIsGameStarted(true)}
          timer={timer}
          isGameStarted={isGameStarted}
        />
      </Styled.CounterContainer>
    </Styled.Wrapper>
  );
};
