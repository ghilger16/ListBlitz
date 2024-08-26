import { Stack } from "expo-router";

const Layout: React.FC = () => {
  return (
    <Stack>
      <Stack.Screen name="GameplayContent" options={{ headerShown: false }} />
      <Stack.Screen name="LandingContent" options={{ headerShown: true }} />
    </Stack>
  );
};

export default Layout;
