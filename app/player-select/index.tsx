import React, { useState, useCallback, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { Stack } from "expo-router";
import * as Styled from "@Styles";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings } = useGameplay();

  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playerCount, setPlayerCount] = useState(1);

  // Callback for updating player count
  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayerCount(count);
  }, []);

  // Callback for updating selected mode
  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  // Update game settings when player count or mode changes
  useEffect(() => {
    if (
      gameSettings.playerCount !== playerCount ||
      gameSettings.mode !== selectedMode
    ) {
      setGameSettings({ mode: selectedMode, playerCount });
    }
  }, [selectedMode, playerCount, setGameSettings, gameSettings]);

  const handleGameStart = () => {
    if (playerCount > 0) {
      onGameStart();
    }
  };

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 1)"], // Pulsating glow
  });

  return (
    <Styled.SafeAreaWrapper>
      <Stack.Screen options={{ headerShown: false }} />
      <Styled.Title>{gameSettings.blitzPackTitle}</Styled.Title>
      <Styled.PlayersWrapper>
        <Styled.WheelTitle>
          <FlashingText>Select Players</FlashingText>
        </Styled.WheelTitle>
        <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
        <ModeSelect onModeChange={handleModeChange} mode={selectedMode} />
      </Styled.PlayersWrapper>
      <Styled.StartButton onPress={handleGameStart} disabled={playerCount < 1}>
        <Styled.StartText style={{ textShadowColor: glowInterpolation }}>
          Start
        </Styled.StartText>
      </Styled.StartButton>
    </Styled.SafeAreaWrapper>
  );
};

export default PlayerSelect;
