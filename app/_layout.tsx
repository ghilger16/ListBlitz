import { OwnedProvider, useOwnedPacks, useAssetsReady } from "@Hooks";
import { initPurchases, getEntitlements } from "../purchases/purchases";
import React, { useEffect, useState, useRef } from "react";
import { View, StatusBar } from "react-native";

import { Stack, usePathname } from "expo-router";
import { useFonts } from "expo-font";

import {
  DatadogProvider,
  DdRum,
  DdSdkReactNative,
} from "@datadog/mobile-react-native";

import { SplashScreen } from "@Components";
import { ddConfig, identifyDatadogUser } from "@Utils";
import AppProviders from "./AppProviders";

const containerStyle = { flex: 1 };

const PurchasesBootstrap: React.FC = () => {
  const { setOwned } = useOwnedPacks();

  const ranRef = useRef(false);
  useEffect(() => {
    if (ranRef.current) return; // avoid hot-reload / remount double-run
    ranRef.current = true;

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
  }, []); // run once on mount only

  return null;
};

const Layout: React.FC = () => {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    LuckiestGuy: require("@Assets/fonts/LuckiestGuy-Regular.ttf"),
    SourGummy: require("@Assets/fonts/SourGummy-Italic.ttf"),
  });

  const assetsLoaded = useAssetsReady();

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
