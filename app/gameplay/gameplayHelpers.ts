import { Player } from "@Context";
import { Asset } from "expo-asset";
import { GameMode } from "@Context";

export const loadBackground = async (
  mode: string,
  setBgUri: (uri: string | null) => void
) => {
  try {
    let module;
    if (mode === GameMode.BLITZ) {
      module = require("assets/images/blitz-bg.png");
    } else if (mode === GameMode.CHILL) {
      module = require("assets/images/chill-bg.png");
    } else if (mode === GameMode.BATTLE) {
      module = require("assets/images/battle-bg.png");
    } else {
      return;
    }
    const [asset] = await Asset.loadAsync([module]);
    setBgUri(asset.localUri);
  } catch (error) {
    console.error("Error loading background image:", error);
  }
};

export const nextPrompt = (
  setCurrentPromptIndex: React.Dispatch<React.SetStateAction<number>>,
  promptsLength: number
) => {
  setCurrentPromptIndex((prev) => (prev + 1) % promptsLength);
};

export const isReady = (
  players: Player[],
  mode: string,
  currentMatch: any,
  blitzPackTitle: string,
  currentPrompt: string,
  bgUri: string | null
) => {
  if (players.length === 0 || bgUri === null) return false;
  if (mode === GameMode.BATTLE) return currentMatch !== null;
  return blitzPackTitle === "Alpha Blitz" || currentPrompt !== "Loading...";
};

// Dummy default export to satisfy import requirements
import React from "react";
const GameplayHelpers = () => null;
export default GameplayHelpers;
