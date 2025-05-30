import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import { Stack } from "expo-router";

import { PackLibrary } from "../../components/pack-library";

const Landing: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <PackLibrary />
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
