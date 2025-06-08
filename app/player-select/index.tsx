import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react";
import {
  Animated,
  Easing,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, getEasterEggMessage, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings, initializePlayers } =
    useGameplay();
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playersData, setPlayersData] = useState<
    { id: number; iconIndex: number }[]
  >([]);
  const [startAttempted, setStartAttempted] = useState(false);
  const [flashMessage, setFlashMessage] = useState("Select Players");

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  const glowAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease) as any,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (startAttempted) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [startAttempted]);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 1)"],
  });

  const handlePlayerCountChange = useCallback(
    (players: { id: number; iconIndex: number }[]) => {
      setPlayersData(players);
      console.log("Players:", players);
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

  const handleGameStart = () => {
    const playerIds = playersData.map((p) => p.id).sort((a, b) => a - b);
    const hasMissingPlayer =
      playerIds.length > 0 &&
      Array.from(
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

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: "none",
      headerTitle: () => (
        <Text style={styles.title}>✨ {gameSettings.blitzPackTitle}</Text>
      ),
      headerStyle: {
        backgroundColor: "#192c43",
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ paddingHorizontal: 15, paddingVertical: 5 }}
        >
          <Text style={{ fontSize: 30, color: "#fff", fontWeight: "700" }}>
            ←
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, gameSettings.blitzPackTitle]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.playersWrapper}>
        <View style={styles.textContainer}>
          {startAttempted ? (
            <View style={styles.warningContainer}>
              <View style={styles.warningBox}>
                <Animated.Text
                  style={[
                    styles.warningText,
                    { transform: [{ translateX: shakeAnim }] },
                  ]}
                >
                  ⚠️{" "}
                  {(() => {
                    const ids = playersData
                      .map((p) => p.id)
                      .sort((a, b) => a - b);
                    const missing = Array.from(
                      { length: ids[ids.length - 1] },
                      (_, i) => i + 1
                    ).find((n) => !ids.includes(n));
                    if (selectedMode === "battle" && playersData.length < 2) {
                      return "Select at least 2 characters";
                    }
                    return missing
                      ? `Reselect Player ${missing}`
                      : "Ready to start!";
                  })()}
                </Animated.Text>
              </View>
            </View>
          ) : (
            <View style={styles.warningContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  const message = getEasterEggMessage(playersData);
                  if (message) {
                    setFlashMessage(message);
                  }
                }}
              >
                <FlashingText style={styles.selectPlayerText}>
                  {flashMessage}
                </FlashingText>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <Animated.View
          pointerEvents="auto"
          style={{
            opacity: entryAnim,
            transform: [
              {
                scale: entryAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          {/* Warning message removed from here; it is shown only in textContainer above */}
          <View>
            <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
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
        activeOpacity={0.7}
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
  backButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
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
