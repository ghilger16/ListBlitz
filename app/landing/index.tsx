import React from "react";
import { Text, ActivityIndicator } from "react-native";

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

  // Display a loading spinner while data is being fetched
  if (isLoading || iconLoading) {
    return (
      <Styled.SafeArea>
        <ActivityIndicator size="large" color="#0000ff" />
      </Styled.SafeArea>
    );
  }

  // Display an error message if the data fails to load
  if (error || iconError) {
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
      <PackLibrary />
    </Styled.SafeArea>
  );
};

export default Landing;
