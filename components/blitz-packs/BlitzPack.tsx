import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../context/constants";
import { blitzPackIcons } from "./blitzPackIcons";

interface IBlitzPackProps {
  title: string;
  onPress: () => void;
  index: number;
}
export const BlitzPack: React.FC<IBlitzPackProps> = ({
  title,
  onPress,
  index,
}) => {
  const assignedColor = COLORS[index % COLORS.length];
  const { icon, titleImage } = blitzPackIcons[title] || {};
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={assignedColor}
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
