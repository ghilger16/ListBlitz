import React, { useState } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";
import { useGameplay } from "app/context/game-context/GameContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const PlayersSelectContent: React.FC = () => {
  const { title, id } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();

  // Handle game start with mode and player count
  const handleGameStart = (mode: string, count: number) => {
    if (!count) {
      alert("Please select the number of players.");
      return;
    } else initializePlayers(count);

    router.push({
      pathname: "routes/route-gameplay/GameplayContent",
      params: { mode, id }, // Pass mode and other parameters
    });
  };

  // Update player count when selected

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>

      {/* Player Selection */}
      <Styled.PlayersWrapper>
        <PlayersSelect
          onGameStart={handleGameStart} // Pass single game start handler
        />
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default PlayersSelectContent;
