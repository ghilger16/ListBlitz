export enum GameMode {
  CHILL = "chill",
  BLITZ = "blitz",
  BATTLE = "battle",
}

export interface GameSettings {
  mode: GameMode;
  blitzPackId?: number;
  blitzPackTitle?: string;
  playerCount?: number;
}

export interface Player {
  id: number;
  name: string;
  iconIndex: number;
  score: number | null;
  startColor: string;
}

export const PACK_COLORS: ReadonlyArray<[string, string]> = [
  ["#FFD700", "#FFA500"],
  ["#87CEEB", "#4682B4"],
  ["#FF4F2E", "#D62410"],
  ["#79EDC6", "#12AC96"],
  ["#FFA544", "#FF6F00"],
  ["#FFD700", "#FFA500"],
  ["#87CEEB", "#4682B4"],
  ["#FF6833", "#C8321F"],
  ["#79EDC6", "#12AC96"],
  ["#FFA544", "#FF6F00"],
];

export const PLAYER_COLORS: ReadonlyArray<[string, string]> = [
  ["#FF4F2E", "#D62410"],
  ["#79EDC6", "#12AC96"],
  ["#FFA544", "#FF6F00"],
  ["#FFD700", "#FFA500"],
  ["#87CEEB", "#4682B4"],
  ["#FF6833", "#C8321F"],
  ["#79EDC6", "#12AC96"],
  ["#FFA544", "#FF6F00"],
  ["#FFD700", "#FFA500"],
  ["#87CEEB", "#4682B4"],
];
