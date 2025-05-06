import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GameMode, useGameplay } from "@Context";
import { Prompt, useGetPromptsByBlitzPack } from "@Services";
import { ChillMode, BlitzMode } from "@Components";

const Gameplay: React.FC = () => {
  const router = useRouter();
  const {
    players,
    currentPlayer,
    gameSettings,
    handleNextPlayer,
    handleNextRound,
  } = useGameplay();

  const { mode, blitzPackId } = gameSettings;
  const PROMPT_LIMIT = 10;

  if (!blitzPackId) {
    return (
      <SafeAreaView>
        <Text>Error: No Blitz Pack Selected.</Text>
      </SafeAreaView>
    );
  }

  const {
    data: prompts = [],
    isLoading,
    error,
    refetch,
  } = useGetPromptsByBlitzPack(blitzPackId, PROMPT_LIMIT);

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [usedPrompts, setUsedPrompts] = useState(new Set());
  const [availablePrompts, setAvailablePrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (prompts.length > 0) {
      const newPrompts = prompts.filter(
        (prompt) => !usedPrompts.has(prompt.id)
      );
      setAvailablePrompts((prev) => [...prev, ...newPrompts]);
      const updatedUsedPrompts = new Set(usedPrompts);
      newPrompts.forEach((prompt) => updatedUsedPrompts.add(prompt.id));
      setUsedPrompts(updatedUsedPrompts);
    }
  }, [prompts]);

  useEffect(() => {
    if (currentPromptIndex >= availablePrompts.length - 1) {
      refetch();
    }
  }, [currentPromptIndex]);

  const currentPrompt =
    availablePrompts[currentPromptIndex]?.promptText || "Loading...";

  const handleNextPlayerAndPrompt = (score: number) => {
    handleNextPlayer(score);
    setCurrentPromptIndex(
      (prevIndex) => (prevIndex + 1) % availablePrompts.length
    );
  };

  if (isLoading || !currentPlayer) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading prompts.</Text>;

  return (
    <SafeAreaView style={styles.wrapper}>
      <Stack.Screen
        options={{
          animation: "none",
          headerTitle: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 20, color: "#fff", fontWeight: "700" }}>
                ←
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.modeView}>
        {mode === GameMode.CHILL ? (
          <ChillMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            currentPlayer={currentPlayer}
            players={players}
          />
        ) : (
          <BlitzMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            players={players}
            currentPlayer={currentPlayer}
            handleNextRound={handleNextRound}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  modeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
});

export default Gameplay;
