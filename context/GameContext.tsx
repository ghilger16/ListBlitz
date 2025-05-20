import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

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
  currentMatch: Player[] | null;
  bracketQueue: Player[][];
  setBattleWinner: (winner: Player) => void;
  currentWinners: Player[];
  currentMatchIndex: number;
  setupBattleMode: () => void;
  startNextMatch: () => void;
  hasStarted: boolean;
  setHasStarted: (started: boolean) => void;
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

  const [bracketQueue, setBracketQueue] = useState<Player[][]>([]);
  const [currentMatch, setCurrentMatch] = useState<Player[] | null>(null);
  const [currentWinners, setCurrentWinners] = useState<Player[]>([]);
  console.log("🚀 ~ GameProvider ~ currentWinners:", currentWinners);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const [hasStarted, setHasStarted] = useState(false);

  const currentMatchIndexRef = React.useRef(0);

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
    setPlayers((prevPlayers) => {
      const updatedPlayers = prevPlayers.map((player) =>
        player.id === currentPlayer.id ? { ...player, score } : player
      );

      const currentIndex = updatedPlayers.findIndex(
        (p) => p.id === currentPlayer.id
      );
      const nextIndex = (currentIndex + 1) % updatedPlayers.length;

      // Move currentPlayer here to ensure it's synced with updated players
      setCurrentPlayer(updatedPlayers[nextIndex]);

      return updatedPlayers;
    });
  };

  // Set Game Settings (Partial Update)
  const setGameSettings = (settings: Partial<GameSettings>) => {
    setGameSettingsState((prev) => ({ ...prev, ...settings }));
  };

  const setupBattleMode = () => {
    const matches: Player[][] = [];

    for (let i = 0; i < players.length; i += 2) {
      const pair = [players[i]];
      if (players[i + 1]) pair.push(players[i + 1]);
      matches.push(pair);
    }

    setBracketQueue(matches);
    setCurrentMatchIndex(0);
    currentMatchIndexRef.current = 0;
    setCurrentMatch(matches[0] ?? null); // Immediately assign the first match
    setCurrentWinners([]);
  };

  const startNextMatch = () => {
    const nextMatchIndex = currentMatchIndexRef.current + 1;

    if (nextMatchIndex < bracketQueue.length) {
      setCurrentMatch(bracketQueue[nextMatchIndex]);
      setCurrentMatchIndex(nextMatchIndex);
      currentMatchIndexRef.current = nextMatchIndex;
    } else {
      // All matches in this round are done — don't auto advance.
      setCurrentMatch(null);
    }
  };

  const setBattleWinner = (winner: Player) => {
    const nextMatchIndex = currentMatchIndexRef.current + 1;
    const updatedWinners = [...currentWinners, winner];

    if (nextMatchIndex < bracketQueue.length) {
      setCurrentWinners(updatedWinners);
      setCurrentMatch(bracketQueue[nextMatchIndex]);
      setCurrentMatchIndex(nextMatchIndex);
      currentMatchIndexRef.current = nextMatchIndex;
    } else {
      if (updatedWinners.length === 1) {
        setCurrentMatch(null);
        setCurrentWinners(updatedWinners);
        return;
      }

      const nextRound: Player[][] = [];
      for (let i = 0; i < updatedWinners.length; i += 2) {
        const pair = [updatedWinners[i]];
        if (updatedWinners[i + 1]) pair.push(updatedWinners[i + 1]);
        nextRound.push(pair);
      }

      setBracketQueue(nextRound);
      setCurrentMatch(nextRound[0]);
      setCurrentMatchIndex(0);
      currentMatchIndexRef.current = 0;
      setCurrentWinners([]);
    }
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

    setBracketQueue([]);
    setCurrentMatch(null);
    setCurrentMatchIndex(0);
    currentMatchIndexRef.current = 0;
    setCurrentWinners([]);
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
        bracketQueue,
        currentMatch,
        setBattleWinner,
        currentWinners,
        currentMatchIndex,
        setupBattleMode,
        startNextMatch,
        hasStarted,
        setHasStarted,
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
