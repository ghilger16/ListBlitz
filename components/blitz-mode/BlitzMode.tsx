import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Player, useGameplay } from "@Context";
import { PromptDisplay } from "components/prompt-display";
import * as Styled from "./BlitzMode.styled";
import { BlitzCounter } from "./blitz-counter";
import { ScoreRankings } from "./score-rankings";

interface BlitzModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  players: { id: number; name: string; score: number }[];
  currentPlayer: Player;
}

const TIMER_DURATION = 45;

export const BlitzMode: React.FC<BlitzModeProps> = ({
  currentPrompt,
  handleNextPlayer,
  players,
  currentPlayer,
}) => {
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    if (isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      handleNextPlayer(score);
      setTimer(TIMER_DURATION); // Automatically go to the next player when time is up
    }
  }, [isGameStarted, timer]);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  return (
    <Styled.Wrapper>
      <PromptDisplay
        prompt={currentPrompt}
        playerColor={currentPlayer.startColor}
      />
      <Text
        style={{
          color: "#fff",
          fontFamily: "SourGummy",
          fontSize: 22,
          textAlign: "center",
          marginTop: 15,
        }}
      >
        Player {currentPlayer.id}
      </Text>
      <Styled.CounterContainer>
        <BlitzCounter
          score={score}
          onIncrement={handleScoreIncrement}
          currentPlayer={currentPlayer}
          onStart={() => setIsGameStarted(true)}
          timer={timer}
          isGameStarted={isGameStarted}
        />
        {/* <ScoreRankings players={players} /> */}
      </Styled.CounterContainer>
    </Styled.Wrapper>
  );
};
