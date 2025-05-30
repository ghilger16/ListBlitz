import SplashScreen from "components/splash-screen/SplashScreen";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { GameMode, Player, useGameplay } from "@Context";
import { Prompt, useGetPromptsByBlitzPack } from "@Services";
import { ChillMode, BlitzMode, BattleMode } from "@Components";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Asset } from "expo-asset";

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

  const { blitzPackId, blitzPackTitle } = gameSettings;
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const mode = params.mode as string;

  const [showSplash, setShowSplash] = useState(true);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    const blitz = Asset.fromModule(require("assets/images/blitz-bg.png"));
    const chill = Asset.fromModule(require("assets/images/chill-bg.png"));
    if (blitz.localUri && chill.localUri) {
      setAssetsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mode === GameMode.BATTLE && !assetsLoaded) {
      console.log("Loading battle assets...");
      setupBattleMode();
    }
  }, [players]);

  const prompts = useGetPromptsByBlitzPack(blitzPackTitle!);
  console.log("🚀 ~ prompts:", prompts);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const currentPrompt = prompts[currentPromptIndex] || "Loading...";
  const nextPrompt = () =>
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);

  const handleSkipPrompt = () => {
    nextPrompt();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: "none",
      headerTransparent: true,
      headerTitle: "",
      screenOptions: { colors: { background: "transparent" } },
      headerStyle: {
        backgroundColor: "transparent",
        elevation: 0,
        shadowOpacity: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!blitzPackId) {
    return (
      <SafeAreaView>
        <Text>Error: No Blitz Pack Selected.</Text>
      </SafeAreaView>
    );
  }

  if (showSplash) {
    return (
      <SplashScreen
        backgroundPath={mode}
        isReady={
          players.length > 0 &&
          (mode === GameMode.BATTLE
            ? currentMatch !== null && assetsLoaded
            : blitzPackTitle === "Alpha Blitz" ||
              currentPrompt !== "Loading...") &&
          assetsLoaded
        }
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  const handleNextPlayerAndPrompt = (score: number) => {
    handleNextPlayer(score);
    nextPrompt();
  };

  const handleTimeout = (winner: Player) => {
    handleBattleTimeout(winner);
    nextPrompt();
  };

  const handleOnRestart = () => {
    setupBattleMode();
    nextPrompt();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.modeView}>
        {mode === GameMode.BATTLE ? (
          <BattleMode
            currentPrompt={currentPrompt}
            packTitle={blitzPackTitle || ""}
            currentMatch={currentMatch}
            onTimeout={handleTimeout}
            onRestart={handleOnRestart}
          />
        ) : mode === GameMode.BLITZ ? (
          <BlitzMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            players={players}
            handleNextRound={handleNextRound}
            packTitle={blitzPackTitle || ""}
            currentPlayer={currentPlayer}
          />
        ) : (
          <ChillMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            players={players}
            packTitle={blitzPackTitle || ""}
            currentPlayer={currentPlayer}
            handleSkipPrompt={handleSkipPrompt}
          />
        )}
      </View>
    </View>
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
