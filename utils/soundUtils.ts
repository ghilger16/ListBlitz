import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

import { tapSound } from "@Assets";

let isMuted = false;
let soundInstance: Audio.Sound | null = null;

export const setMuted = async (mute: boolean) => {
  isMuted = mute;
  if (soundInstance) {
    try {
      await soundInstance.setIsMutedAsync(isMuted);
    } catch (_) {}
  }
};

const configureAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
    });
  } catch (_) {}
};

const unloadSound = async (sound: Audio.Sound) => {
  try {
    await sound.stopAsync();
  } catch (_) {}
  try {
    await sound.unloadAsync();
  } catch (_) {}
};

export const playSound = async (soundFile: any, loop: boolean = false) => {
  try {
    if (soundInstance) {
      await unloadSound(soundInstance);
      soundInstance = null;
    }
    await configureAudio();
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.setIsLoopingAsync(loop);
    soundInstance = sound;
    await sound.playAsync();
    if (isMuted) {
      try {
        await soundInstance.setIsMutedAsync(true);
      } catch (_) {}
    }
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        unloadSound(sound).catch(() => {});
        soundInstance = null;
      }
    });
  } catch (_) {}
};

export const stopSound = async () => {
  if (soundInstance) {
    const soundToStop = soundInstance;
    soundInstance = null;
    await unloadSound(soundToStop);
  }
};

export const playTapSound = async () => {
  if (isMuted) return;
  try {
    const { sound } = await Audio.Sound.createAsync(tapSound);
    await sound.playAsync();
    await Haptics.selectionAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        unloadSound(sound).catch(() => {});
      }
    });
  } catch (_) {}
};
