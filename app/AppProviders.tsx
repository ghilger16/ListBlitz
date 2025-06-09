import React from "react";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { GameProvider } from "@Context";

const queryClient = new QueryClient();

const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <QueryClientProvider client={queryClient}>
      <GameProvider>{children}</GameProvider>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

export default AppProviders;
