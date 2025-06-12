import React from "react";
import { TouchableOpacity, StyleSheet, Image, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { PACK_COLORS } from "@Context";
import { blitzPackIcons } from "@Utils";

interface IBlitzPackProps {
  title: string;
  onPress: () => void;
  index: number;
}
const BlitzPack: React.FC<IBlitzPackProps> = ({ title, onPress, index }) => {
  const gradientColors = PACK_COLORS[index % PACK_COLORS.length];
  const { icon, titleImage } = blitzPackIcons[title] || {};
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { borderColor: gradientColors[0] }]}
      onPress={onPress}
      activeOpacity={0.9}
      accessible
      accessibilityRole="button"
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientBackground}
      />
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
    margin: 2,
    elevation: 3,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 3,
    borderRadius: 25,
    backgroundColor: "#fff",
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
