import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";

import * as Styled from "./ChillMode.styled";
import { NextPlayerPrompt } from "components/next-player-prompt";
import { useGetIcons } from "@Services";
import { Player } from "@Context";

interface ChillModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  currentPlayer: Player;
  players: Player[];
}

export const ChillMode: React.FC<ChillModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  currentPlayer,
  players,
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
    handleNextPlayer(score);
    setShowNextPlayerBubble(false); // Hide the bubble after clicking
    setScore(0); // Reset the score when moving to the next player
  };

  const nextIconIndex = (currentPlayer.id + 1) % ICONS.length;
  const currentIndex = players.findIndex((p) => p.id === currentPlayer.id);
  const nextIndex = (currentIndex + 1) % players.length;
  return (
    <Styled.Wrapper>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
      />
      <Text
        style={{
          color: "#fff",
          fontFamily: "SourGummy",
          fontSize: 24,
          textAlign: "center",
          marginTop: 15,
        }}
      >
        Player {currentPlayer.id}
      </Text>

      <Styled.CounterContainer>
        <ChillCounter
          onIncrement={handleScoreIncrement}
          onStart={() => setIsGameStarted(true)}
          score={score}
          currentPlayer={currentPlayer}
        />
      </Styled.CounterContainer>

      {/* Show the "Next Player" bubble when score reaches 5 */}
      {showNextPlayerBubble && (
        <Styled.NextPlayerContainer>
          <NextPlayerPrompt
            onNextPlayerClick={handleNextPlayerClick}
            iconSource={ICONS[nextIconIndex]}
            nextPlayer={players[nextIndex]}
          />
        </Styled.NextPlayerContainer>
      )}
    </Styled.Wrapper>
  );
};
