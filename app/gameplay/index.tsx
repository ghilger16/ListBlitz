import React, { useState, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Text, SafeAreaView } from "react-native";
import * as Styled from "@Styles";
import { GameMode, useGameplay } from "@Context";
import { Prompt, useGetPromptsByBlitzPack } from "@Services";
import { ChillMode, BlitzMode } from "@Components";

const Gameplay: React.FC = () => {
  const router = useRouter();
  const { players, gameSettings } = useGameplay();
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

  const [currentPlayer, setCurrentPlayer] = useState(1);
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

  const handleNextPlayer = () => {
    if (currentPlayer < players.length) {
      setCurrentPlayer((prev) => prev + 1);
      setCurrentPromptIndex((prev) =>
        prev + 1 < availablePrompts.length ? prev + 1 : 0
      );
    } else {
      router.push({
        pathname: "/results",
        params: {
          scores: JSON.stringify(players.map((player) => player.score)),
        },
      });
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading prompts.</Text>;

  return (
    <Styled.Wrapper>
      <Stack.Screen options={{ headerShown: false }} />
      <Styled.ModeView>
        {mode === GameMode.CHILL ? (
          <ChillMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayer}
            players={players}
            currentPlayer={currentPlayer}
          />
        ) : (
          <BlitzMode
            currentPrompt={currentPrompt}
            handleNextPlayer={handleNextPlayer}
            players={players}
            currentPlayer={currentPlayer}
          />
        )}
      </Styled.ModeView>
    </Styled.Wrapper>
  );
};

export default Gameplay;
