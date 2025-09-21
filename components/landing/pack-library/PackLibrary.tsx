import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

import { useRouter } from "expo-router";

import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/landing/custom-header";
import { usePackLibraryAnimations } from "./usePackLibraryAnimations";
import { useScreenInfo } from "../../../utils/useScreenInfo";
import { blitzPackIcons } from "@Utils";

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

  const categoriesOrder = [
    "Family & Kids",
    "Entertainment",
    "Music",
    "General Knowledge",
  ];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof blitzPacks>();
    for (const p of blitzPacks) {
      const meta = blitzPackIcons[p.title];
      const cat = meta?.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(p);
    }
    return map;
  }, [blitzPacks]);

  let globalIndex = 0;

  const renderCategory = (cat: string) => {
    const packs = grouped.get(cat) || [];
    const rows = getRows(packs);
    return (
      <View key={cat} style={{ width: "100%" }}>
        <Text
          style={[
            styles.title,
            isTablet && { fontSize: 40 },
            isSmallPhone && { fontSize: 20 },
            { marginBottom: isTablet ? 60 : isSmallPhone ? 12 : 20 },
          ]}
        >
          {cat}
        </Text>
        {rows.map((row, rowIndex) => (
          <View
            style={[
              styles.row,
              { width: "100%", marginBottom: getRowSpacing() },
            ]}
            key={`${cat}-${rowIndex}`}
          >
            {row.map((pack, index) => {
              const animIndex = globalIndex++;
              const meta = blitzPackIcons[pack.title];
              const locked = !!meta?.productId; // replace with entitlement check later
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
                    locked={locked}
                  />
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

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
        <View style={styles.contentContainer}>
          {categoriesOrder.filter((c) => grouped.has(c)).map(renderCategory)}
          {Array.from(grouped.keys())
            .filter((c) => !categoriesOrder.includes(c))
            .map(renderCategory)}
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
    // alignSelf: "center",
    backgroundColor: "pink",
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
