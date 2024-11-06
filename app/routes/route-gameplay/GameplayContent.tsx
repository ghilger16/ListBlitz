import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./GameplayContent.styled";
import { useGameplay } from "app/context/game-context/GameContext";
import { useGetPromptsByBlitzPack } from "app/services";

const GameplayContent: React.FC = () => {
  const { title, mode, id } = useGlobalSearchParams();
  const router = useRouter();
  const { players, updatePlayerScore } = useGameplay();

  const {
    data: prompts = [], // Default to an empty array if prompts is undefined
    error,
    isLoading,
  } = useGetPromptsByBlitzPack(Number(id));

  const playerCount = players.length;
  const TIMER_DURATION = 10;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Update prompt on index change
  const currentPrompt = prompts[currentPromptIndex]?.promptText || "Loading...";

  // Timer effect for Blitz Mode
  useEffect(() => {
    if (mode === "blitz" && isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [isGameStarted, timer, mode]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
      setAnswersCount((prevCount) => prevCount + 1);
    }
  };

  const handleGameStart = () => {
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

      // Calculate the next prompt index, cycling back to the start if at the end
      setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % prompts.length);
    } else {
      if (mode === "chill") {
        router.push("/");
      } else {
        router.push({
          pathname: "routes/route-results/ResultsContent",
          params: {
            scores: JSON.stringify(players.map((player) => player.score)),
          },
        });
      }
    }
  };

  useEffect(() => {
    if (mode === "chill" && answersCount >= 5) {
      handleNextPlayer();
    }
  }, [answersCount, mode]);

  const handleReturnToLanding = () => {
    router.push("/");
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading prompts.</Text>;

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

      <TouchableOpacity
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
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GameplayContent;
