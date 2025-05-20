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

const PROMPT_LIMIT = 10;

const usePromptManager = (blitzPackId: number) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [usedPrompts, setUsedPrompts] = useState(new Set());
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);

  const {
    data: prompts = [],
    isLoading,
    error,
    refetch,
  } = blitzPackId !== undefined
    ? useGetPromptsByBlitzPack(blitzPackId, PROMPT_LIMIT)
    : { data: [], isLoading: false, error: null, refetch: () => {} };

  useEffect(() => {
    if (prompts.length > 0) {
      const newPrompts = prompts.filter(
        (prompt) => !usedPrompts.has(prompt.id)
      );
      setAvailablePrompts((prev) => [...prev, ...newPrompts]);
      const updatedUsedPrompts = new Set(usedPrompts);
      newPrompts.forEach((prompt) => updatedUsedPrompts.add(prompt.id));
      setUsedPrompts(updatedUsedPrompts);
    }
  }, [prompts]);

  useEffect(() => {
    if (currentPromptIndex >= availablePrompts.length - 1) {
      refetch();
    }
  }, [currentPromptIndex]);

  const currentPrompt =
    availablePrompts[currentPromptIndex]?.promptText || "Loading...";

  const nextPrompt = () =>
    setCurrentPromptIndex((prev) => (prev + 1) % availablePrompts.length);

  return {
    currentPrompt,
    isLoading,
    error,
    nextPrompt,
  };
};

const Gameplay: React.FC = () => {
  const {
    players,
    currentPlayer,
    gameSettings,
    handleNextPlayer,
    handleNextRound,
    currentMatch,
    setupBattleMode,
    startNextMatch,
    setBattleWinner,
    hasStarted,
    setHasStarted,
  } = useGameplay();
  console.log("🚀 ~ currentMatch:", currentMatch);

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

  // Ensure setupBattleMode is called during splash screen loading so currentMatch is set before BattleMode renders.
  useEffect(() => {
    if (mode === GameMode.BATTLE && players.length > 0 && !currentMatch) {
      setupBattleMode();
    }
  }, [mode, players, currentMatch]);

  const { currentPrompt, isLoading, error, nextPrompt } = usePromptManager(
    blitzPackId!
  );

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

  if (isLoading || !currentPlayer) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading prompts.</Text>;

  const handleNextPlayerAndPrompt = (score: number) => {
    handleNextPlayer(score);
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
            setBattleWinner={setBattleWinner}
            setupBattleMode={setupBattleMode}
            hasStarted={hasStarted}
            setHasStarted={setHasStarted}
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
