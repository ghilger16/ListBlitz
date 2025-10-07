import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import { ChillCounter } from "./chill-counter";
import { PromptDisplay } from "components/gameplay/prompt-display";
import { NextPlayerPrompt } from "components/gameplay/blitz-mode/next-player-prompt";
import { GameMode, ModeComponentProps, playerIcons } from "@Context";

import { Asset } from "expo-asset";
import {
  useAlphaCategory,
  AlphaCategoryWrapper,
} from "../alpha-category-select";
import { blitzPackIcons } from "@Utils";
import { SkipButton } from "../prompt-display/SkipButton";
import { useResponsiveStyles } from "@Hooks";

const BASE_STYLES = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 15 },
  promptWrapper: { marginTop: 15 },
  playerText: {
    color: "#fff",
    fontFamily: "SourGummy",
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 25,
  },
  counterContainer: { justifyContent: "center", marginTop: 75 },
  nextPlayerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  skipButtonContainer: {
    position: "absolute",
    bottom: 40,
    right: 25,
    zIndex: 10,
  },
});

const handleScoreIncrement = (
  isGameStarted: boolean,
  score: number,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
  if (isGameStarted && score < 5) {
    setScore((prev) => prev + 1);
  }
};

const handleScoreDecrement = (
  isGameStarted: boolean,
  score: number,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
  if (isGameStarted && score > 0) {
    setScore((prev) => prev - 1);
  }
};

const handleNextPlayerClick = (
  handleNextPlayer: (score: number) => void,
  setShowNextPlayerBubble: React.Dispatch<React.SetStateAction<boolean>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  isShuffleActive: boolean,
  handlePickRandom: () => void
) => {
  handleNextPlayer(5);
  setShowNextPlayerBubble(false);
  setScore(0);
  if (isShuffleActive) {
    handlePickRandom();
  }
};

export const ChillMode: React.FC<ModeComponentProps> = ({
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
  const [bgUri, setBgUri] = useState<string | null>(null);
  const [skipTrigger, setSkipTrigger] = useState(0);

  const {
    selectedCategory,
    isShuffleActive,
    handleSelectCategory,
    handlePickRandom,
  } = useAlphaCategory();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.4);
      if (device.isTablet) return Math.round(base * 1.22);
      if (device.isLargePhone) return Math.round(base * 1.08);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    const promptTop = device.isLargeTablet
      ? 90
      : device.isTablet
      ? 75
      : device.isSmallPhone
      ? 12
      : 15;
    const counterTop = device.isLargeTablet
      ? 100
      : device.isTablet
      ? 80
      : device.isSmallPhone
      ? 50
      : 75;
    const nextPlayerTop = device.isLargeTablet
      ? 850
      : device.isTablet
      ? 750
      : device.isSmallPhone
      ? 325
      : 450;

    const skipBottom = device.isLargeTablet
      ? 60
      : device.isTablet
      ? 50
      : device.isSmallPhone
      ? 24
      : 40;
    const skipRight = device.isLargeTablet
      ? 40
      : device.isTablet
      ? 32
      : device.isSmallPhone
      ? 16
      : 25;

    return {
      promptWrapper: { marginTop: promptTop },
      playerText: { fontSize: fs(25) },
      counterContainer: { marginTop: counterTop },
      nextPlayerWrap: { top: nextPlayerTop },
      skipButtonContainer: { bottom: skipBottom, right: skipRight },
    } as const;
  });

  const safeCurrentPlayer = currentPlayer!;

  useEffect(() => {
    const asset = Asset.fromModule(require("assets/images/chill-bg.png"));
    setBgUri(asset.localUri || asset.uri);
  }, []);

  useEffect(() => {
    if (score >= 5) {
      setShowNextPlayerBubble(true);
    } else setShowNextPlayerBubble(false);
  }, [score]);

  const nextIndex = useMemo(() => {
    const idx = players.findIndex((p) => p.id === currentPlayer?.id);
    return (idx + 1) % players.length;
  }, [players, currentPlayer]);

  if (!bgUri) return null;

  if (packTitle === "Alpha Blitz" && !selectedCategory) {
    return (
      <AlphaCategoryWrapper
        bgUri={bgUri}
        onSelectCategory={handleSelectCategory}
        onPickRandom={handlePickRandom}
      />
    );
  }

  return (
    <ImageBackground
      source={{ uri: bgUri }}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={[styles.wrapper]}>
        <View style={styles.promptWrapper}>
          <PromptDisplay
            key={`${safeCurrentPlayer.id}-${selectedCategory}`}
            prompt={currentPrompt}
            playerColor={safeCurrentPlayer.startColor!}
            mode={GameMode.CHILL}
            categoryBubble={blitzPackIcons[packTitle]?.titleImage}
            isAlphaBlitz={packTitle === "Alpha Blitz"}
            selectedCategory={selectedCategory}
            handleSkipPrompt={handleSkipPrompt ?? (() => {})}
            skipSignal={skipTrigger}
          />
        </View>
        <Text style={styles.playerText}>Player {safeCurrentPlayer.id}</Text>
        <View style={styles.counterContainer}>
          <ChillCounter
            onIncrement={() =>
              handleScoreIncrement(isGameStarted, score, setScore)
            }
            onDecrement={() =>
              handleScoreDecrement(isGameStarted, score, setScore)
            }
            onStart={() => setIsGameStarted(true)}
            score={score}
            currentPlayer={safeCurrentPlayer}
          />
        </View>
        {showNextPlayerBubble && (
          <View style={styles.nextPlayerWrap}>
            <NextPlayerPrompt
              onNextPlayerClick={() =>
                handleNextPlayerClick(
                  handleNextPlayer,
                  setShowNextPlayerBubble,
                  setScore,
                  isShuffleActive,
                  handlePickRandom
                )
              }
              iconSource={playerIcons[players[nextIndex].iconIndex]}
              nextPlayer={players[nextIndex]}
            />
          </View>
        )}
        <View style={styles.skipButtonContainer}>
          <SkipButton
            playerColor={safeCurrentPlayer.startColor!}
            onPress={() => setSkipTrigger((prev) => prev + 1)}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
