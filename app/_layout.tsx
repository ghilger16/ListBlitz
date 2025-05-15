import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { Stack, usePathname } from "expo-router";
import { GameProvider } from "@Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StatusBar } from "react-native";
import { SplashScreen, preloadAssets } from "@Components";

const allAssets = [
  require("@Assets/gifs/header.gif"),
  require("assets/images/blitz-bg.png"),
  require("assets/images/blitz-splash.png"),
  require("@Assets/icons/category-chaos.png"),
  require("@Assets/icons/category-chaos-title.png"),
  require("@Assets/icons/snack-attack.png"),
  require("@Assets/icons/snack-attack-title.png"),
  require("@Assets/icons/alpha-blitz.png"),
  require("@Assets/icons/alpha-blitz-title.png"),
  require("@Assets/icons/big-screen-blitz.png"),
  require("@Assets/icons/big-screen-blitz-title.png"),
  require("@Assets/icons/the-thing-is.png"),
  require("@Assets/icons/the-thing-is-title.png"),
];

const Layout: React.FC = () => {
  const pathname = usePathname();
  const queryClient = new QueryClient();
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  useEffect(() => {
    async function load() {
      try {
        await preloadAssets(allAssets);
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error preloading assets:", error);
      }
    }
    load();
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar hidden />
        <SplashScreen
          backgroundPath="landing"
          isReady={fontsLoaded && assetsLoaded}
          onFinish={() => setShowSplash(false)}
        />
      </>
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
