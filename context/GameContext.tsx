import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from "react";

import { DdRum } from "@datadog/mobile-react-native";

import { RumActionType } from "@datadog/mobile-react-native";

const CUSTOM_ACTION = RumActionType.CUSTOM;

import { PLAYER_COLORS, GameMode, GameSettings, Player } from "./constants";

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

// --- Internal hooks ---

const usePlayerManagement = (
  PLAYER_COLORS: ReadonlyArray<readonly [string, string]>
) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({} as Player);

  const initializePlayers = (
    playersData: { id: number; iconIndex: number }[]
  ) => {
    const newPlayers = playersData.map((data) => ({
      id: data.id,
      name: `Player ${data.id}`,
      score: null,
      startColor: PLAYER_COLORS[data.iconIndex][0],
      iconIndex: data.iconIndex,
    }));
    setPlayers(newPlayers);
    DdRum.addAction(CUSTOM_ACTION, "Initialize Players", {
      playerCount: newPlayers.length,
    });
    setCurrentPlayer(newPlayers[0]);
  };

  const updatePlayerScore = (id: number, score: number) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === id ? { ...player, score } : player))
    );
  };

  const handleNextPlayer = (score: number) => {
    setPlayers((prevPlayers) => {
      const updated = prevPlayers.map((p) =>
        p.id === currentPlayer.id ? { ...p, score } : p
      );
      DdRum.addAction(CUSTOM_ACTION, "Next Player", {
        playerId: currentPlayer.id,
        score,
      });
      const currentIndex = updated.findIndex((p) => p.id === currentPlayer.id);
      setCurrentPlayer(updated[(currentIndex + 1) % updated.length]);
      return updated;
    });
  };

  const handleNextRound = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, score: null })));
    DdRum.addAction(CUSTOM_ACTION, "Next Round");
    setCurrentPlayer((prev) => players[0]);
  };

  return {
    players,
    currentPlayer,
    initializePlayers,
    updatePlayerScore,
    handleNextPlayer,
    handleNextRound,
    setPlayers,
    setCurrentPlayer,
  };
};

const useGameSettings = () => {
  const [gameSettings, setGameSettingsState] = useState<GameSettings>({
    mode: GameMode.BLITZ,
    playerCount: 0,
  });

  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
    DdRum.addAction(CUSTOM_ACTION, "Set Game Settings", settings);
  };

  const onGameStart = (playerCount: number, mode?: GameMode) => {
    if (playerCount === 0) alert("Please select the number of players.");
    if (!mode) alert("Please select a game mode.");
    DdRum.addAction(CUSTOM_ACTION, "Game Start", { playerCount, mode });
  };

  return { gameSettings, setGameSettings, onGameStart };
};

const useBattleMode = (players: Player[]) => {
  const [matches, setMatches] = useState<Player[][]>([]);
  const [currentMatch, setCurrentMatch] = useState<Player[] | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [globalMatchIndex, setGlobalMatchIndex] = useState(1);

  const setupBattleMode = () => {
    const matches: Player[][] = [];
    for (let i = 0; i < players.length; i += 2) {
      const pair = [players[i]];
      if (players[i + 1]) pair.push(players[i + 1]);
      matches.push(pair);
    }
    while (matches.length < players.length - 1) {
      matches.push([]);
    }
    setMatches(matches);
    setCurrentMatch(matches[0] ?? null);
    setCurrentMatchIndex(0);
    setGlobalMatchIndex(1);
  };

  const advanceBattleMatch = (winner: Player) => {
    setMatches((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        if (updated[i].length < 2) {
          updated[i].push(winner);
          DdRum.addAction(CUSTOM_ACTION, "Advance Battle Match", {
            winnerId: winner.id,
          });
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
    DdRum.addAction(CUSTOM_ACTION, "Battle Timeout", {
      winnerId: winner.id,
    });
    advanceBattleMatch(winner);
  };

  const totalMatches = useMemo(() => matches.length, [matches]);

  const getMatchLabel = (globalIndex: number, total: number) => {
    if (players.length === 2) return "";
    if (total === 0) return "";

    const current = matches[globalIndex - 1] ?? [];

    const hasAdvancedPlayer = current.some(
      (p) =>
        matches.findIndex(
          (match, index) => index < globalIndex - 1 && match.includes(p)
        ) !== -1
    );

    if (globalIndex === total) return `Final Match`;
    if (total >= 7 && globalIndex === total - 2 && hasAdvancedPlayer)
      return `Semifinal`;
    if (total >= 7 && globalIndex >= total - 4 && hasAdvancedPlayer)
      return `Quarterfinal`;

    return `Match ${globalIndex} of ${total}`;
  };

  return {
    matches,
    currentMatch,
    currentMatchIndex,
    setupBattleMode,
    advanceBattleMatch,
    handleBattleTimeout,
    totalMatches,
    getMatchLabel,
    globalMatchIndex,
  };
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [hasStarted, setHasStarted] = useState(false);

  // Player management
  const {
    players,
    currentPlayer,
    initializePlayers,
    updatePlayerScore,
    handleNextPlayer,
    handleNextRound,
  } = usePlayerManagement(PLAYER_COLORS);

  // Game settings
  const { gameSettings, setGameSettings, onGameStart } = useGameSettings();

  // Battle mode
  const {
    matches,
    currentMatch,
    currentMatchIndex,
    setupBattleMode,
    advanceBattleMatch,
    handleBattleTimeout,
    totalMatches,
    getMatchLabel,
    globalMatchIndex,
  } = useBattleMode(players);

  return (
    <GameContext.Provider
      value={{
        players,
        currentPlayer,
        gameSettings,
        initializePlayers,
        updatePlayerScore,
        setGameSettings,
        onGameStart: () =>
          onGameStart(
            gameSettings.playerCount ?? 0,
            gameSettings.mode ?? GameMode.BLITZ
          ),
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
        totalMatches,
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
