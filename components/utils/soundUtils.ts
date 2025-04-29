import { Audio } from "expo-av"; // Import Audio from expo-av

export const playSound = async (soundFile: any) => {
  try {
    // Configure audio mode to respect user's music
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false, // Prevents sound from playing in silent mode on iOS
      shouldDuckAndroid: true, // Lowers the volume of other audio on Android
      staysActiveInBackground: false, // Ensures the app doesn't keep audio active in the background
    });

    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    // Optionally unload the sound after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};
