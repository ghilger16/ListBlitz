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
import { router, Stack, useNavigation } from "expo-router";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings } = useGameplay();
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playerCount, setPlayerCount] = useState(1);

  const navigation = useNavigation();

  const glowAnim = useRef(new Animated.Value(0)).current;

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
      router.push("/gameplay");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: "none",
      headerTitle: () => (
        <Text style={styles.title}>{gameSettings.blitzPackTitle}</Text>
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
        <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
        <ModeSelect onModeChange={handleModeChange} mode={selectedMode} />
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
    fontSize: 25,
    textTransform: "uppercase",
    color: "#ffffff",
    textShadowColor: "rgba(0, 191, 255, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
    textAlign: "center",
    alignSelf: "center",
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
    marginTop: 175,
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
