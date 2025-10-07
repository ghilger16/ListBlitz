import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

import { useRouter } from "expo-router";

import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/landing/custom-header";
import { usePackLibraryAnimations } from "./usePackLibraryAnimations";
import { blitzPackIcons } from "@Utils";
import { PaywallSheet } from "../../paywall/PaywallSheet";
import { useOwnedPacks } from "@Hooks";
import { useResponsiveStyles } from "@Hooks";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { animatedValues, headerFadeAnim, blitzPacks } =
    usePackLibraryAnimations();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const gutter = device.isLargeTablet
      ? 22
      : device.isTablet
      ? 15
      : device.isLargePhone
      ? 12
      : device.isSmallPhone
      ? 8
      : 12;

    const headerHeight = device.isLargeTablet
      ? 350
      : device.isTablet
      ? 300
      : device.isLargePhone
      ? 240
      : device.isSmallPhone
      ? 160
      : 220;

    const cardScale = device.isLargeTablet
      ? 1.95
      : device.isTablet
      ? 1.6
      : device.isLargePhone
      ? 1.1
      : device.isSmallPhone
      ? 0.95
      : 1;

    const scrollPaddingTop = device.isLargeTablet
      ? headerHeight + 125
      : device.isTablet
      ? headerHeight + 125
      : device.isSmallPhone
      ? headerHeight + 40
      : headerHeight - 50;

    const gridItemBasis =
      device.isTablet || device.isLargeTablet ? "25%" : "33.3333%";

    const itemPadV = device.isLargeTablet
      ? 85
      : device.isTablet
      ? 30
      : device.isLargePhone
      ? 15
      : device.isSmallPhone
      ? 10
      : 8;

    return {
      headerContainer: { height: headerHeight },
      scrollContent: { paddingTop: scrollPaddingTop },
      grid: { paddingHorizontal: gutter, justifyContent: "center" as const },
      gridItem: {
        flexBasis: gridItemBasis as any,
        maxWidth: gridItemBasis as any,
        paddingHorizontal: gutter / 2,
        paddingVertical: itemPadV,
      },
      cardScaleStyle: { transform: [{ scale: cardScale }] },
      chip: {
        fontSize: device.isLargeTablet
          ? 30
          : device.isTablet
          ? 25
          : device.isLargePhone
          ? 18
          : device.isSmallPhone
          ? 15
          : 16,
        paddingHorizontal: device.isLargeTablet
          ? 25
          : device.isTablet
          ? 20
          : device.isSmallPhone
          ? 12
          : 14,
        paddingVertical: device.isTablet ? 10 : device.isSmallPhone ? 6 : 8,
      },
    };
  });

  const { isOwned, hasFullAccess } = useOwnedPacks();

  const [paywall, setPaywall] = useState<{
    visible: boolean;
    index: number;
    productId?: string;
    title?: string;
  }>({ visible: false, index: 0 });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
    "All",
    "Family & Kids",
    "Entertainment",
    "General Knowledge",
  ];

  let globalIndex = 0;
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
        <View style={styles.chipsRow}>
          {categoriesOrder.map((cat) => (
            <Animated.View key={cat} style={{ opacity: 1 }}>
              <Text
                suppressHighlighting
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipSelected,
                ]}
              >
                {cat}
              </Text>
            </Animated.View>
          ))}
        </View>

        <View style={styles.grid}>
          {blitzPacks.map((item, i) => {
            const animIndex = globalIndex++;
            const meta = blitzPackIcons[item.title];
            const isHidden =
              selectedCategory !== "All" &&
              blitzPackIcons[item.title]?.category !== selectedCategory;
            const locked =
              !hasFullAccess && !!meta?.productId && !isOwned(meta.productId);
            return (
              <Animated.View
                key={item.id}
                style={[
                  getAnimatedStyle(animIndex),
                  styles.gridItem,
                  styles.cardScaleStyle,
                  isHidden && { display: "none" },
                ]}
              >
                <BlitzPack
                  title={item.title}
                  onPress={() => {
                    if (hasFullAccess) {
                      handlePackPress(item.title, item.id);
                      return;
                    }
                    if (locked && meta?.productId) {
                      setPaywall({
                        visible: true,
                        index: animIndex,
                        productId: meta.productId,
                        title: item.title,
                      });
                    } else {
                      handlePackPress(item.title, item.id);
                    }
                  }}
                  index={animIndex}
                  locked={locked}
                />
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      <PaywallSheet
        visible={paywall.visible}
        index={paywall.index}
        title={paywall?.title ?? ""}
        productId={paywall?.productId}
        onClose={() => setPaywall({ visible: false, index: 0 })}
        onUnlocked={(entitlements) => {
          // When purchase or restore succeeds, you can refresh local state here if needed.
          setPaywall({ visible: false, index: 0 });
        }}
      />
    </>
  );
};

const BASE_STYLES = {
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
    alignItems: "center",
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 2,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    zIndex: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "#0f2539",
    color: "#8fdcff",
    fontFamily: "SourGummy",
    fontSize: 16,
    overflow: "hidden",
  },
  chipSelected: {
    backgroundColor: "#61D4FF",
    color: "#0b1c2c",
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    flexGrow: 1,
    flexShrink: 1,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cardScaleStyle: {},
} as const;

export default PackLibrary;
