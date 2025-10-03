import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";

import { useRouter } from "expo-router";

import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/landing/custom-header";
import { usePackLibraryAnimations } from "./usePackLibraryAnimations";
import { useScreenInfo } from "../../../utils/useScreenInfo";
import { blitzPackIcons } from "@Utils";
import { PaywallSheet } from "../../paywall/PaywallSheet";
import { useOwnedPacks } from "@Hooks";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { animatedValues, headerFadeAnim, blitzPacks } =
    usePackLibraryAnimations();

  const { isSmallPhone, isTablet } = useScreenInfo();
  const { isOwned, hasFullAccess } = useOwnedPacks();

  const [paywall, setPaywall] = useState<{
    visible: boolean;
    index: number;
    productId?: string;
    title?: string;
  }>({ visible: false, index: 0 });

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

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
        <View style={styles.chipsRow}>
          {categoriesOrder.map((cat) => (
            <Animated.View key={cat} style={{ opacity: 1 }}>
              <Text
                suppressHighlighting
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipSelected,
                  isTablet && styles.chipTablet,
                  isSmallPhone && styles.chipSmall,
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
              (blitzPackIcons[item.title]?.category || "Other") !==
                selectedCategory;
            const locked =
              !hasFullAccess && !!meta?.productId && !isOwned(meta.productId);
            return (
              <Animated.View
                key={item.id}
                style={[
                  getAnimatedStyle(animIndex),
                  styles.gridItem,
                  { transform: [{ scale: getCardScale() }] },
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

const styles = StyleSheet.create({
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
  chipTablet: { fontSize: 20, paddingHorizontal: 18, paddingVertical: 10 },
  chipSmall: { fontSize: 14, paddingHorizontal: 12, paddingVertical: 6 },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  gridItem: {
    flexBasis: "33.33%",
    maxWidth: "33.33%",
  },
});

export default PackLibrary;
