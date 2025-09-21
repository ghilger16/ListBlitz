import React from "react";
import { TouchableOpacity, StyleSheet, Image, View, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { PACK_COLORS } from "@Context";
import { blitzPackIcons } from "@Utils";
import { useScreenInfo } from "../../../utils/useScreenInfo";

interface IBlitzPackProps {
  title: string;
  onPress: () => void;
  index: number;
  locked?: boolean;
}
const BlitzPack: React.FC<IBlitzPackProps> = ({
  title,
  onPress,
  index,
  locked,
}) => {
  const gradientColors = PACK_COLORS[index % PACK_COLORS.length];
  const { icon, titleImage } = blitzPackIcons[title] || {};
  const { isTablet, isSmallPhone } = useScreenInfo();
  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          borderColor: gradientColors[0],
          margin: isTablet ? 28 : isSmallPhone ? -8 : 2,
        },
        locked && styles.lockedCard,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible
      accessibilityRole="button"
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientBackground}
      />
      {locked && (
        <View style={styles.lockBadge}>
          <Text style={styles.lockText}>LOCKED</Text>
        </View>
      )}
      <View style={styles.contentColumn}>
        {titleImage && (
          <Image
            source={titleImage}
            style={styles.titleImage}
            resizeMode="contain"
          />
        )}

        {icon && (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 125,
    height: 165,
    elevation: 3,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  lockedCard: {
    opacity: 0.75,
  },
  lockBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#113B62",
    zIndex: 3,
  },
  lockText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 0.6,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    zIndex: -1,
  },
  icon: {
    width: 95,
    height: 95,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  titleImage: {
    width: "95%",
    height: undefined,
    aspectRatio: 1.5,
    resizeMode: "contain",
  },
  contentColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BlitzPack;
