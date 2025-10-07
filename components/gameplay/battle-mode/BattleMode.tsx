import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { PromptDisplay } from "components/gameplay/prompt-display";
import { SkipButton } from "components/gameplay/prompt-display/SkipButton";
import { blitzPackIcons } from "@Utils";
import { Asset } from "expo-asset";
import { GameMode, ModeComponentProps, Player } from "@Context";
import { BattleTimer } from "./battle-timer";
import { PlayerCard } from "./player-card";
import { playerIcons } from "@Context";
import LottieView from "lottie-react-native";
import { useGameplay } from "@Context";

import { useBattleAnimation, useResponsiveStyles } from "@Hooks";
import { playSound, playTapSound, stopSound } from "@Utils";
import { timerSound } from "@Assets";
import {
  AlphaCategoryWrapper,
  useAlphaCategory,
} from "../alpha-category-select";

const { width: sw, height: sh } = Dimensions.get("window");

export const BattleMode: React.FC<ModeComponentProps> = ({
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
  const [skipTrigger, setSkipTrigger] = useState(0);

  // Base on screen size; the band is ~30-36% of screen height, so use ~70% of that for the wheel
  const timerSize = Math.min(sw * 0.6, sh * 0.24);

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.7);
      if (device.isTablet) return Math.round(base * 1.35);
      if (device.isLargePhone) return Math.round(base * 1.1);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    const bandH = device.isLargeTablet
      ? Math.round(sh * 0.36)
      : device.isTablet
      ? Math.round(sh * 0.34)
      : device.isLargePhone
      ? Math.round(sh * 0.32)
      : device.isSmallPhone
      ? Math.round(sh * 0.3)
      : Math.round(sh * 0.31);

    const promptPadTop = device.isLargeTablet ? 60 : device.isTablet ? 50 : 0;

    const matchTop = device.isLargeTablet
      ? 0
      : device.isTablet
      ? -20
      : device.isSmallPhone
      ? 0
      : 0;
    const vsFontSize = device.isLargeTablet
      ? 96
      : device.isTablet
      ? 80
      : device.isSmallPhone
      ? 50
      : 60;
    const cardSize = device.isLargeTablet
      ? 310
      : device.isTablet
      ? 225
      : device.isLargePhone
      ? 150
      : device.isSmallPhone
      ? 125
      : 130;
    const winnerTop = device.isLargeTablet
      ? 300
      : device.isTablet
      ? 250
      : device.isSmallPhone
      ? 130
      : 165;
    const lottieSize = device.isLargeTablet
      ? 260
      : device.isTablet
      ? 220
      : device.isSmallPhone
      ? 110
      : 150;
    const btnTextSize = device.isLargeTablet
      ? 42
      : device.isTablet
      ? 36
      : device.isSmallPhone
      ? 22
      : 28;
    const startBtn = device.isLargeTablet
      ? {
          paddingVertical: 22,
          paddingHorizontal: 72,
          borderWidth: 7,
          borderRadius: 40,
        }
      : device.isTablet
      ? {
          paddingVertical: 18,
          paddingHorizontal: 64,
          borderWidth: 6,
          borderRadius: 36,
        }
      : device.isSmallPhone
      ? {
          paddingVertical: 10,
          paddingHorizontal: 28,
          borderWidth: 3,
          borderRadius: 26,
        }
      : {};
    const labelFont = device.isLargeTablet
      ? 42
      : device.isTablet
      ? 35
      : device.isSmallPhone
      ? 18
      : 24;

    // Reserve vertical space for the skip button row
    const skipRowHeight = device.isLargeTablet
      ? 68
      : device.isTablet
      ? 56
      : device.isLargePhone
      ? 48
      : device.isSmallPhone
      ? 40
      : 44;

    return {
      // Tighten space below the prompt/skip area
      promptWrapper: {
        paddingTop: promptPadTop,
        marginBottom: device.isLargeTablet
          ? 14
          : device.isTablet
          ? 12
          : device.isSmallPhone
          ? 6
          : 10,
      },

      // Wheel band height + slight negative top to visually pull timer closer to skip
      wheelArea: {
        height: bandH,
        alignItems: "center",
        justifyContent: "center",
        marginTop: device.isLargeTablet
          ? -12
          : device.isTablet
          ? -10
          : device.isSmallPhone
          ? -6
          : -8,
      },

      matchSection: {
        marginTop: matchTop,
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "column",
      },
      vsText: { fontSize: vsFontSize },
      playerCard: { width: cardSize, height: cardSize },
      startButton: { ...(startBtn as any) },
      startButtonText: { fontSize: btnTextSize },

      // Add a small bottom margin so the Start button breathes above the home indicator (esp. small phones)
      startButtonWrapper: {
        marginBottom: device.isLargeTablet
          ? 18
          : device.isTablet
          ? 16
          : device.isSmallPhone
          ? 14
          : 12,
      },

      winnerSection: {
        marginTop: winnerTop,
        alignItems: "center",
        justifyContent: "flex-end",
        flexDirection: "column",
      },
      lottieIcon: { width: lottieSize, height: lottieSize },
      winnerHeaderText: { fontSize: fs(52) },
      winnerText: { fontSize: fs(48) },
      matchLabelText: { fontSize: labelFont },
      skipRow: {
        height: skipRowHeight,
        alignItems: "center",
        justifyContent: "center",
      },
    } as const;
  });

  const {
    selectedCategory,
    isShuffleActive,
    handleSelectCategory,
    handlePickRandom,
  } = useAlphaCategory();

  const { globalMatchIndex, totalMatches, getMatchLabel } = useGameplay();

  const { vsScale } = useBattleAnimation(currentMatch);

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
    stopSound();
    playSound(timerSound);
  };

  const handlePlayerSelect = () => {
    if (!isGameStarted) return;
    playTapSound();
    setTurnIndex((prev) => {
      const newIndex = prev === 0 ? 1 : 0;
      turnIndexRef.current = newIndex;
      return newIndex;
    });
    stopSound();
    playSound(timerSound);

    setIsTimerActive(false);
    setTimeout(() => setIsTimerActive(true), 10);
  };

  const handleTimeout = () => {
    setIsGameStarted(false);
    setIsTimerActive(false);
    isShuffleActive && handlePickRandom();
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
        onTimeout?.(winner);
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
    onRestart?.();
  };

  if (!currentMatch) return null;

  const displayWinner = getDisplayWinner();
  const displayIconIndex = displayWinner ? displayWinner.iconIndex : 0;

  if (!bgUri) return null;

  if (packTitle === "Alpha Blitz" && !selectedCategory) {
    return (
      <AlphaCategoryWrapper
        bgUri={bgUri}
        onSelectCategory={handleSelectCategory}
        onPickRandom={handlePickRandom}
      />
    );
  }

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
                mode={GameMode.BATTLE}
                categoryBubble={blitzPackIcons[packTitle]?.titleImage}
                isAlphaBlitz={packTitle === "Alpha Blitz"}
                selectedCategory={selectedCategory}
                skipSignal={skipTrigger}
                {...(!isGameStarted
                  ? { handleSkipPrompt: handleSkipPrompt ?? (() => {}) }
                  : {})}
              />
              <View style={styles.skipRow}>
                {!isGameStarted && (
                  <SkipButton
                    playerColor={currentMatch[turnIndex].startColor}
                    onPress={() => setSkipTrigger((prev) => prev + 1)}
                  />
                )}
              </View>
            </View>
            <View style={styles.wheelArea}>
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
                  size={(styles as any).playerCard?.width ?? 150}
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
                  size={(styles as any).playerCard?.width ?? 150}
                  isRightCard
                />
              </View>
              {!isGameStarted && (
                <>
                  <View style={styles.startButtonWrapper}>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={handleStartRound}
                    >
                      <Text style={styles.startButtonText}>START MATCH</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <View style={styles.winnerOverlay}>
            {displayWinner && (
              <>
                <View style={styles.winnerSection}>
                  <Text style={styles.winnerHeaderText}>
                    {displayWinner?.name?.toUpperCase()}
                  </Text>
                  <LottieView
                    source={playerIcons[displayIconIndex]}
                    autoPlay
                    loop
                    style={styles.lottieIcon}
                  />
                  <Text style={styles.winnerText}>
                    {isFinalMatch ? "WINS!" : "ADVANCES"}
                  </Text>
                </View>
                {isFinalMatch && (
                  <TouchableOpacity
                    style={[styles.startButton, styles.nextRoundButton]}
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

const BASE_STYLES = StyleSheet.create({
  wrapper: { flex: 1 },
  promptWrapper: {
    marginTop: 15,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    zIndex: 10,
    alignSelf: "stretch",
    textAlign: "center",
  },
  wheelArea: {
    alignItems: "center",
    justifyContent: "center",
  },
  playerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vsText: {
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
  nextRoundButton: {
    marginTop: 80,
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
  },
  winnerSection: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 130,
  },
  lottieIcon: {
    width: 150,
    height: 150,
  },
  playerCard: { width: 150, height: 150 },
  skipRow: { height: 44, alignItems: "center", justifyContent: "center" },
});
