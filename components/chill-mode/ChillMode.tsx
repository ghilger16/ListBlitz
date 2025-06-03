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
import { playerIcons } from "@Services";
import { GameMode, Player } from "@Context";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";
import { Asset } from "expo-asset";
import { AlphaCategorySelect } from "components/alpha-category-select";

interface ChillModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  handleSkipPrompt: () => void;
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
  handleSkipPrompt,
}) => {
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [showNextPlayerBubble, setShowNextPlayerBubble] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isShuffleActive, setIsShuffleActive] = useState(false);

  const handleSelectCategory = (category: string) => {
    setIsShuffleActive(false);
    setSelectedCategory(category);
  };

  const handlePickRandom = () => {
    const categories = [
      "Animals",
      "Foods",
      "Occupations",
      "Countries",
      "Movies",
      "Famous People",
    ];
    const random = categories[Math.floor(Math.random() * categories.length)];
    setIsShuffleActive(true);
    setSelectedCategory(random);
  };

  const titleImage = blitzPackIcons[packTitle]?.titleImage;

  const [bgUri, setBgUri] = useState<string | null>(null);

  useEffect(() => {
    const asset = Asset.fromModule(require("assets/images/chill-bg.png"));
    setBgUri(asset.localUri || asset.uri);
  }, []);

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
    if (isShuffleActive) {
      handlePickRandom();
    }
  };
  const [skipTrigger, setSkipTrigger] = useState(0);

  const wrappedHandleSkipPrompt = () => {
    // 1) Run original skip logic
    handleSkipPrompt();
    // 2) Increment skipTrigger so PromptDisplay remounts
    setSkipTrigger((prev) => prev + 1);
  };

  const currentIndex = players.findIndex((p) => p.id === currentPlayer.id);
  const nextIndex = (currentIndex + 1) % players.length;

  if (packTitle === "Alpha Blitz" && !selectedCategory) {
    return (
      <>
        {bgUri && (
          <ImageBackground
            source={{ uri: bgUri }}
            resizeMode="cover"
            style={StyleSheet.absoluteFill}
          >
            <SafeAreaView style={styles.wrapper}>
              <AlphaCategorySelect
                onSelectCategory={handleSelectCategory}
                onPickRandom={handlePickRandom}
              />
            </SafeAreaView>
          </ImageBackground>
        )}
      </>
    );
  }

  return (
    <>
      {bgUri && (
        <ImageBackground
          source={{ uri: bgUri }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        >
          <SafeAreaView style={styles.wrapper}>
            <View style={styles.promptWrapper}>
              <PromptDisplay
                key={`${currentPlayer.id}-${selectedCategory}-${skipTrigger}`}
                prompt={currentPrompt}
                playerColor={currentPlayer.startColor}
                mode={GameMode.CHILL}
                categoryBubble={titleImage}
                isAlphaBlitz={packTitle === "Alpha Blitz"}
                selectedCategory={selectedCategory}
                handleSkipPrompt={wrappedHandleSkipPrompt}
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
                  iconSource={playerIcons[players[nextIndex].iconIndex]}
                  nextPlayer={players[nextIndex]}
                />
              </View>
            )}
          </SafeAreaView>
        </ImageBackground>
      )}
    </>
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
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
