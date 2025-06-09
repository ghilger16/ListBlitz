import React from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

import { useRouter } from "expo-router";

import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/custom-header";
import { usePackLibraryAnimations } from "./usePackLibraryAnimations";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { animatedValues, headerFadeAnim, blitzPacks } =
    usePackLibraryAnimations();

  const getAnimatedStyle = (index: number) => ({
    opacity: animatedValues[index],
    transform: [
      {
        scale: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        }),
      },
    ],
  });

  const getRows = (packs: typeof blitzPacks) => {
    const rows = [];
    for (let i = 0; i < packs.length; i += 3) {
      rows.push(packs.slice(i, i + 3));
    }
    return rows;
  };

  const handlePackPress = (title: string, id: number) => {
    setGameSettings({ blitzPackId: id, blitzPackTitle: title });
    router.push("/player-select");
  };

  const rows = getRows(blitzPacks);

  return (
    <>
      <View style={styles.headerContainer}>
        <Animated.View style={{ opacity: headerFadeAnim }}>
          <CustomHeader />
        </Animated.View>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Text style={styles.title}>Blitz Packs</Text>
        <View style={styles.contentContainer}>
          {rows.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((pack, index) => {
                return (
                  <Animated.View
                    key={pack.id}
                    style={getAnimatedStyle(rowIndex * 3 + index)}
                  >
                    <BlitzPack
                      title={pack.title}
                      onPress={() => handlePackPress(pack.title, pack.id)}
                      index={rowIndex * 3 + index}
                    />
                  </Animated.View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "SourGummy",
    fontSize: 25,
    color: "#61D4FF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 175,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 2,
  },
});

export default PackLibrary;
