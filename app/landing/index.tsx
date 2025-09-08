import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { PackLibrary } from "@Components";
import { useScreenInfo } from "../../utils/useScreenInfo";

const Landing: React.FC = () => {
  const { isSmallPhone, isTablet } = useScreenInfo();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[
          styles.safeArea,
          isSmallPhone && styles.smallPhonePadding,
          isTablet && styles.tabletPadding,
        ]}
      >
        <PackLibrary />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#192c43",
    paddingHorizontal: 12,
  },
  smallPhonePadding: {
    paddingHorizontal: 4,
  },
  tabletPadding: {
    paddingHorizontal: 32,
  },
});

export default Landing;
