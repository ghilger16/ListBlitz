import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  FlatList,
} from "react-native";

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
  const { isOwned } = useOwnedPacks();

  const [paywall, setPaywall] = useState<{
    visible: boolean;
    productId?: string;
    title?: string;
  }>({ visible: false });

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

  // const getRows = (packs: typeof blitzPacks) => {
  //   const itemsPerRow = 3;
  //   const rows = [];
  //   for (let i = 0; i < packs.length; i += itemsPerRow) {
  //     rows.push(packs.slice(i, i + itemsPerRow));
  //   }
  //   return rows;
  // };

  // const getRowSpacing = () => {
  //   if (isTablet) return 75 * getCardScale();
  //   if (isSmallPhone) return -5;
  //   return 20 * getCardScale();
  // };

  // const getPackMargin = () => {
  //   if (isTablet) return 35;
  //   if (isSmallPhone) return -5;
  //   return 0;
  // };

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

  const getCategoryMinDims = () => {
    const scale = getCardScale();
    const baseCardHeight = 165; // matches BlitzPack styles
    const headerMargin = isTablet ? 40 : isSmallPhone ? 12 : 20; // same as title marginBottom
    const verticalPadding = isTablet ? 40 : 16; // FlatList content padding approximation
    const minHeight = Math.ceil(
      baseCardHeight * scale + headerMargin + verticalPadding + 40
    ); // extra breathing room

    const minWidth = isTablet ? 900 : isSmallPhone ? 360 : 440; // widen a bit on tablet

    return { minWidth, minHeight };
  };

  const renderCategory = (cat: string) => {
    const packs = grouped.get(cat) || [];
    return (
      <View key={cat} style={[styles.categoryContainer, getCategoryMinDims()]}>
        <Text
          style={[
            styles.title,
            isTablet && { fontSize: 40 },
            isSmallPhone && { fontSize: 20 },
            { marginBottom: isTablet ? 0 : isSmallPhone ? 0 : 0 },
            { width: "100%" },
          ]}
        >
          {cat}
        </Text>

        <FlatList
          horizontal
          data={packs}
          keyExtractor={(item) => String(item.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            isTablet ? styles.flatListContentTablet : styles.flatListContent,
          ]}
          snapToAlignment="start"
          decelerationRate="fast"
          renderItem={({ item }) => {
            const animIndex = globalIndex++;
            const meta = blitzPackIcons[item.title];
            const locked = !!meta?.productId && !isOwned(meta.productId);
            return (
              <Animated.View
                style={[
                  getAnimatedStyle(animIndex),
                  {
                    transform: [{ scale: getCardScale() }],
                    alignItems: "center",
                    marginRight: isTablet ? 24 : 12,
                  },
                ]}
              >
                <BlitzPack
                  title={item.title}
                  onPress={() => {
                    if (locked && meta?.productId) {
                      setPaywall({
                        visible: true,
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
          }}
        />
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

      <PaywallSheet
        visible={paywall.visible}
        title={paywall.title}
        productId={paywall.productId}
        onClose={() => setPaywall({ visible: false })}
        onUnlocked={(entitlements) => {
          // When purchase or restore succeeds, you can refresh local state here if needed.
          setPaywall({ visible: false });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "SourGummy",
    fontSize: 25,
    color: "#61D4FF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
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
    alignItems: "center",
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
  flatListContent: {
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  flatListContentTablet: {
    paddingHorizontal: 70,
    paddingVertical: 45,
  },
});

export default PackLibrary;
