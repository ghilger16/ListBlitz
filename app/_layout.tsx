import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { Stack, usePathname } from "expo-router";
import { GameProvider } from "@Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, StatusBar } from "react-native";

const headerGif = require("@Assets/gifs/header.gif");
const backgroundImage = require("assets/images/blitz-bg.png");

const Layout: React.FC = () => {
  const pathname = usePathname();
  const queryClient = new QueryClient();
  const [gifLoaded, setGifLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  useEffect(() => {
    async function preloadAssets() {
      try {
        const gifAsset = Asset.fromModule(headerGif);
        const bgAsset = Asset.fromModule(backgroundImage);
        await Promise.all([gifAsset.downloadAsync(), bgAsset.downloadAsync()]);
        setGifLoaded(true); // ✅ Only show after all assets are loaded
      } catch (error) {
        console.error("Error preloading assets:", error);
      }
    }
    preloadAssets();
  }, []);

  if (!fontsLoaded || !gifLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#192c43",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <GameProvider>
            <StatusBar hidden />
            <Stack
              screenOptions={{
                animation: "none",
              }}
            />
          </GameProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default Layout;
