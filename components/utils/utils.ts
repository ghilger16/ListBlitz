import { tapSound } from "@Assets";
import { Audio } from "expo-av"; // Import Audio from expo-av
import { Asset } from "expo-asset";
import * as Haptics from "expo-haptics";

let soundInstance: Audio.Sound | null = null;

export const playSound = async (soundFile: any, loop: boolean = false) => {
  try {
    // If a sound is already playing, stop and unload it first
    if (soundInstance) {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
      soundInstance = null;
    }

    // Configure audio mode to respect user's settings
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.setIsLoopingAsync(loop);
    soundInstance = sound;
    await sound.playAsync();

    // Unload the sound when it finishes playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        try {
          sound.unloadAsync();
        } catch (error) {
          console.error("Error unloading sound after finish:", error);
        }
        soundInstance = null;
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export const stopSound = async () => {
  if (soundInstance) {
    const soundToStop = soundInstance;
    soundInstance = null;
    try {
      await soundToStop.stopAsync();
    } catch (error) {
      console.error("Error stopping sound:", error);
    }
    try {
      await soundToStop.unloadAsync();
    } catch (error) {
      console.error("Error unloading sound:", error);
    }
  }
};

export const playTapSound = async () => {
  try {
    // Create a new local sound instance for tap sound
    const { sound } = await Audio.Sound.createAsync(tapSound);
    await sound.playAsync();
    await Haptics.selectionAsync();
    // Unload the tap sound when it finishes playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        try {
          sound.unloadAsync();
        } catch (error) {
          console.error("Error unloading tap sound after finish:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error playing tap sound:", error);
  }
};

export const preloadAssets = async (assets: number[]): Promise<void> => {
  const assetPromises = assets.map((asset) =>
    Asset.fromModule(asset).downloadAsync()
  );
  await Promise.all(assetPromises);
};
