import React from "react";
import { Text, TouchableOpacity, StyleSheet, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../context/constants";

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

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={assignedColor}
        style={styles.gradientBackground}
      />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 100,
    height: 130,
    margin: 2,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    zIndex: -1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    color: "#333",
  },
});
