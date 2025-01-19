import React, { useState, useEffect } from "react";
import { TouchableOpacity, Animated } from "react-native"; // Import animation and touchable
import * as Styled from "./ModeSelect.styled"; // Import styled components
import { GameMode, useGameplay } from "@Context"; // Import game context

const MODES = {
  [GameMode.CHILL]: "Chill Mode",
  [GameMode.BLITZ]: "Blitz Mode",
};

const ModeSelect: React.FC = () => {
  const { players, gameSettings, setGameSettings, onGameStart } = useGameplay();
  const hasTooManyPlayers = players.length > 8;

  const fadeAnim = useState(new Animated.Value(0.5))[0];

  useEffect(() => {
    if (!hasTooManyPlayers) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasTooManyPlayers]);

  // 🔹 Function to switch game mode
  const handleModeChange = (newMode: GameMode) => {
    setGameSettings({
      mode: newMode,
    });
  };

  return (
    <Styled.Container>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onGameStart(players.length)}
      >
        <Styled.Circle isActive={gameSettings.mode === GameMode.CHILL}>
          <Styled.ModeText>{MODES[gameSettings.mode]}</Styled.ModeText>

          {!hasTooManyPlayers && (
            <Animated.Text
              style={{
                opacity: fadeAnim,
                fontSize: 14,
                color: "#FFF",
                position: "absolute",
                bottom: -30,
              }}
            >
              {"Tap to Start"}
            </Animated.Text>
          )}
        </Styled.Circle>
      </TouchableOpacity>

      {/* 🔹 Add onPress to switch modes */}
      <Styled.IndicatorContainer>
        {Object.values(GameMode).map((gameMode) => (
          <TouchableOpacity key={gameMode}>
            <Styled.Indicator
              isActive={gameSettings.mode === gameMode}
              onPress={() => handleModeChange(gameMode)}
            />
          </TouchableOpacity>
        ))}
      </Styled.IndicatorContainer>
    </Styled.Container>
  );
};

export default ModeSelect;
