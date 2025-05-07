import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
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
  const categories = ["Family Pack", "Word Pack", "Alpha Pack", "Movie Pack"];
  const emojis = ["😊", "💬", "🅰️", "🍿"];
  const category = categories[index % categories.length];
  const emoji = emojis[index % emojis.length];

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <LinearGradient
        colors={assignedColor}
        style={styles.gradientBackground}
      />
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.emojiBadge}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.bottomTag}>
        <Text style={styles.tagText}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    height: 215,
    margin: 10,
    borderRadius: 36,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    zIndex: -1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    color: "#fff",
    fontFamily: "LuckiestGuy",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 3,
    paddingHorizontal: 10,
  },
  emojiBadge: {
    position: "absolute",
    right: 15,
    top: 15,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
  },
  emoji: {
    fontSize: 22,
  },
  bottomTag: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
