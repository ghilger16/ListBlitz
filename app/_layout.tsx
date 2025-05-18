import React, { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { Stack, usePathname } from "expo-router";
import { GameProvider } from "@Context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, StatusBar } from "react-native";
import { CustomHeader, SplashScreen } from "@Components";

async function preloadAssets(assets: number[]) {
  return Promise.all(
    assets.map((asset) => Asset.fromModule(asset).downloadAsync())
  );
}

const allAssets = [
  require("@Assets/gifs/header.gif"),
  require("assets/images/blitz-bg.png"),
  require("assets/images/chill-bg.png"),
  require("assets/images/blitz-splash.png"),
  require("assets/images/chill-splash.png"),
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
  // Lottie icon assets
  require("@Assets/lottie/rocket.lottie"),
  require("@Assets/lottie/hot-dog.lottie"),
  require("@Assets/lottie/ice-cream-cone.lottie"),
  require("@Assets/lottie/headphones.lottie"),
  require("@Assets/lottie/robot.lottie"),
  require("@Assets/lottie/sunglasses.lottie"),
  require("@Assets/lottie/controller.lottie"),
  require("@Assets/lottie/dinosaur.lottie"),
  require("@Assets/lottie/star.lottie"),
  require("@Assets/lottie/skateboard.lottie"),
  require("@Assets/lottie/A.lottie"),
  require("@Assets/lottie/B.lottie"),
  require("@Assets/lottie/C.lottie"),
  require("@Assets/lottie/D.lottie"),
  require("@Assets/lottie/E.lottie"),
  require("@Assets/lottie/F.lottie"),
  require("@Assets/lottie/G.lottie"),
  require("@Assets/lottie/H.lottie"),
  require("@Assets/lottie/I.lottie"),
  require("@Assets/lottie/J.lottie"),
  require("@Assets/lottie/K.lottie"),
  require("@Assets/lottie/L.lottie"),
  require("@Assets/lottie/M.lottie"),
  require("@Assets/lottie/N.lottie"),
  require("@Assets/lottie/O.lottie"),
  require("@Assets/lottie/P.lottie"),
  require("@Assets/lottie/Q.lottie"),
  require("@Assets/lottie/R.lottie"),
  require("@Assets/lottie/S.lottie"),
  require("@Assets/lottie/T.lottie"),
  require("@Assets/lottie/U.lottie"),
  require("@Assets/lottie/V.lottie"),
  require("@Assets/lottie/W.lottie"),
  require("@Assets/lottie/X.lottie"),
  require("@Assets/lottie/Y.lottie"),
  require("@Assets/lottie/Z.lottie"),
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
