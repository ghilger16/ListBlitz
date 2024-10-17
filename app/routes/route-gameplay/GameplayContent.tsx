import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./GameplayContent.styled";
import { useGameplay } from "app/context/game-context/GameContext";

const prompts = [
  "List famous bands from the 70's",
  "Name popular programming languages",
  "List U.S. Presidents",
];

const GameplayContent: React.FC = () => {
  const { title, mode } = useGlobalSearchParams(); // Get the selected mode
  const router = useRouter();

  const { players, updatePlayerScore } = useGameplay();

  const playerCount = players.length;
  const TIMER_DURATION = 10;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0); // Number of correct answers in the round
  const [answersCount, setAnswersCount] = useState(0); // Track answers in Chill Mode
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Timer effect (for Blitz Mode only)
  useEffect(() => {
    if (mode === "blitz" && isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isGameStarted, timer, mode]);

  // Handle game completion
  useEffect(() => {
    if (currentPlayer > playerCount) {
      router.push("/results");
    }
  }, [currentPlayer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
      setAnswersCount((prevCount) => prevCount + 1); // For Chill Mode
    }
  };

  // Handle starting the game
  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  // Handle next player's turn and update their score
  const handleNextPlayer = () => {
    // Save the current player's score
    updatePlayerScore(currentPlayer, score);

    if (currentPlayer < playerCount) {
      setCurrentPlayer((prevPlayer) => prevPlayer + 1);
      setIsGameStarted(false);
      setTimer(TIMER_DURATION);
      setScore(0);
      setAnswersCount(0); // Reset for Chill Mode

      const nextPromptIndex =
        (prompts.indexOf(currentPrompt) + 1) % prompts.length;
      setCurrentPrompt(prompts[nextPromptIndex]);
    } else {
      // Navigate to results screen
      router.push({
        pathname: "routes/route-results/ResultsContent",
        params: {
          scores: JSON.stringify(players.map((player) => player.score)),
        },
      });
    }
  };

  // Trigger next player in Chill Mode after 5 answers
  useEffect(() => {
    if (mode === "chill" && answersCount >= 5) {
      handleNextPlayer();
    }
  }, [answersCount, mode]);

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <Text>Current Player: {players[currentPlayer - 1]?.name}</Text>
        <Text>Prompt: {currentPrompt}</Text>
        {mode === "blitz" && <Text>Time Remaining: {timer}s</Text>}
        <Text>Score: {score}</Text>
        <TouchableOpacity
          onPress={isGameStarted ? handleScoreIncrement : handleGameStart}
        >
          <Text style={{ fontSize: 40 }}>{isGameStarted ? "✔️" : "Start"}</Text>
        </TouchableOpacity>
        <Text>
          {isGameStarted
            ? mode === "blitz"
              ? "Tap for Correct Answer"
              : `Give 5 Answers`
            : "Tap to Start"}
        </Text>
        {timer === 0 && mode === "blitz" && (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "lightgray",
              padding: 10,
              borderRadius: 50,
            }}
            onPress={handleNextPlayer}
          >
            <Text>
              {currentPlayer < playerCount
                ? `➡️ Player ${currentPlayer + 1}`
                : "➡️ Results"}
            </Text>
          </TouchableOpacity>
        )}
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default GameplayContent;
