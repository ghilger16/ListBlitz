import React from "react";
import {
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";

import { useGetBlitzPacks, useGetIcons } from "@Services";
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
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {isLoading || iconLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error || iconError ? (
          <Text style={styles.errorText}>
            Error loading data. Please try again.
          </Text>
        ) : (
          <PackLibrary />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#192c43",
  },
  errorText: {
    color: "red",
  },
});

export default Landing;
