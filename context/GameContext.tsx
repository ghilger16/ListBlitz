import React, { createContext, useState, useContext, ReactNode } from "react";
import { useRouter } from "expo-router";
import { COLORS, GameMode, GameSettings, Player } from "./constants"; // Ensure this contains GameMode enums

// Context Type
interface GameContextType {
  players: Player[];
  currentPlayer: Player;
  gameSettings: GameSettings;
  initializePlayers: (playerCount: number) => void;
  updatePlayerScore: (id: number, score: number) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  onGameStart: () => void;
  handleNextPlayer: (score: number) => void;
}

// Create Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider Component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({} as Player);
  const [gameSettings, setGameSettingsState] = useState<GameSettings>({
    mode: GameMode.CHILL, // Default mode
    playerCount: 0,
  });

  // Initialize Players
  const initializePlayers = (playerCount: number) => {
    const newPlayers = Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      score: 0,
      startColor: COLORS[index % COLORS.length][0], // Assign Start Color
      endColor: COLORS[index % COLORS.length][1], // Assign a cyclic color
    }));
    setPlayers(newPlayers);
    setCurrentPlayer(newPlayers[0]); // ✅ Set the first player as the current player
  };
  // Update Player Score
  const updatePlayerScore = (id: number, score: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, score } : player
      )
    );
  };

  // Move to the next player, updating their score before switching
  const handleNextPlayer = (score: number) => {
    // Update the current player's score
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === currentPlayer?.id ? { ...player, score } : player
      )
    );

    // Find the next player's index
    const currentIndex = players.findIndex((p) => p.id === currentPlayer?.id);
    const nextIndex = currentIndex + 1;

    console.log("🚀 ~ handleNextPlayer ~ nextIndex:", nextIndex);

    if (nextIndex === gameSettings.playerCount) {
      console.log("hit");
      // If all players have played, reset the game with the same player count
      initializePlayers(gameSettings.playerCount);
    } else {
      // Move to the next player
      setCurrentPlayer(players[nextIndex]);
    }
  };

  // Set Game Settings (Partial Update)
  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
  };

  // Start Game
  const onGameStart = () => {
    console.log("playerCount in gameSettings:", gameSettings.playerCount); // Debugging log

    const playerCount = gameSettings.playerCount ?? 0;

    if (playerCount === 0) {
      alert("Please select the number of players.");
      return;
    }

    if (!gameSettings.mode) {
      alert("Please select a game mode.");
      return;
    }

    initializePlayers(playerCount);
    router.push("/gameplay");
  };

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayer,
        gameSettings,
        initializePlayers,
        updatePlayerScore,
        setGameSettings,
        onGameStart,
        handleNextPlayer,
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
