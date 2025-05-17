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
  StyleSheet,
  SafeAreaView,
  View,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings } = useGameplay();
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playerCount, setPlayerCount] = useState(1);

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
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 1)"],
  });

  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayerCount(count);
  }, []);

  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  useEffect(() => {
    if (
      gameSettings.playerCount !== playerCount ||
      gameSettings.mode !== selectedMode
    ) {
      setGameSettings({ mode: selectedMode, playerCount });
    }
  }, [selectedMode, playerCount, setGameSettings, gameSettings]);

  const handleGameStart = () => {
    if (playerCount > 0) {
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
          <FlashingText style={styles.selectPlayerText}>
            Select Players
          </FlashingText>
        </View>
        <Animated.View
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
          <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
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
        style={[styles.startButton, { opacity: playerCount < 1 ? 0.5 : 1 }]}
        onPress={handleGameStart}
        disabled={playerCount < 1}
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
    marginTop: 75,
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 50,
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
    marginTop: 100,
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
});

export default PlayerSelect;
