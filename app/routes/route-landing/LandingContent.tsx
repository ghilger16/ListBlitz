import React from "react";
import { Text, ScrollView, ActivityIndicator } from "react-native";

import { Stack } from "expo-router";
import { PurchasedSection } from "./components/purchased";
import { AlphaBlitzSection } from "./components/alpha-blitz";
import { StoreSection } from "./components/store";
import { useGetBlitzPacks } from "app/services";

import * as Styled from "./LandingContent.styled";

export const LandingContent: React.FC = () => {
  const { data: blitzPacks = [], isLoading, error } = useGetBlitzPacks();

  // Display a loading spinner while data is being fetched
  if (isLoading) {
    return (
      <Styled.SafeArea>
        <ActivityIndicator size="large" color="#0000ff" />
      </Styled.SafeArea>
    );
  }

  // Display an error message if the data fails to load
  if (error) {
    return (
      <Styled.SafeArea>
        <Text style={{ color: "red" }}>
          Error loading data. Please try again.
        </Text>
      </Styled.SafeArea>
    );
  }
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
