import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";

import { GameMode, useGameplay } from "@Context";
import { Prompt, useGetPromptsByBlitzPack } from "@Services";
import { ChillMode, BlitzMode } from "@Components";

const Gameplay: React.FC = () => {
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
      <View style={styles.modeView}>
        {mode === GameMode.CHILL ? (
          <ChillMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            currentPlayer={currentPlayer}
            players={players}
            packTitle={gameSettings.blitzPackTitle || ""}
          />
        ) : (
          <BlitzMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayerAndPrompt}
            players={players}
            currentPlayer={currentPlayer}
            handleNextRound={handleNextRound}
            packTitle={gameSettings.blitzPackTitle || ""}
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
