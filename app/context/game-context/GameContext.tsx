import React, { createContext, useState, useContext, ReactNode } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface GameContextType {
  players: Player[];
  initializePlayers: (playerCount: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const initializePlayers = (playerCount: number) => {
    const newPlayers = Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`, // Default player names
      score: 0,
    }));
    setPlayers(newPlayers);
  };

  return (
    <GameContext.Provider value={{ players, initializePlayers }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameplay = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameplay must be used within a GameplayProvider");
  }
  return context;
};
