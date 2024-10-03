import React, { useState, useEffect } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";

import * as Styled from "./GameplayContent.styled"; // Assuming your styled components are already set

const prompts = [
  "List famous bands from the 70's",
  "Name popular programming languages",
  "List U.S. Presidents",
]; // Hardcoded prompts for now

const GameplayContent: React.FC = () => {
  const { title, playerCount: playerCountParam } = useGlobalSearchParams();
  const router = useRouter();

  const playerCount = Number(playerCountParam) || 1;
  const TIMER_DURATION = 10;
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState<number[]>(Array(playerCount).fill(0));
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (isGameStarted && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [isGameStarted, timer]);

  useEffect(() => {
    if (currentPlayer > playerCount) router.push("/results");
  }, [currentPlayer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleGameStart = () => {
    setIsGameStarted(true);
  };

  const handleNextPlayer = () => {
    setScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[currentPlayer - 1] = score;
      return newScores;
    });

    if (currentPlayer < playerCount) {
      setCurrentPlayer((prevPlayer) => prevPlayer + 1);
      setIsGameStarted(false);
      setTimer(TIMER_DURATION);
      setScore(0);

      const nextPromptIndex =
        (prompts.indexOf(currentPrompt) + 1) % prompts.length;
      setCurrentPrompt(prompts[nextPromptIndex]);
    } else {
      router.push("routes/route-results/ResultsContent");
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <Text>Current Player: {currentPlayer}</Text>
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
            onPress={
              currentPlayer < playerCount
                ? handleNextPlayer
                : () =>
                    router.push({
                      pathname: "routes/route-results/ResultsContent",
                      params: { scores: JSON.stringify(scores) },
                    })
            }
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
