import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/prompt-display";
import { NextPlayerPrompt } from "components/next-player-prompt";
import { useGetIcons } from "@Services";
import { Player } from "@Context";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";

interface ChillModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  currentPlayer: Player;
  players: Player[];
  packTitle: string;
}

export const ChillMode: React.FC<ChillModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  currentPlayer,
  players,
  packTitle,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [showNextPlayerBubble, setShowNextPlayerBubble] = useState(false);

  const titleImage = blitzPackIcons[packTitle]?.titleImage;

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
    console.log("Next player clicked, score:", score);

    handleNextPlayer(score);
    setShowNextPlayerBubble(false);
    setScore(0);
  };

  const currentIndex = players.findIndex((p) => p.id === currentPlayer.id);
  const nextIndex = (currentIndex + 1) % players.length;
  const nextIconIndex = (players[nextIndex]?.id ?? 1) - 1;

  return (
    <ImageBackground
      source={require("assets/images/chill-bg.png")}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.promptWrapper}>
          <PromptDisplay
            prompt={currentPrompt}
            playerColor={currentPlayer.startColor}
            categoryBubble={titleImage}
            isAlphaBlitz={packTitle === "Alpha Blitz"}
          />
        </View>
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
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 15,
  },
  promptWrapper: {
    marginTop: 15,
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
    top: 100,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  nextPlayerContainer: {
    position: "absolute",
    top: 650,
    left: 50,
  },
});
