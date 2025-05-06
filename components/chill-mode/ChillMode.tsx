import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";
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
      setScore((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (score >= 5) {
      setShowNextPlayerBubble(true);
    }
  }, [score]);

  const handleNextPlayerClick = () => {
    handleNextPlayer(score);
    setShowNextPlayerBubble(false);
    setScore(0);
  };

  const nextIconIndex = (currentPlayer.id + 1) % ICONS.length;
  const currentIndex = players.findIndex((p) => p.id === currentPlayer.id);
  const nextIndex = (currentIndex + 1) % players.length;

  return (
    <View style={styles.wrapper}>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
      />
      <Text style={styles.playerText}>Player {currentPlayer.id}</Text>
      <View style={styles.counterContainer}>
        <ChillCounter
          onIncrement={handleScoreIncrement}
          onStart={() => setIsGameStarted(true)}
          score={score}
          currentPlayer={currentPlayer}
        />
      </View>

      {showNextPlayerBubble && (
        <View style={styles.nextPlayerContainer}>
          <NextPlayerPrompt
            onNextPlayerClick={handleNextPlayerClick}
            iconSource={ICONS[nextIconIndex]}
            nextPlayer={players[nextIndex]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#192c43",
    flex: 1,
    paddingTop: 15,
  },
  playerText: {
    color: "#fff",
    fontFamily: "SourGummy",
    fontSize: 24,
    textAlign: "center",
    marginTop: 15,
  },
  counterContainer: {
    position: "absolute",
    top: 220,
    left: 0,
    right: 0,
  },
  nextPlayerContainer: {
    position: "absolute",
    top: 500,
    left: 15,
  },
});
