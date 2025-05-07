import React, { createContext, useState, useContext, ReactNode } from "react";

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
  handleNextRound: () => void;
}

// Create Context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider Component
export const GameProvider = ({ children }: { children: ReactNode }) => {
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
      score: null,
      startColor: COLORS[index % COLORS.length][0],
      endColor: COLORS[index % COLORS.length][1],
    }));
    setPlayers(newPlayers);
    setCurrentPlayer(newPlayers[0]); // Ensure this is valid immediately
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
        player.id === currentPlayer.id ? { ...player, score } : player
      )
    );

    const currentIndex = players.findIndex((p) => p.id === currentPlayer.id);
    const nextIndex = (currentIndex + 1) % players.length; // Loops back to 0 when out of range

    setCurrentPlayer(players[nextIndex]);
  };

  // Set Game Settings (Partial Update)
  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
  };

  // Start Game
  const onGameStart = () => {
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
  };

  const handleNextRound = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({ ...player, score: null }))
    );

    if (players.length > 0) {
      setCurrentPlayer(players[0]);
    }
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
        handleNextRound,
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
