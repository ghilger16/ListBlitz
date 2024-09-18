import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import * as Styled from "./GameplayContent.styled"; // Assuming your styled components are already set

const prompts = [
  "List famous bands from the 70's",
  "Name popular programming languages",
  "List U.S. Presidents",
]; // Hardcoded prompts for now

const GameplayContent: React.FC = () => {
  const { title, playerCount: playerCountParam } = useGlobalSearchParams();

  const playerCount = Number(playerCountParam) || 1; // Fallback to 1 if playerCount is not provided
  const TIMER_DURATION = 10; // Set the timer duration to 10 seconds (or any desired value)
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION); // Initialize the timer with TIMER_DURATION
  const [score, setScore] = useState(0); // Player score for correct answers
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]); // Start with the first prompt
  const [isGameStarted, setIsGameStarted] = useState(false); // Game start state

  // Timer logic with useEffect
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isGameStarted && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(countdown); // Cleanup timer on component unmount
  }, [isGameStarted, timer]);

  // Function to handle score increment
  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  // Function to handle game start
  const handleGameStart = () => {
    setIsGameStarted(true); // Start the game
  };

  // Function to handle switching to the next player
  const handleNextPlayer = () => {
    setCurrentPlayer((prevPlayer) =>
      prevPlayer < playerCount ? prevPlayer + 1 : 1
    ); // Switch to the next player, wrap around if the last player is done
    setIsGameStarted(false); // Reset game state for the next player
    setTimer(TIMER_DURATION); // Reset the timer to the same value for the next player
    setScore(0); // Optionally reset the score
    // Optionally, change the prompt to the next one
    const nextPromptIndex =
      (prompts.indexOf(currentPrompt) + 1) % prompts.length;
    setCurrentPrompt(prompts[nextPromptIndex]);
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <Text>Current Player: {currentPlayer}</Text>{" "}
        {/* Display current player */}
        <Text>Prompt: {currentPrompt}</Text> {/* Display list prompt */}
        <Text>Time Remaining: {timer}s</Text> {/* Display timer */}
        <Text>Score: {score}</Text> {/* Display player score */}
        {/* Button logic: "Start" before game starts, "✔️" to count correct answers after */}
        <TouchableOpacity
          onPress={isGameStarted ? handleScoreIncrement : handleGameStart}
        >
          <Text style={{ fontSize: 40 }}>
            {isGameStarted ? "✔️" : "Start"}{" "}
            {/* Show "Start" before game starts, then "✔️" */}
          </Text>
        </TouchableOpacity>
        <Text>{isGameStarted ? "Tap for Correct Answer" : "Tap to Start"}</Text>
        {/* Show the "Next Player" button when the timer reaches 0 */}
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
              ➡️ Player {currentPlayer < playerCount ? currentPlayer + 1 : 1}
            </Text>
          </TouchableOpacity>
        )}
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default GameplayContent;
