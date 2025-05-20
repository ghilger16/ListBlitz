import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { PromptDisplay } from "components/prompt-display";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";
import { Asset } from "expo-asset";
import { Player } from "@Context";
import { BattleTimer } from "./battle-timer";
import { PlayerCard } from "./player-card";

interface BattleModeProps {
  currentPrompt: string;
  packTitle: string;
  currentMatch: Player[] | null;
  setBattleWinner: (winner: Player) => void;
  setupBattleMode: () => void;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;
}

export const BattleMode: React.FC<BattleModeProps> = ({
  currentPrompt,
  packTitle,
  currentMatch,
  setBattleWinner,
  setupBattleMode,
  hasStarted,
  setHasStarted,
}) => {
  const titleImage = blitzPackIcons[packTitle]?.titleImage;
  const [bgUri, setBgUri] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const asset = Asset.fromModule(require("assets/images/battle-bg.png"));
    setBgUri(asset.localUri || asset.uri);
  }, []);

  useEffect(() => {
    if (!hasStarted) {
      setupBattleMode();
      setHasStarted(true);
    }
  }, []);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  const handleStartRound = () => {
    if (!currentMatch || currentMatch.length < 2) return;
    setScore(0);
    setTurnIndex(0);
    setIsTimerActive(true);
    setIsGameStarted(true);
  };

  const handlePlayerSelect = () => {
    if (!isGameStarted) return;
    setTurnIndex((prev) => (prev === 0 ? 1 : 0));
    setScore(0);
    setIsTimerActive(false);
    setTimeout(() => setIsTimerActive(true), 10);
  };

  const handleTimeout = () => {
    setIsGameStarted(false);
    setIsTimerActive(false);

    const loserIndex = turnIndex;
    const winnerIndex = loserIndex === 0 ? 0 : 1;

    const winner = currentMatch?.[winnerIndex];
    if (winner) {
      setBattleWinner(winner);
    }
  };

  if (!currentMatch || currentMatch.length < 2) return null;

  return (
    <ImageBackground
      source={bgUri ? { uri: bgUri } : undefined}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.promptWrapper}>
          <PromptDisplay
            prompt={currentPrompt}
            playerColor={currentMatch[turnIndex].startColor}
            categoryBubble={titleImage}
            isAlphaBlitz={packTitle === "Alpha Blitz"}
          />
        </View>
        <View style={styles.timerContainer}>
          <BattleTimer
            score={score}
            currentPlayer={currentMatch[turnIndex]}
            onIncrement={handleScoreIncrement}
            onStart={handleStartRound}
            isGameStarted={isGameStarted}
            isCountdownActive={isTimerActive}
            onTimeOut={handleTimeout}
          />
        </View>
        <View style={styles.playerRow}>
          <PlayerCard
            player={currentMatch[0]}
            onPress={turnIndex === 0 ? handlePlayerSelect : undefined}
            dimmed={turnIndex !== 0}
          />
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
              <Text style={styles.startButtonText}>START ROUND</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 15,
  },
  promptWrapper: {
    marginTop: 15,
  },
  timerContainer: {
    alignItems: "center",
    marginTop: -25,
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -15,
  },
  startButtonWrapper: {
    alignItems: "center",
    marginTop: 40,
  },
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
});
