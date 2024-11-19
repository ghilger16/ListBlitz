import React from "react";
import { Stack } from "expo-router";
import { GameProvider } from "./context/game-context/GameContext"; // Adjust path as needed
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

const Layout: React.FC = () => {
  const queryClient = new QueryClient();
  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("./assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("./assets/fonts/SourGummy-Italic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <Stack>
          <Stack.Screen
            name="GameplayContent"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="LandingContent" options={{ headerShown: true }} />
        </Stack>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default Layout;
