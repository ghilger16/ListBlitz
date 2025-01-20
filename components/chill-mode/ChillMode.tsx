import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { useGameplay } from "@Context";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";

import * as Styled from "./ChillMode.styled";

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
  const { gameSettings } = useGameplay();
  const [score, setScore] = useState(0);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showNextPlayerBubble, setShowNextPlayerBubble] = useState(false);

  const handleScoreIncrement = () => {
    if (isGameStarted && score < 5) {
      // Prevent score from going beyond 5
      setScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (score >= 5) {
      setShowNextPlayerBubble(true); // Show the bubble when score reaches 5
    }
  }, [score]);

  const handleNextPlayerClick = () => {
    handleNextPlayer();
    setShowNextPlayerBubble(false); // Hide the bubble after clicking
    setScore(0); // Reset the score when moving to the next player
  };

  return (
    <Styled.Wrapper>
      <Text style={{ color: "#FFF", fontSize: 30 }}>
        {score}
        {gameSettings.playerCount}
        {gameSettings.mode}
        {gameSettings.blitzPackId}
        {gameSettings.blitzPackTitle}
      </Text>
      <PromptDisplay prompt={currentPrompt} />
      <Styled.CounterWrapper>
        <ChillCounter
          isGameStarted={isGameStarted}
          onIncrement={handleScoreIncrement}
          onStart={() => setIsGameStarted(true)}
          score={score}
          currentPlayerIndex={currentPlayer}
        />
      </Styled.CounterWrapper>

      {/* Show the "Next Player" bubble when score reaches 5 */}
      {showNextPlayerBubble && (
        <TouchableOpacity onPress={handleNextPlayerClick}>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 10,
              borderRadius: 20,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#FFF", fontSize: 20 }}>
              Start Player {currentPlayer}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </Styled.Wrapper>
  );
};
