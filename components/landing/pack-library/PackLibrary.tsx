import React from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

import { useRouter } from "expo-router";

import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/landing/custom-header";
import { usePackLibraryAnimations } from "./usePackLibraryAnimations";
import { useScreenInfo } from "../../../utils/useScreenInfo";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { animatedValues, headerFadeAnim, blitzPacks } =
    usePackLibraryAnimations();

  const { isSmallPhone, isTablet } = useScreenInfo();

  const getCardScale = () => {
    if (isTablet) return 1.5;
    if (isSmallPhone) return 0.9;
    return 1;
  };

  const getHeaderHeight = () => {
    if (isTablet) return 300;
    if (isSmallPhone) return 160;
    return 220;
  };

  const getScrollPaddingTop = () => {
    if (isTablet) return getHeaderHeight() + 125;
    if (isSmallPhone) return getHeaderHeight() + 40;
    return getHeaderHeight() - 50;
  };

  const getRows = (packs: typeof blitzPacks) => {
    const itemsPerRow = 3;
    const rows = [];
    for (let i = 0; i < packs.length; i += itemsPerRow) {
      rows.push(packs.slice(i, i + itemsPerRow));
    }
    return rows;
  };

  const getRowSpacing = () => {
    if (isTablet) return 75 * getCardScale();
    if (isSmallPhone) return -5;
    return 20 * getCardScale();
  };

  const getPackMargin = () => {
    if (isTablet) return 35;
    if (isSmallPhone) return -5;
    return 0;
  };

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

  const handlePackPress = (title: string, id: number) => {
    setGameSettings({ blitzPackId: id, blitzPackTitle: title });
    router.push("/player-select");
  };

  const rows = getRows(blitzPacks);

  return (
    <>
      <View style={[styles.headerContainer, { height: getHeaderHeight() }]}>
        <Animated.View style={{ opacity: headerFadeAnim }}>
          <CustomHeader />
        </Animated.View>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: getScrollPaddingTop() },
        ]}
        style={styles.scrollView}
      >
        <Text
          style={[
            styles.title,
            isTablet && { fontSize: 40 },
            isSmallPhone && { fontSize: 20 },
            {
              marginBottom: isTablet ? 75 : isSmallPhone ? 15 : 25,
            },
          ]}
        >
          Blitz Packs
        </Text>
        <View style={styles.contentContainer}>
          {rows.map((row, rowIndex) => (
            <View
              style={[
                styles.row,
                {
                  width: "100%",
                  marginBottom: getRowSpacing(),
                },
              ]}
              key={rowIndex}
            >
              {row.map((pack, index) => {
                const animIndex = rowIndex * 3 + index;
                return (
                  <Animated.View
                    key={pack.id}
                    style={[
                      getAnimatedStyle(animIndex),
                      {
                        transform: [{ scale: getCardScale() }],
                        alignItems: "center",
                        marginHorizontal: getPackMargin(),
                      },
                    ]}
                  >
                    <BlitzPack
                      title={pack.title}
                      onPress={() => handlePackPress(pack.title, pack.id)}
                      index={animIndex}
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

    width: "100%",
    zIndex: 2,
  },
});

export default PackLibrary;
