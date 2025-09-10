import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { PromptDisplay } from "components/gameplay/prompt-display";
import { blitzPackIcons, useScreenInfo } from "@Utils";
import { Asset } from "expo-asset";
import { GameMode, ModeComponentProps, Player } from "@Context";
import { BattleTimer } from "./battle-timer";
import { PlayerCard } from "./player-card";
import { playerIcons } from "@Context";
import LottieView from "lottie-react-native";
import { useGameplay } from "@Context";

import { useBattleAnimation } from "@Hooks";
import { playSound, playTapSound, stopSound } from "@Utils";
import { timerSound } from "@Assets";
import {
  AlphaCategoryWrapper,
  useAlphaCategory,
} from "../alpha-category-select";

const useSkipPrompt = (handleSkipPrompt?: () => void) => {
  const [skipTrigger, setSkipTrigger] = useState(0);
  const wrappedHandleSkipPrompt = () => {
    handleSkipPrompt?.();
    setSkipTrigger((prev) => prev + 1);
  };
  return { skipTrigger, wrappedHandleSkipPrompt };
};

export const BattleMode: React.FC<ModeComponentProps> = ({
  currentPrompt,
  packTitle,
  currentMatch,
  onTimeout,
  onRestart,
  handleSkipPrompt,
}) => {
  const { isTablet, isSmallPhone } = useScreenInfo();
  const matchRef = useRef<Player[] | null>(null);
  const turnIndexRef = useRef(0);
  const [turnIndex, setTurnIndex] = useState(0);
  const [bgUri, setBgUri] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isWinnerAnnounced, setIsWinnerAnnounced] = useState(false);
  const [finalWinner, setFinalWinner] = useState<Player | null>(null);

  const dynamicPadding = {
    paddingTop: isTablet ? 60 : isSmallPhone ? 0 : 10,
  };
  const dynamicPadding2 = {
    paddingTop: isTablet ? 35 : isSmallPhone ? 0 : 10,
  };

  const {
    selectedCategory,
    isShuffleActive,
    handleSelectCategory,
    handlePickRandom,
  } = useAlphaCategory();

  const { globalMatchIndex, totalMatches, getMatchLabel } = useGameplay();

  const { vsScale } = useBattleAnimation(currentMatch);
  const { skipTrigger, wrappedHandleSkipPrompt } =
    useSkipPrompt(handleSkipPrompt);

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
    stopSound(); // make sure any previous sound is stopped
    playSound(timerSound); // start looping timer sound
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
            <View style={[styles.promptWrapper, dynamicPadding]}>
              <PromptDisplay
                prompt={currentPrompt}
                playerColor={currentMatch[turnIndex].startColor}
                mode={GameMode.BATTLE}
                categoryBubble={blitzPackIcons[packTitle]?.titleImage}
                isAlphaBlitz={packTitle === "Alpha Blitz"}
                selectedCategory={selectedCategory}
                {...(!isGameStarted
                  ? { handleSkipPrompt: wrappedHandleSkipPrompt }
                  : {})}
              />
            </View>
            <View style={[styles.timerContainer, dynamicPadding2]}>
              <BattleTimer
                currentPlayer={currentMatch[turnIndex]}
                onStart={handleStartRound}
                isGameStarted={isGameStarted}
                isCountdownActive={isTimerActive}
                onTimeOut={handleTimeout}
              />
            </View>
            <View
              style={[
                styles.matchSection,
                { marginTop: isTablet ? -90 : isSmallPhone ? -45 : -65 },
              ]}
            >
              {!isGameStarted && currentMatch.length === 2 && (
                <View style={styles.matchLabelContainer}>
                  <Text
                    style={[
                      styles.matchLabelText,
                      { fontSize: isTablet ? 35 : isSmallPhone ? 18 : 24 },
                    ]}
                  >
                    {getMatchLabel(globalMatchIndex, totalMatches)}
                  </Text>
                </View>
              )}
              <View style={styles.playerRow}>
                <PlayerCard
                  player={currentMatch[0]}
                  onPress={turnIndex === 0 ? handlePlayerSelect : undefined}
                  dimmed={turnIndex !== 0}
                  size={isTablet ? 250 : isSmallPhone ? 125 : 150}
                />
                {!isGameStarted && (
                  <Animated.Text
                    style={[
                      styles.vsText,
                      { transform: [{ scale: vsScale }] },
                      { fontSize: isTablet ? 80 : isSmallPhone ? 50 : 60 },
                    ]}
                  >
                    VS
                  </Animated.Text>
                )}
                <PlayerCard
                  player={currentMatch[1]}
                  onPress={turnIndex === 1 ? handlePlayerSelect : undefined}
                  dimmed={turnIndex !== 1}
                  size={isTablet ? 250 : isSmallPhone ? 125 : 150}
                  isRightCard
                />
              </View>
              {!isGameStarted && (
                <View style={styles.startButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.startButton,
                      isTablet && {
                        paddingVertical: 18,
                        paddingHorizontal: 64,
                        borderWidth: 6,
                        borderRadius: 36,
                      },
                      isSmallPhone && {
                        paddingVertical: 10,
                        paddingHorizontal: 28,
                        borderWidth: 3,
                        borderRadius: 26,
                      },
                    ]}
                    onPress={handleStartRound}
                  >
                    <Text
                      style={[
                        styles.startButtonText,
                        { fontSize: isTablet ? 36 : isSmallPhone ? 22 : 28 },
                      ]}
                    >
                      START MATCH
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.winnerOverlay}>
            {displayWinner && (
              <>
                <View
                  style={[
                    styles.winnerSection,
                    { marginTop: isTablet ? 250 : isSmallPhone ? 130 : 165 },
                  ]}
                >
                  <Text
                    style={[
                      styles.winnerHeaderText,
                      { fontSize: isTablet ? 72 : isSmallPhone ? 36 : 52 },
                    ]}
                  >
                    {displayWinner?.name?.toUpperCase()}
                  </Text>
                  <LottieView
                    source={playerIcons[displayIconIndex]}
                    autoPlay
                    loop
                    style={[
                      styles.lottieIcon,
                      {
                        width: isTablet ? 220 : isSmallPhone ? 110 : 150,
                        height: isTablet ? 220 : isSmallPhone ? 110 : 150,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.winnerText,
                      { fontSize: isTablet ? 64 : isSmallPhone ? 32 : 48 },
                    ]}
                  >
                    {isFinalMatch ? "WINS!" : "ADVANCES"}
                  </Text>
                </View>
                {isFinalMatch && (
                  <TouchableOpacity
                    style={[
                      styles.startButton,
                      styles.nextRoundButton,
                      isTablet && {
                        paddingVertical: 18,
                        paddingHorizontal: 64,
                        borderWidth: 6,
                        borderRadius: 36,
                      },
                      isSmallPhone && {
                        paddingVertical: 10,
                        paddingHorizontal: 28,
                        borderWidth: 3,
                        borderRadius: 26,
                      },
                    ]}
                    onPress={handleRestart}
                  >
                    <Text
                      style={[
                        styles.startButtonText,
                        { fontSize: isTablet ? 36 : isSmallPhone ? 22 : 28 },
                      ]}
                    >
                      START NEXT ROUND
                    </Text>
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
    marginTop: -65,
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
});
