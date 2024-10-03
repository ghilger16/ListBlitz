import { Stack } from "expo-router";
import { GameProvider } from "./context/game-context/GameContext"; // Adjust path as needed

const Layout: React.FC = () => {
  return (
    <GameProvider>
      <Stack>
        <Stack.Screen name="GameplayContent" options={{ headerShown: false }} />
        <Stack.Screen name="LandingContent" options={{ headerShown: true }} />
      </Stack>
    </GameProvider>
  );
};

export default Layout;
