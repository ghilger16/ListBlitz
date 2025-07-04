import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Animated,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";

import { router } from "expo-router";

import { useGameplay, GameMode, Player } from "@Context";
import {
  ModeSelect,
  PlayerSelectFlashMessage,
  PlayerSelectWheel,
} from "@Components";
import { usePlayerSelectHeader, usePlayerSelectAnimations } from "@Hooks";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings, initializePlayers } =
    useGameplay();
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [startAttempted, setStartAttempted] = useState(false);
  const [flashMessage, setFlashMessage] = useState("Select Players");

  usePlayerSelectHeader(gameSettings);

  const { glowInterpolation, entryAnim, shakeAnim } =
    usePlayerSelectAnimations();

  const handlePlayerCountChange = useCallback(
    (players: { id: number; iconIndex: number }[]) => {
      const mappedPlayers: Player[] = players.map((p) => ({
        id: p.id,
        iconIndex: p.iconIndex,
      }));
      setPlayersData(mappedPlayers);
    },
    []
  );

  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  useEffect(() => {
    if (
      gameSettings.playerCount !== playersData.length ||
      gameSettings.mode !== selectedMode
    ) {
      setGameSettings({ mode: selectedMode, playerCount: playersData.length });
    }
  }, [selectedMode, playersData, setGameSettings, gameSettings]);

  const getEntryAnimStyle = () => ({
    opacity: entryAnim,
    transform: [
      {
        scale: entryAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  });

  const handleGameStart = () => {
    const playerIds = playersData.map((p) => p.id).sort((a, b) => a - b);
    const hasMissingPlayer =
      playerIds.length === 0
        ? false
        : Array.from(
            { length: playerIds[playerIds.length - 1] },
            (_, i) => i + 1
          ).some((n) => !playerIds.includes(n));

    if (
      hasMissingPlayer ||
      (selectedMode === "battle" && playerIds.length < 2)
    ) {
      setStartAttempted(true);
      return;
    }
    if (playersData.length > 0) {
      initializePlayers(playersData);
      onGameStart();
      router.push({
        pathname: "/gameplay",
        params: { mode: selectedMode },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.playersWrapper}>
        <View style={styles.textContainer}>
          <PlayerSelectFlashMessage
            startAttempted={startAttempted}
            shakeAnim={shakeAnim}
            flashMessage={flashMessage}
            playersData={playersData}
            setFlashMessage={setFlashMessage}
            selectedMode={selectedMode}
          />
        </View>
        <Animated.View pointerEvents="auto" style={getEntryAnimStyle()}>
          <View>
            <PlayerSelectWheel onPlayerCountChange={handlePlayerCountChange} />
          </View>
          <View style={styles.playersSelectWrapper}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotateX: entryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["180deg", "0deg"],
                    }),
                  },
                ],
              }}
            >
              <ModeSelect onModeChange={handleModeChange} mode={selectedMode} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[
          styles.startButton,
          { opacity: playersData.length < 1 ? 0.5 : 1 },
        ]}
        onPress={handleGameStart}
        disabled={playersData.length < 1}
        activeOpacity={0.9}
      >
        <Animated.Text
          style={[styles.startText, { textShadowColor: glowInterpolation }]}
        >
          Start
        </Animated.Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#192c43",
  },
  title: {
    fontFamily: "SourGummy",
    fontSize: 15,
    textTransform: "uppercase",
    color: "#fff",
    backgroundColor: "#0B3D91",
    paddingHorizontal: 25,
    paddingBottom: 5,
    borderRadius: 20,
    overflow: "hidden",
    textAlign: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    letterSpacing: 1.5,
    borderWidth: 2,
    borderColor: "#61D4FF",
  },
  playersWrapper: {
    marginTop: 55,
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectPlayerText: {
    fontSize: 20,
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 191, 255, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: "#FF6600",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 75,
    elevation: 8,
    shadowColor: "rgba(255, 165, 0, 0.5)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: "#FFCC00",
  },
  startText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textAlign: "center",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    fontFamily: "SourGummy",
  },
  warningContainer: {
    height: 40,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  warningBox: {
    backgroundColor: "#1e2a38",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffcc00",
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    color: "#ffcc00",
    fontSize: 16,
    fontWeight: "600",
  },
  playersSelectWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PlayerSelect;
