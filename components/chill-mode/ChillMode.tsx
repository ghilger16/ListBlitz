import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";

import * as Styled from "./ChillMode.styled";
import { NextPlayerPrompt } from "components/next-player-prompt";
import { useGetIcons } from "@Services";

interface ChillModeProps {
  currentPrompt: string;
  handleNextPlayer: () => void;
  currentPlayer: number;
}

export const ChillMode: React.FC<ChillModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  currentPlayer,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [score, setScore] = useState(0);

  const [isGameStarted, setIsGameStarted] = useState(true);
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

  const nextIconIndex = (currentPlayer + 1) % ICONS.length;

  return (
    <Styled.Wrapper>
      {/* <Text style={{ color: "#fff" }}>{currentPlayer}</Text> */}
      <PromptDisplay prompt={currentPrompt} />

      <Styled.CounterContainer>
        <ChillCounter
          onIncrement={handleScoreIncrement}
          onStart={() => setIsGameStarted(true)}
          score={score}
          currentPlayerIndex={currentPlayer}
        />
      </Styled.CounterContainer>

      {/* Show the "Next Player" bubble when score reaches 5 */}
      {showNextPlayerBubble && (
        <Styled.NextPlayerContainer>
          <NextPlayerPrompt
            onNextPlayerClick={handleNextPlayerClick}
            iconSource={ICONS[nextIconIndex]}
          />
        </Styled.NextPlayerContainer>
      )}
    </Styled.Wrapper>
  );
};
