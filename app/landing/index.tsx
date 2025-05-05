import React from "react";
import { Text, ActivityIndicator } from "react-native";
import { Stack } from "expo-router"; // Import Stack for screen options

import { useGetBlitzPacks, useGetIcons } from "@Services";

import * as Styled from "../../styles/Landing.styled";
import { PackLibrary } from "../../components/pack-library";

const Landing: React.FC = () => {
  const { data: blitzPacks = [], isLoading, error } = useGetBlitzPacks();
  const {
    data: icons = [],
    isLoading: iconLoading,
    error: iconError,
  } = useGetIcons();

  return (
    <>
      {/* Hide header for Landing page */}
      <Stack.Screen options={{ headerShown: false }} />

      <Styled.SafeArea>
        {isLoading || iconLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error || iconError ? (
          <Text style={{ color: "red" }}>
            Error loading data. Please try again.
          </Text>
        ) : (
          <PackLibrary />
        )}
      </Styled.SafeArea>
    </>
  );
};

export default Landing;
