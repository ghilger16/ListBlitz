import { OwnedProvider, useOwnedPacks } from "@Hooks";
import { initPurchases, getEntitlements } from "../purchases/purchases";
import React, { useEffect, useState } from "react";
import { View, StatusBar } from "react-native";

import { Stack, usePathname } from "expo-router";
import { useFonts } from "expo-font";

import {
  DatadogProvider,
  DdRum,
  DdSdkReactNative,
} from "@datadog/mobile-react-native";

import { SplashScreen } from "@Components";
import { usePreloadAssets } from "@Hooks";
import { allAssets, ddConfig, identifyDatadogUser } from "@Utils";
import AppProviders from "./AppProviders";

const containerStyle = { flex: 1 };

const PurchasesBootstrap: React.FC = () => {
  const { setOwned } = useOwnedPacks();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initPurchases();
        const ents = await getEntitlements();
        if (mounted) setOwned(ents);
      } catch (e) {
        console.warn("[PurchasesBootstrap] init failed", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setOwned]);

  return null;
};

const Layout: React.FC = () => {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  const assetsLoaded = usePreloadAssets(allAssets);

  useEffect(() => {
    const initDatadog = async () => {
      try {
        await DdSdkReactNative.initialize(ddConfig);
        identifyDatadogUser();
      } catch (err) {
        console.warn("[Datadog] Initialization failed:", err);
      }
    };

    initDatadog();
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
        <View style={containerStyle}>
          <AppProviders>
            <OwnedProvider>
              <StatusBar hidden />
              <Stack screenOptions={{ animation: "none" }} />
              <PurchasesBootstrap />
            </OwnedProvider>
          </AppProviders>
        </View>
      )}
    </DatadogProvider>
  );
};

export default Layout;
