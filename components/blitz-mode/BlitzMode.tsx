import React, { useEffect, useState, useRef } from "react";
import { Text, Animated, SafeAreaView, View, StyleSheet } from "react-native";

import { Player } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import { BlitzCounter } from "./blitz-counter";
import { ScoreRankings } from "./score-rankings";
import { WinnerOverlay } from "./winner-overlay/WinningOverlay";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";
import { AlphaCategorySelect } from "components/alpha-category-select";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  players: { id: number; name: string; score: number | null }[];
  currentPlayer: Player;
  handleNextRound: () => void;
  packTitle: string;
}

const TIMER_DURATION = 5;

export const BlitzMode: React.FC<BlitzModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
  handleNextRound,
  packTitle,
}) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  console.log("🚀 ~ selectedCategory:", selectedCategory);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { titleImage } = blitzPackIcons[packTitle] || {};

  useEffect(() => {
    if (isCountdownActive) {
      if (countdown > 0) {
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(countdownInterval);
      } else {
        setIsCountdownActive(false);
        setIsGameStarted(true);
      }
    }
  }, [isCountdownActive, countdown]);

  useEffect(() => {
    if (isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleNextPlayer(score);
      setCurrentPlayerIndex((prevIndex) => prevIndex + 1);
      resetGameState();
    }
  }, [isGameStarted, timer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  const resetGameState = () => {
    setIsGameStarted(false);
    setScore(0);
    setTimer(TIMER_DURATION);
  };

  const isRoundOver = currentPlayerIndex === players.length;

  useEffect(() => {
    if (isRoundOver) {
      setShowWinnerOverlay(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isRoundOver]);

  const handleNextRoundClick = () => {
    handleNextRound();
    setCurrentPlayerIndex(0);
    setScore(0);
    setTimer(TIMER_DURATION);
    setIsGameStarted(false);
    setShowWinnerOverlay(false);
    fadeAnim.setValue(0);
  };

  const handleStartGame = () => {
    setCountdown(3);
    setIsCountdownActive(true);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePickRandom = () => {
    const categories = [
      "Animals",
      "Foods",
      "Books",
      "Countries",
      "Movies",
      "Nature",
    ];
    const random = categories[Math.floor(Math.random() * categories.length)];
    setSelectedCategory(random);
  };

  if (showWinnerOverlay) {
    return (
      <WinnerOverlay
        players={players}
        handleNextRound={handleNextRoundClick}
        fadeAnim={fadeAnim}
      />
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
        categoryBubble={titleImage}
        isObscured={!isGameStarted}
        countdown={isCountdownActive ? countdown : null}
        isAlphaBlitz={packTitle === "Alpha Blitz"}
        selectedCategory={selectedCategory}
      />

      {packTitle === "Alpha Blitz" && !selectedCategory ? (
        <AlphaCategorySelect
          onSelectCategory={handleSelectCategory}
          onPickRandom={handlePickRandom}
        />
      ) : (
        <View style={styles.counterContainer}>
          <BlitzCounter
            score={score}
            onIncrement={handleScoreIncrement}
            currentPlayer={currentPlayer}
            onStart={handleStartGame}
            timer={timer}
            isGameStarted={isGameStarted}
            isCountdownActive={isCountdownActive}
          />
          <ScoreRankings
            players={players}
            isGameStarted={isGameStarted || isCountdownActive}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 50,
  },
  playerLabel: {
    color: "#fff",
    fontFamily: "LuckiestGuy",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
  },
  counterContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 15,
  },
});
