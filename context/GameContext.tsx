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
  initializePlayers: (playerCount: number) => void;
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
    mode: GameMode.CHILL,
    playerCount: 0,
  });

  const [matches, setMatches] = useState<Player[][]>([]);
  const [currentMatch, setCurrentMatch] = useState<Player[] | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const [globalMatchIndex, setGlobalMatchIndex] = useState(1);
  const [totalMatches, setTotalMatches] = useState(0);

  const initializePlayers = (playerCount: number) => {
    const newPlayers = Array.from({ length: playerCount }, (_, index) => ({
      id: index + 1,
      name: `Player ${index + 1}`,
      score: null,
      startColor: COLORS[index % COLORS.length][0],
      endColor: COLORS[index % COLORS.length][1],
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

    // Create initial match pairs
    for (let i = 0; i < playerCount; i += 2) {
      const pair: Player[] = [players[i]];
      if (players[i + 1]) {
        pair.push(players[i + 1]);
      }
      matches.push(pair);
    }

    // Ensure total matches = players - 1
    while (matches.length < playerCount - 1) {
      matches.push([]);
    }

    setMatches(matches);
    setCurrentMatch(matches[0] ?? null);
    setCurrentMatchIndex(0);
    setGlobalMatchIndex(1);
  };
  console.log("matches:", matches);
  const advanceBattleMatch = (winner: Player) => {
    console.log("Advancing match with winner:", winner);

    setMatches((prevMatches) => {
      const updated = [...prevMatches];
      const current = updated[currentMatchIndex];

      // Decide where to place the winner
      const nextMatchIndex = (() => {
        // if currentMatchIndex is 0 and Match 3 has 1 player, insert to Match 3
        if (
          currentMatchIndex === 0 &&
          updated.length > 2 &&
          updated[2].length === 1
        ) {
          return 2;
        }

        // If Match 3 has 2 players now, insert to final
        if (
          currentMatchIndex === 2 &&
          updated.length > 3 &&
          updated[3].length < 2
        ) {
          return 3;
        }

        // After Match 1 and 2 are done, send to final
        if (
          (currentMatchIndex === 0 || currentMatchIndex === 1) &&
          updated[3].length < 2
        ) {
          return 3;
        }

        return -1;
      })();

      if (nextMatchIndex >= 0 && updated[nextMatchIndex].length < 2) {
        updated[nextMatchIndex].push(winner);
      }

      return updated;
    });

    setCurrentMatchIndex((prevIndex) => {
      const updated = [...matches];

      // Move to next match with 2 players
      for (let i = prevIndex + 1; i < updated.length; i++) {
        if (updated[i].length === 2) {
          setCurrentMatch(updated[i]);
          return i;
        }
      }

      return prevIndex;
    });

    setGlobalMatchIndex((prev) => prev + 1);
  };

  const handleBattleTimeout = (winner: Player) => {
    if (globalMatchIndex === totalMatches) {
      return;
    }

    setMatches((prevMatches) => {
      const updated = [...prevMatches];
      const finalMatch = updated[updated.length - 1];

      if (finalMatch.length < 2) {
        finalMatch.push(winner);
      }

      return updated;
    });

    setCurrentMatchIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      const nextMatch = matches[nextIndex] ?? null;
      const finalMatch = matches[matches.length - 1];

      if (finalMatch.length === 2) {
        setCurrentMatch(finalMatch);
        return matches.length - 1;
      }

      setCurrentMatch(nextMatch);
      return nextIndex;
    });

    setGlobalMatchIndex((prev) => prev + 1);
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

    initializePlayers(playerCount);
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
    if (globalIndex === total - 1 && total > 3)
      return `Semifinal — Match ${globalIndex} of ${total}`;
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
