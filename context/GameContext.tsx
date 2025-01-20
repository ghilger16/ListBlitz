import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import { GameMode, GameSettings } from "./constants"; // Ensure this contains GameMode enums

// Player Interface
interface Player {
  id: number;
  name: string;
  score: number;
}

// Context Type
interface GameContextType {
  players: Player[];
  gameSettings: GameSettings;
  initializePlayers: (playerCount: number) => void;
  updatePlayerScore: (id: number, score: number) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  onGameStart: () => void; // onGameStart doesn't need to pass players count anymore
}

// Create Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider Component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameSettings, setGameSettingsState] = useState<GameSettings>({
    mode: GameMode.CHILL, // Default mode
    playerCount: 0, // Initialize playersCount
  });

  // Initialize Players
  const initializePlayers = (playerCount: number) => {
    const newPlayers = Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      score: 0,
    }));
    setPlayers(newPlayers);
  };

  // Update Player Score
  const updatePlayerScore = (id: number, score: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, score } : player
      )
    );
  };

  // Set Game Settings (Partial Update)
  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
  };

  // Start Game
  const onGameStart = () => {
    const { playerCount = 0 } = gameSettings; // Get playersCount from gameSettings

    if (playerCount === 0) {
      alert("Please select the number of players.");
      return;
    }

    if (!gameSettings.mode) {
      alert("Please select a game mode.");
      return;
    }

    initializePlayers(playerCount); // Initialize players with the count from gameSettings
    router.push("/gameplay");
  };

  return (
    <GameContext.Provider
      value={{
        players,
        gameSettings,
        initializePlayers,
        updatePlayerScore,
        setGameSettings,
        onGameStart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom Hook
export const useGameplay = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameplay must be used within a GameProvider");
  }
  return context;
};
