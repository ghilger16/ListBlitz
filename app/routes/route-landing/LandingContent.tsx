import { View, Text, SafeAreaView } from "react-native";

import { Stack, useRouter } from "expo-router";
import * as Styled from "./LandingContent.styled";
import { PurchasedSection } from "./components/purchased";

export const LandingContent: React.FC = () => {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerTitle: () => <Styled.HeaderTitle>ListBlitz</Styled.HeaderTitle>,
          headerTitleAlign: "center",
        }}
      />
      <PurchasedSection />
    </SafeAreaView>
  );
};
