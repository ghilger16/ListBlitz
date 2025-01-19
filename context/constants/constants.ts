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
  ["#f6c212", "#f4770c"],
  ["#2cddf1", "#298bde"],
  ["#ff6b8b", "#f73759"],
  ["#3de2df", "#2391d5"],
  ["#79edc6", "#12ac96"],
  ["#fda12a", "#ef2f57"],
];
