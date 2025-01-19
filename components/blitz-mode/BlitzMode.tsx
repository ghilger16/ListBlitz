import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useGameplay } from "@Context";
import { PromptDisplay } from "components/prompt-display";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: () => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: number;
}

const TIMER_DURATION = 10;

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

  return (
    <View>
      <Text>Current Player: {players[currentPlayer - 1]?.name}</Text>
      <PromptDisplay prompt={currentPrompt} />
      <Text>Time Remaining: {timer}s</Text>
      <Text>Score: {score}</Text>
      <TouchableOpacity onPress={() => setScore((prev) => prev + 1)}>
        <Text>Tap for Correct Answer</Text>
      </TouchableOpacity>
      {timer === 0 && (
        <TouchableOpacity onPress={handleNextPlayer}>
          <Text>
            {currentPlayer < players.length
              ? `➡️ Player ${currentPlayer + 1}`
              : "➡️ Results"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
