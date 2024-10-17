import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./GameplayContent.styled";
import { useGameplay } from "app/context/game-context/GameContext";

const prompts = [
  "List famous bands from the 70's",
  "Name popular programming languages",
  "List U.S. Presidents",
]; // Hardcoded prompts for now

const GameplayContent: React.FC = () => {
  const { title } = useGlobalSearchParams();
  const router = useRouter();

  // Accessing the gameplay context to retrieve players and methods
  const { players, updatePlayerScore } = useGameplay();

  const playerCount = players.length; // Use players array length as the player count
  const TIMER_DURATION = 2;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Timer effect
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isGameStarted && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [isGameStarted, timer]);

  // Handle score increment
  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Handle starting the game
  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  // Handle next player's turn and update their score in context
  const handleNextPlayer = () => {
    // Save the current player's score
    updatePlayerScore(currentPlayer, score);

    if (currentPlayer < playerCount) {
      setCurrentPlayer((prevPlayer) => prevPlayer + 1);
      setIsGameStarted(false);
      setTimer(TIMER_DURATION);
      setScore(0);

      const nextPromptIndex =
        (prompts.indexOf(currentPrompt) + 1) % prompts.length;
      setCurrentPrompt(prompts[nextPromptIndex]);
    } else {
      // Push to results page
      router.push({
        pathname: "routes/route-results/ResultsContent",
        params: {
          scores: JSON.stringify(players.map((player) => player.score)),
        },
      });
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <Text>Current Player: {players[currentPlayer - 1]?.name}</Text>
        <Text>Prompt: {currentPrompt}</Text>
        <Text>Time Remaining: {timer}s</Text>
        <Text>Score: {score}</Text>
        <TouchableOpacity
          onPress={isGameStarted ? handleScoreIncrement : handleGameStart}
        >
          <Text style={{ fontSize: 40 }}>{isGameStarted ? "✔️" : "Start"}</Text>
        </TouchableOpacity>
        <Text>{isGameStarted ? "Tap for Correct Answer" : "Tap to Start"}</Text>
        {timer === 0 && (
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
