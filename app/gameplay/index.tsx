import React, { useState, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ChillMode, BlitzMode, BattleMode, SplashScreen } from "@Components";
import { GameMode, Player, useGameplay } from "@Context";
import { useGameplayHeader, useGetPromptsByBlitzPack } from "@Hooks";
import { loadBackground, nextPrompt, isReady } from "./gameplayHelpers";

const Gameplay: React.FC = () => {
  const {
    players,
    currentPlayer,
    gameSettings,
    handleNextPlayer,
    handleNextRound,
    currentMatch,
    setupBattleMode,
    handleBattleTimeout,
  } = useGameplay();

  const { blitzPackTitle } = gameSettings;
  const params = useLocalSearchParams();
  const mode = params.mode as string;

  const [showSplash, setShowSplash] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [bgUri, setBgUri] = useState<string | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  const prompts = useGetPromptsByBlitzPack(blitzPackTitle!);
  const currentPrompt = prompts[currentPromptIndex] || "Loading...";

  useEffect(() => {
    loadBackground(mode, setBgUri);
  }, [mode]);

  useEffect(() => {
    if (mode === GameMode.BATTLE) {
      setupBattleMode();
    }
  }, [players]);

  useGameplayHeader(isMuted, setIsMuted);

  if (showSplash) {
    return (
      <SplashScreen
        backgroundPath={mode}
        isReady={isReady(
          players,
          mode,
          currentMatch,
          blitzPackTitle ?? "",
          currentPrompt,
          bgUri
        )}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  const handleNextPlayerAndPrompt = (score: number) => {
    handleNextPlayer(score);
    nextPrompt(setCurrentPromptIndex, prompts.length);
  };

  const handleTimeout = (winner: Player) => {
    handleBattleTimeout(winner);
    nextPrompt(setCurrentPromptIndex, prompts.length);
  };

  const handleOnRestart = () => {
    setupBattleMode();
    nextPrompt(setCurrentPromptIndex, prompts.length);
  };

  const ModeComponent =
    mode === GameMode.BATTLE
      ? BattleMode
      : mode === GameMode.BLITZ
      ? BlitzMode
      : ChillMode;

  return (
    <ImageBackground
      source={bgUri ? { uri: bgUri } : undefined}
      style={styles.wrapper}
      resizeMode="cover"
    >
      <View style={styles.modeView}>
        <ModeComponent
          currentPrompt={currentPrompt}
          players={players}
          packTitle={blitzPackTitle || ""}
          currentPlayer={currentPlayer!}
          handleNextPlayer={handleNextPlayerAndPrompt}
          handleNextRound={handleNextRound}
          handleSkipPrompt={() =>
            nextPrompt(setCurrentPromptIndex, prompts.length)
          }
          onTimeout={handleTimeout}
          onRestart={handleOnRestart}
          currentMatch={currentMatch}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  modeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },
});

export default Gameplay;
