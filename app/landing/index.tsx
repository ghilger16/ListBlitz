import React from "react";
import { Text, ScrollView, ActivityIndicator } from "react-native";

import { Stack } from "expo-router";

import { useGetBlitzPacks } from "services";

import * as Styled from "../../styles/Landing.styled";

import CustomHeader from "../../components/custom-header/CustomHeader";
import { PackLibrary } from "../../components/pack-library";
import { AlphaBlitzSection } from "../../components/alpha-blitz";

const Landing: React.FC = () => {
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
          header: () => <CustomHeader />,
        }}
      />
      <ScrollView>
        <PackLibrary />
        <AlphaBlitzSection />
      </ScrollView>
    </Styled.SafeArea>
  );
};

export default Landing;
