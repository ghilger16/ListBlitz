import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import { useGameplay } from "@Context";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";

interface ChillModeProps {
  currentPrompt: string;
  handleNextPlayer: () => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: number;
}

export const ChillMode: React.FC<ChillModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
}) => {
  const { updatePlayerScore } = useGameplay();
  const [score, setScore] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
      setAnswersCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (answersCount >= 5) {
      handleNextPlayer();
    }
  }, [answersCount]);

  return (
    <View>
      <Text>Chill Mode</Text>
      <PromptDisplay prompt={currentPrompt} />
      <Text>Score: {score}</Text>
      <ChillCounter
        isGameStarted={isGameStarted}
        onIncrement={handleScoreIncrement}
        onStart={() => setIsGameStarted(true)}
        score={score}
        currentPlayerIndex={currentPlayer}
      />
      <Text>{isGameStarted ? "Give 5 Answers" : "Tap to Start"}</Text>
    </View>
  );
};
