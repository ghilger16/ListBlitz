import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "@Styles";

import { Prompt, useGetPromptsByBlitzPack } from "services";
import { useGameplay } from "@Context";
import { ChillCounter, PromptDisplay } from "@Components";

const Gameplay: React.FC = () => {
  const { title, mode, id } = useGlobalSearchParams();
  const router = useRouter();
  const { players, updatePlayerScore } = useGameplay();
  const PROMPT_LIMIT = 10;

  // Fetch prompts
  const {
    data: prompts = [],
    error,
    isLoading,
    refetch, // Add refetch to fetch more prompts dynamically
  } = useGetPromptsByBlitzPack(Number(id), PROMPT_LIMIT);

  // State variables
  const playerCount = players.length;
  const TIMER_DURATION = 10;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Track used prompts to avoid repeats within a session
  const [usedPrompts, setUsedPrompts] = useState(new Set());
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);

  // Update prompt on index change
  const currentPrompt =
    availablePrompts[currentPromptIndex]?.promptText || "Loading...";

  // Timer effect for Blitz Mode
  useEffect(() => {
    if (mode === "blitz" && isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isGameStarted, timer, mode]);

  // Filter prompts to remove repeats and add new prompts to available list
  useEffect(() => {
    if (prompts && prompts.length > 0) {
      const newPrompts = prompts.filter(
        (prompt) => !usedPrompts.has(prompt.id) // Filter out repeats
      );

      setAvailablePrompts((prev) => [...prev, ...newPrompts]);

      // Add used prompts to the set
      const updatedUsedPrompts = new Set(usedPrompts);
      newPrompts.forEach((prompt) => updatedUsedPrompts.add(prompt.id));
      setUsedPrompts(updatedUsedPrompts);
    }
  }, [prompts]);

  // Fetch more prompts dynamically when running low
  useEffect(() => {
    if (currentPromptIndex >= availablePrompts.length - 1) {
      refetch(); // Fetch more prompts when nearing the end
    }
  }, [currentPromptIndex, availablePrompts.length, refetch]);

  // Score Increment
  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
      setAnswersCount((prevCount) => prevCount + 1);
    }
  };

  const handleGameStart = () => {
    if (availablePrompts.length === 0) {
      alert("No prompts available. Please try again later.");
      return;
    }
    setIsGameStarted(true);
  };

  const handleNextPlayer = () => {
    updatePlayerScore(currentPlayer, score);

    if (currentPlayer < playerCount) {
      setCurrentPlayer((prevPlayer) => prevPlayer + 1);
      setIsGameStarted(false);
      setTimer(TIMER_DURATION);
      setScore(0);
      setAnswersCount(0);

      // Move to the next prompt, cycling back if needed
      setCurrentPromptIndex((prevIndex) =>
        prevIndex + 1 < availablePrompts.length ? prevIndex + 1 : 0
      );
    } else {
      if (mode === "chill") {
        router.push("/");
      } else {
        router.push({
          pathname: "/results",
          params: {
            scores: JSON.stringify(players.map((player) => player.score)),
          },
        });
      }
    }
  };

  // Auto-advance for Chill Mode
  useEffect(() => {
    if (mode === "chill" && answersCount >= 5) {
      handleNextPlayer();
    }
  }, [answersCount, mode]);

  const handleReturnToLanding = () => {
    router.push("/landing");
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading prompts.</Text>;

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <Styled.Wrapper>
        <Text>Current Player: {players[currentPlayer - 1]?.name}</Text>
        <PromptDisplay prompt={currentPrompt} />
        {mode === "blitz" && <Text>Time Remaining: {timer}s</Text>}
        <Text>Score: {score}</Text>
        <ChillCounter
          isGameStarted={isGameStarted}
          onIncrement={handleScoreIncrement}
          onStart={handleGameStart}
          score={score}
        />
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
      </Styled.Wrapper>

      {/* <TouchableOpacity
        style={{
          backgroundColor: "red",
          padding: 15,
          borderRadius: 10,
          position: "absolute",
          bottom: 20,
          left: 20,
        }}
        onPress={handleReturnToLanding}
      >
        <Text style={{ color: "white", fontSize: 18 }}>Return to Home</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default Gameplay;
