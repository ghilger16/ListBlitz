import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { GameProvider } from "@Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, Image } from "react-native";

const headerGif = require("@Assets/gifs/header.gif");

const Layout: React.FC = () => {
  console.log("Layout");
  const queryClient = new QueryClient();
  const [gifLoaded, setGifLoaded] = useState(false);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  useEffect(() => {
    async function loadGif() {
      try {
        const assetSource = Image.resolveAssetSource(headerGif).uri;
        await Image.prefetch(assetSource);
        setGifLoaded(true); // ✅ Only show GIF after it’s loaded
      } catch (error) {
        console.error("Error preloading GIF:", error);
      }
    }
    loadGif();
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
    <View style={{ flex: 1, backgroundColor: "#192c43" }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <GameProvider>
            <Stack
              screenOptions={{
                animation: "none",
                contentStyle: {
                  backgroundColor: "#192c43",
                },
              }}
            />
          </GameProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default Layout;
