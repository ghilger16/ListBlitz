export enum GameMode {
  CHILL = "chill",
  BLITZ = "blitz",
}

export interface GameSettings {
  mode: GameMode;
  blitzPackId?: number;
  blitzPackTitle?: string;
  playerCount?: number;
}

export const COLORS: ReadonlyArray<[string, string]> = [
  ["#FFD700", "#FFA500"],
  ["#87CEEB", "#4682B4"],
  ["#f6c212", "#f4770c"],
  ["#79edc6", "#12ac96"],
  ["#FF6833", "#C8321F"],
  ["#ff6b8b", "#f73759"],
  ["#2cddf1", "#298bde"],
  ["#FFA544", "#FF6F00"],
  ["#84d657", "#4ba22b"],
  ["#fda12a", "#ef2f57"],
];
