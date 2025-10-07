import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Animated, TouchableOpacity, SafeAreaView, View } from "react-native";

import { router } from "expo-router";

import { useGameplay, GameMode, Player } from "@Context";
import {
  ModeSelect,
  PlayerSelectFlashMessage,
  PlayerSelectWheel,
} from "@Components";
import {
  usePlayerSelectHeader,
  usePlayerSelectAnimations,
  useResponsiveStyles,
} from "@Hooks";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings, initializePlayers } =
    useGameplay();
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playersData, setPlayersData] = useState<Player[]>([]);
  const [startAttempted, setStartAttempted] = useState(false);
  const [flashMessage, setFlashMessage] = useState("Select Players & Mode");

  usePlayerSelectHeader(gameSettings.blitzPackTitle ?? "");

  const { glowInterpolation, entryAnim, shakeAnim } =
    usePlayerSelectAnimations();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const wrapperMarginTop = device.isLargeTablet
      ? 55
      : device.isTablet
      ? 55
      : device.isLargePhone
      ? 55
      : device.isSmallPhone
      ? 25
      : 55;

    const textContainerMarginBottom = device.isLargeTablet
      ? 30
      : device.isTablet
      ? 30
      : device.isLargePhone
      ? 30
      : device.isSmallPhone
      ? 20
      : 30;

    const startButtonWidth = device.isLargeTablet
      ? 650
      : device.isTablet
      ? 650
      : device.isLargePhone
      ? 380
      : device.isSmallPhone
      ? 275
      : 350;

    const startButtonHeight = device.isLargeTablet
      ? 80
      : device.isTablet
      ? 80
      : device.isLargePhone
      ? 70
      : device.isSmallPhone
      ? 50
      : 60;

    const startTextFontSize = device.isLargeTablet
      ? 75
      : device.isTablet
      ? 75
      : device.isLargePhone
      ? 56
      : device.isSmallPhone
      ? 38
      : 50;

    const startTextHeight = device.isLargeTablet
      ? 100
      : device.isTablet
      ? 100
      : device.isLargePhone
      ? 80
      : device.isSmallPhone
      ? 50
      : 65;

    return {
      playersWrapper: { marginTop: wrapperMarginTop },
      textContainer: { marginBottom: textContainerMarginBottom },
      startButton: {
        width: startButtonWidth,
        height: startButtonHeight,
      },
      startText: { fontSize: startTextFontSize, height: startTextHeight },
    };
  });

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

const BASE_STYLES = {
  safeArea: {
    flex: 1,
    backgroundColor: "#192c43",
    alignItems: "center",
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
    width: 350,
    height: 60,
  },
  startText: {
    fontSize: 50,
    justifyContent: "center",
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    fontFamily: "SourGummy",
    width: "100%",
    height: 65,
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
} as const;

export default PlayerSelect;
