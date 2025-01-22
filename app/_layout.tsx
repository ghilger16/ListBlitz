import React from "react";
import { Stack } from "expo-router";
import { GameProvider } from "@Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";

const Layout: React.FC = () => {
  const queryClient = new QueryClient();

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  if (!fontsLoaded) {
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
                contentStyle: { backgroundColor: "#192c43" },
              }}
            />
          </GameProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default Layout;
