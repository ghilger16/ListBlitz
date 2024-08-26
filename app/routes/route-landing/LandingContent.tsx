import { View, Text, SafeAreaView, ScrollView } from "react-native";

import { Stack } from "expo-router";
import * as Styled from "./LandingContent.styled";
import { PurchasedSection } from "./components/purchased";
import { AlphaBlitzSection } from "./components/alpha-blitz";
import { StoreSection } from "./components/store";

export const LandingContent: React.FC = () => {
  return (
    <Styled.SafeArea>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Styled.HeaderTitle>List Blitz</Styled.HeaderTitle>
          ),
          headerTitleAlign: "center",
        }}
      />
      <ScrollView>
        <PurchasedSection />
        <AlphaBlitzSection />
        <StoreSection />
      </ScrollView>
    </Styled.SafeArea>
  );
};
