import React, { useState } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";
import { useGameplay } from "app/context/game-context/GameContext";

const PlayersSelectContent: React.FC = () => {
  const { title, id } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();
  const [playerCount, setPlayerCount] = useState<number | null>(null);

  // Handle game start with mode and player count
  const handleGameStart = (mode: string) => {
    if (!playerCount) {
      alert("Please select the number of players.");
      return;
    }

    initializePlayers(playerCount); // Set the number of players in the context
    router.push({
      pathname: "routes/route-gameplay/GameplayContent",
      params: { mode, id }, // Pass mode and other parameters
    });
  };

  // Update player count when selected
  const handlePlayerCount = (count: number) => setPlayerCount(count);

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>

      {/* Player Selection */}
      <Styled.PlayersWrapper>
        <PlayersSelect
          onStartClick={handlePlayerCount}
          onGameStart={handleGameStart} // Pass single game start handler
        />
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default PlayersSelectContent;
