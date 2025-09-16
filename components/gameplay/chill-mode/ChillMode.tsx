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
import { blitzPackIcons, useScreenInfo } from "@Utils";

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

const wrappedHandleSkipPrompt = (
  handleSkipPrompt: () => void,
  setSkipTrigger: React.Dispatch<React.SetStateAction<number>>
) => {
  handleSkipPrompt?.();
  setSkipTrigger((prev) => prev + 1);
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

  const { isTablet, isSmallPhone } = useScreenInfo();

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
        <View
          style={[
            styles.promptWrapper,
            {
              marginTop: isTablet ? 75 : 15,
            },
          ]}
        >
          <PromptDisplay
            key={`${safeCurrentPlayer.id}-${selectedCategory}`}
            prompt={currentPrompt}
            playerColor={safeCurrentPlayer.startColor!}
            mode={GameMode.CHILL}
            categoryBubble={blitzPackIcons[packTitle]?.titleImage}
            isAlphaBlitz={packTitle === "Alpha Blitz"}
            selectedCategory={selectedCategory}
            handleSkipPrompt={() =>
              wrappedHandleSkipPrompt(
                handleSkipPrompt ?? (() => {}),
                setSkipTrigger
              )
            }
          />
        </View>
        <Text
          style={[
            styles.playerText,
            { fontSize: isTablet ? 40 : isSmallPhone ? 20 : 25 },
          ]}
        >
          Player {safeCurrentPlayer.id}
        </Text>
        <View
          style={[
            styles.counterContainer,
            { marginTop: isTablet ? 80 : isSmallPhone ? 50 : 75 },
          ]}
        >
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
          <View
            style={{
              marginTop: isTablet ? 525 : isSmallPhone ? 275 : 375,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
    textAlign: "center",
    marginTop: 15,
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  counterContainer: {
    justifyContent: "center",
  },
});
