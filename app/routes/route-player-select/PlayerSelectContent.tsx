import React, { useState } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";
import { useGameplay } from "app/context/game-context/GameContext";

const PlayersSelectContent: React.FC = () => {
  const { title } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();
  const [playerCount, setPlayerCount] = useState<number | null>(null); // Store selected player count
  const [selectedMode, setSelectedMode] = useState<string | null>(null); // Store selected mode

  // Handle player count selection
  const handlePlayerCount = (count: number) => {
    setPlayerCount(count);
    initializePlayers(count); // Initialize players when the player count is selected
  };

  // Handle mode selection
  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
  };

  // Handle start game logic when both mode and player count are selected
  const handleStartGame = () => {
    if (playerCount && selectedMode) {
      router.push({
        pathname: "routes/route-gameplay/GameplayContent",
        params: { mode: selectedMode }, // Pass the selected mode as a parameter
      });
    } else {
      // Show an alert if either the player count or mode is not selected
      alert("Please select both player count and mode to start the game");
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>

      {/* Player Selection */}
      <Styled.PlayersWrapper>
        <PlayersSelect onStartClick={handlePlayerCount} />
      </Styled.PlayersWrapper>

      {/* Mode Selection */}
      <View>
        <Styled.Title>Select Your Mode</Styled.Title>
        <TouchableOpacity
          style={{
            backgroundColor: selectedMode === "blitz" ? "lightblue" : "white",
            padding: 10,
            marginVertical: 10,
          }}
          onPress={() => handleModeSelect("blitz")}
        >
          <Text style={{ fontSize: 30 }}>Blitz Mode (Timed)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: selectedMode === "chill" ? "lightblue" : "white",
            padding: 10,
            marginVertical: 10,
          }}
          onPress={() => handleModeSelect("chill")}
        >
          <Text style={{ fontSize: 30 }}>Chill Mode (Untimed)</Text>
        </TouchableOpacity>
      </View>

      {/* Start Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 20,
          marginTop: 20,
          borderRadius: 10,
        }}
        onPress={handleStartGame}
      >
        <Text style={{ fontSize: 30, color: "white", textAlign: "center" }}>
          Start Game
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PlayersSelectContent;
