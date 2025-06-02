// /components/battle-mode/BattleMode.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { PromptDisplay } from "components/prompt-display";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";
import { Asset } from "expo-asset";
import { Player } from "@Context";
import { BattleTimer } from "./battle-timer";
import { PlayerCard } from "./player-card";
import { playerIcons } from "@Services";
import LottieView from "lottie-react-native";
import { useGameplay } from "@Context";

interface BattleModeProps {
  currentPrompt: string;
  packTitle: string;
  currentMatch: Player[] | null;
  onTimeout: (winner: Player) => void;
  onRestart: () => void;
  handleSkipPrompt: () => void;
}

export const BattleMode: React.FC<BattleModeProps> = ({
  currentPrompt,
  packTitle,
  currentMatch,
  onTimeout,
  onRestart,
  handleSkipPrompt,
}) => {
  const matchRef = useRef<Player[] | null>(null);
  const turnIndexRef = useRef(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [bgUri, setBgUri] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isWinnerAnnounced, setIsWinnerAnnounced] = useState(false);
  const [finalWinner, setFinalWinner] = useState<Player | null>(null);

  const { globalMatchIndex, totalMatches, getMatchLabel } = useGameplay();

  const vsScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    vsScale.setValue(2.5);
    Animated.spring(vsScale, {
      toValue: 1.5,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  }, [currentMatch]);

  useEffect(() => {
    const asset = Asset.fromModule(require("assets/images/battle-bg.png"));
    setBgUri(asset.localUri || asset.uri);
  }, []);

  useEffect(() => {
    matchRef.current = currentMatch;
  }, [currentMatch]);

  useEffect(() => {
    turnIndexRef.current = turnIndex;
  }, [turnIndex]);

  const isFinalMatch = globalMatchIndex === totalMatches;

  const getDisplayWinner = () => {
    if (isFinalMatch) return finalWinner;
    const match = matchRef.current;
    if (!match) return null;
    return match[turnIndexRef.current === 0 ? 1 : 0];
  };

  const handleStartRound = () => {
    setIsTimerActive(true);
    setIsGameStarted(true);
  };

  const handlePlayerSelect = () => {
    if (!isGameStarted) return;
    setTurnIndex((prev) => {
      const newIndex = prev === 0 ? 1 : 0;
      turnIndexRef.current = newIndex;
      return newIndex;
    });
    setIsTimerActive(false);
    setTimeout(() => setIsTimerActive(true), 10);
  };

  const handleTimeout = () => {
    setIsGameStarted(false);
    setIsTimerActive(false);

    const loserIndex = turnIndexRef.current;
    const winnerIndex = loserIndex === 0 ? 1 : 0;
    const match = matchRef.current;
    const winner = match?.[winnerIndex];

    if (winner) {
      setIsWinnerAnnounced(true);
      if (isFinalMatch) {
        setFinalWinner(winner);
        return;
      }
      setTimeout(() => {
        turnIndexRef.current = 0;
        setTurnIndex(0);
        onTimeout(winner);
        setIsWinnerAnnounced(false);
      }, 3000);
    }
  };

  const handleRestart = () => {
    setIsWinnerAnnounced(false);
    setIsGameStarted(false);
    setIsTimerActive(false);
    setFinalWinner(null);
    turnIndexRef.current = 0;
    setTurnIndex(0);
    onRestart();
  };

  if (!currentMatch) return null;

  const displayWinner = getDisplayWinner();
  const displayIconIndex = displayWinner ? displayWinner.iconIndex : 0;

  return (
    <ImageBackground
      source={bgUri ? { uri: bgUri } : undefined}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.wrapper}>
        {!isWinnerAnnounced ? (
          <>
            <View style={styles.promptWrapper}>
              <PromptDisplay
                prompt={currentPrompt}
                playerColor={currentMatch[turnIndex].startColor}
                categoryBubble={blitzPackIcons[packTitle]?.titleImage}
                isAlphaBlitz={packTitle === "Alpha Blitz"}
                {...(!isGameStarted ? { handleSkipPrompt } : {})}
              />
            </View>
            <View style={styles.timerContainer}>
              <BattleTimer
                currentPlayer={currentMatch[turnIndex]}
                onStart={handleStartRound}
                isGameStarted={isGameStarted}
                isCountdownActive={isTimerActive}
                onTimeOut={handleTimeout}
              />
            </View>
            <View style={styles.matchSection}>
              {!isGameStarted && currentMatch.length === 2 && (
                <View style={styles.matchLabelContainer}>
                  <Text style={styles.matchLabelText}>
                    {getMatchLabel(globalMatchIndex, totalMatches)}
                  </Text>
                </View>
              )}
              <View style={styles.playerRow}>
                <PlayerCard
                  player={currentMatch[0]}
                  onPress={turnIndex === 0 ? handlePlayerSelect : undefined}
                  dimmed={turnIndex !== 0}
                />
                {!isGameStarted && (
                  <Animated.Text
                    style={[styles.vsText, { transform: [{ scale: vsScale }] }]}
                  >
                    VS
                  </Animated.Text>
                )}
                <PlayerCard
                  player={currentMatch[1]}
                  onPress={turnIndex === 1 ? handlePlayerSelect : undefined}
                  dimmed={turnIndex !== 1}
                />
              </View>
              {!isGameStarted && (
                <View style={styles.startButtonWrapper}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStartRound}
                  >
                    <Text style={styles.startButtonText}>START MATCH</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.winnerOverlay}>
            {displayWinner && (
              <>
                <View style={styles.winnerSection}>
                  <Text style={styles.winnerHeaderText}>
                    {displayWinner.name.toUpperCase()}
                  </Text>
                  <LottieView
                    source={playerIcons[displayIconIndex]}
                    autoPlay
                    loop
                    style={{ width: 150, height: 150 }}
                  />
                  <Text style={styles.winnerText}>
                    {isFinalMatch ? "WINS!" : "ADVANCES"}
                  </Text>
                </View>
                {isFinalMatch && (
                  <TouchableOpacity
                    style={[styles.startButton, { marginTop: 80 }]}
                    onPress={handleRestart}
                  >
                    <Text style={styles.startButtonText}>START NEXT ROUND</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 15 },
  promptWrapper: { marginTop: 15 },
  timerContainer: { alignItems: "center", marginTop: -30 },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  vsText: {
    fontSize: 60,
    fontFamily: "LuckiestGuy",
    fontWeight: "bold",
    color: "#FFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    backgroundColor: "transparent",
    zIndex: 5,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  startButtonWrapper: { alignItems: "center", marginTop: 40 },
  startButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  startButtonText: {
    fontSize: 28,
    fontFamily: "LuckiestGuy",
    color: "#000",
  },
  winnerOverlay: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  winnerHeaderText: {
    fontSize: 52,
    color: "#FFD700",
    fontFamily: "LuckiestGuy",
    textShadowColor: "#000",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
  },
  winnerText: {
    fontSize: 48,
    color: "#FFD700",
    fontFamily: "LuckiestGuy",
    textShadowColor: "#000",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    marginTop: 16,
  },
  matchLabelContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  matchLabelText: {
    fontSize: 24,
    fontFamily: "LuckiestGuy",
    color: "#FFD700",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  matchSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: -65,
  },
  winnerSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 130,
  },
});
