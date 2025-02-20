import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useGameplay } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import * as Styled from "./BlitzMode.styled";
import { BlitzCounter } from "./blitz-counter";
import { ScoreRankings } from "./score-rankings";

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
    } else if (timer === 0) {
      handleNextPlayer(); // Automatically go to the next player when time is up
    }
  }, [isGameStarted, timer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextPlayerClick = () => {
    setScore(0);
    setTimer(TIMER_DURATION);
    setIsGameStarted(false);
  };

  return (
    <Styled.Wrapper>
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
        <ScoreRankings players={players} />
      </Styled.CounterContainer>

      {/* Manual Next Player Button */}
      <TouchableOpacity onPress={handleNextPlayerClick}>
        <Text style={{ color: "white", fontSize: 18 }}>Next Player</Text>
      </TouchableOpacity>
    </Styled.Wrapper>
  );
};
