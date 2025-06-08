import SplashScreen from "components/splash-screen/SplashScreen";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { GameMode, Player, useGameplay } from "@Context";
import { useGetPromptsByBlitzPack } from "@Services";
import { ChillMode, BlitzMode, BattleMode } from "@Components";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { Asset } from "expo-asset";
import { stopSound, setMuted } from "components/utils";

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
  const [isMuted, setIsMuted] = useState(false);
  const [bgUri, setBgUri] = useState<string | null>(null);

  useEffect(() => {
    async function loadBackground() {
      try {
        let module;
        if (mode === GameMode.BLITZ) {
          module = require("assets/images/blitz-bg.png");
        } else if (mode === GameMode.CHILL) {
          module = require("assets/images/chill-bg.png");
        } else if (mode === GameMode.BATTLE) {
          module = require("assets/images/battle-bg.png");
        } else {
          return;
        }
        const [asset] = await Asset.loadAsync([module]);
        setBgUri(asset.localUri);
      } catch (error) {
        console.error("Error loading background image:", error);
      }
    }
    loadBackground();
  }, [mode]);

  useEffect(() => {
    if (mode === GameMode.BATTLE) {
      console.log("Loading battle assets...");
      setupBattleMode();
    }
  }, [players]);

  const prompts = useGetPromptsByBlitzPack(blitzPackTitle!);

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
          onPress={() => {
            stopSound();
            router.back();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // Calculate the next mute state, then update both React state and the util
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            setMuted(nextMute);
          }}
          style={styles.backButton}
        >
          <Text style={styles.backText}>{isMuted ? "🔇" : "🔊"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMuted]);

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
            ? currentMatch !== null
            : blitzPackTitle === "Alpha Blitz" ||
              currentPrompt !== "Loading...") &&
          bgUri !== null
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
    <ImageBackground
      source={bgUri ? { uri: bgUri } : undefined}
      style={styles.wrapper}
      resizeMode="cover"
    >
      <View style={styles.modeView}>
        {mode === GameMode.BATTLE ? (
          <BattleMode
            currentPrompt={currentPrompt}
            packTitle={blitzPackTitle || ""}
            currentMatch={currentMatch}
            onTimeout={handleTimeout}
            onRestart={handleOnRestart}
            handleSkipPrompt={handleSkipPrompt}
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
