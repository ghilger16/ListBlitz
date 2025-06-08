import React, { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";

import { Stack, usePathname } from "expo-router";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DatadogProvider, DdRum } from "@datadog/mobile-react-native";

import { GameProvider } from "@Context";
import { SplashScreen } from "@Components";
import { usePreloadAssets } from "@Hooks";
import { allAssets, ddConfig, identifyDatadogUser } from "@Utils";

const Layout: React.FC = () => {
  const pathname = usePathname();
  const queryClient = new QueryClient();
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  const assetsLoaded = usePreloadAssets(allAssets);

  useEffect(() => {
    identifyDatadogUser();
  }, []);

  useEffect(() => {
    if (showSplash) {
      DdRum.startView("SplashScreen", "SplashScreen");
    } else {
      DdRum.startView(pathname, pathname);
    }
  }, [showSplash, pathname]);

  return (
    <DatadogProvider configuration={ddConfig}>
      {showSplash ? (
        <>
          <StatusBar hidden />
          <SplashScreen
            backgroundPath="landing"
            isReady={fontsLoaded && assetsLoaded}
            onFinish={() => {
              DdRum.stopView("SplashScreen");
              setShowSplash(false);
            }}
          />
        </>
      ) : (
        <View style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryClientProvider client={queryClient}>
              <GameProvider>
                <StatusBar hidden />
                <Stack screenOptions={{ animation: "none" }} />
              </GameProvider>
            </QueryClientProvider>
          </GestureHandlerRootView>
        </View>
      )}
    </DatadogProvider>
  );
};

export default Layout;
