// /context/GameContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";

import { COLORS, GameMode, GameSettings, Player } from "./constants";

interface GameContextType {
  players: Player[];
  currentPlayer: Player;
  gameSettings: GameSettings;
  initializePlayers: (players: { id: number; iconIndex: number }[]) => void;
  updatePlayerScore: (id: number, score: number) => void;
  setGameSettings: (settings: Partial<GameSettings>) => void;
  onGameStart: () => void;
  handleNextPlayer: (score: number) => void;
  handleNextRound: () => void;
  currentMatch: Player[] | null;
  matches: Player[][];
  currentMatchIndex: number;
  setupBattleMode: () => void;
  startNextMatch: () => void;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;
  advanceBattleMatch: (winner: Player) => void;
  handleBattleTimeout: (winner: Player) => void;
  totalMatches: number;
  getMatchLabel: (index: number, total: number) => string;
  globalMatchIndex: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({} as Player);
  const [gameSettings, setGameSettingsState] = useState<GameSettings>({
    mode: GameMode.BLITZ,
    playerCount: 0,
  });

  const [matches, setMatches] = useState<Player[][]>([]);
  const [currentMatch, setCurrentMatch] = useState<Player[] | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const [globalMatchIndex, setGlobalMatchIndex] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);

  const initializePlayers = (
    playersData: { id: number; iconIndex: number }[]
  ) => {
    const newPlayers = playersData.map((data, index) => ({
      id: data.id,
      name: `Player ${data.id}`,
      score: null,
      startColor: COLORS[data.iconIndex][0],

      iconIndex: data.iconIndex,
    }));
    setPlayers(newPlayers);
    setCurrentPlayer(newPlayers[0]);
  };

  const updatePlayerScore = (id: number, score: number) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === id ? { ...player, score } : player
      )
    );
  };

  const handleNextPlayer = (score: number) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.id === currentPlayer.id ? { ...player, score } : player
      );

      const currentIndex = updatedPlayers.findIndex(
        (p) => p.id === currentPlayer.id
      );
      const nextIndex = (currentIndex + 1) % updatedPlayers.length;

      setCurrentPlayer(updatedPlayers[nextIndex]);
      return updatedPlayers;
    });
  };

  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
  };

  const setupBattleMode = () => {
    const matches: Player[][] = [];
    const playerCount = players.length;

    for (let i = 0; i < playerCount; i += 2) {
      const pair = [players[i]];
      if (players[i + 1]) {
        pair.push(players[i + 1]);
      }
      matches.push(pair);
    }

    while (matches.length < playerCount - 1) {
      matches.push([]);
    }

    setMatches(matches);
    setCurrentMatch(matches[0] ?? null);
    setCurrentMatchIndex(0);
    setGlobalMatchIndex(1);
  };

  const advanceBattleMatch = (winner: Player) => {
    setMatches((prevMatches) => {
      const updated = [...prevMatches];

      for (let i = 0; i < updated.length; i++) {
        if (updated[i].length < 2) {
          updated[i].push(winner);

          for (let j = 0; j < updated.length; j++) {
            if (updated[j].length === 2 && j > currentMatchIndex) {
              setCurrentMatch(updated[j]);
              setCurrentMatchIndex(j);
              break;
            }
          }

          break;
        }
      }

      return updated;
    });

    setGlobalMatchIndex((prev) => prev + 1);
  };

  const handleBattleTimeout = (winner: Player) => {
    advanceBattleMatch(winner);
  };

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
  };

  const handleNextRound = () => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({ ...player, score: null }))
    );
    if (players.length > 0) {
      setCurrentPlayer(players[0]);
    }

    setMatches([]);
    setCurrentMatch(null);
    setCurrentMatchIndex(0);
  };

  const totalMatchesMemo = useMemo(() => {
    return matches.length;
  }, [matches]);

  const getMatchLabel = (globalIndex: number, total: number) => {
    if (total === 0) return "";
    if (globalIndex === total) return `Final Match`;
    if (total >= 7 && globalIndex === total - 2)
      return `Semifinal — Match ${globalIndex} of ${total}`;
    if (total >= 7 && globalIndex >= total - 4)
      return `Quarterfinal — Match ${globalIndex} of ${total}`;
    return `Match ${globalIndex} of ${total}`;
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
        matches,
        currentMatch,
        currentMatchIndex,
        setupBattleMode,
        startNextMatch: () => {},
        hasStarted,
        setHasStarted,
        handleBattleTimeout,
        advanceBattleMatch,
        totalMatches: totalMatchesMemo,
        getMatchLabel,
        globalMatchIndex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameplay = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameplay must be used within a GameProvider");
  }
  return context;
};
