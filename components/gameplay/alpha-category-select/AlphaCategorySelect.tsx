import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PACK_COLORS } from "@Context";

const CATEGORIES = [
  { label: "Animals", icon: "🐾" },
  { label: "Foods", icon: "🍔" },
  { label: "Occupations", icon: "💼" },
  { label: "Countries", icon: "🌍" },
  { label: "Movies", icon: "🎬" },
  { label: "Famous People", icon: "🌟" },
];

const getCategoryColor = (index: number) =>
  PACK_COLORS[index % PACK_COLORS.length];

interface AlphaCategorySelectProps {
  onSelectCategory: (category: string) => void;
  onPickRandom: () => void;
}

export const AlphaCategorySelect: React.FC<AlphaCategorySelectProps> = ({
  onSelectCategory,
  onPickRandom,
}) => {
  const renderCategoryCard = ({
    item,
    index,
  }: {
    item: (typeof CATEGORIES)[number];
    index: number;
  }) => (
    <TouchableOpacity
      key={item.label}
      style={styles.card}
      onPress={() => onSelectCategory(item.label)}
    >
      <LinearGradient
        colors={getCategoryColor(index)}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.emoji}>{item.icon}</Text>
      <Text style={styles.cardLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHOOSE A CATEGORY FOR</Text>
      <Text style={styles.subtitle}>ALPHA BLITZ</Text>
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryCard}
        keyExtractor={(item) => item.label}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity style={styles.button} onPress={onPickRandom}>
        <Text style={styles.buttonText}>SHUFFLE</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 75,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 32,
    color: "#FFC400",
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 4,
  },

  grid: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 100,
    height: 100,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    marginTop: 32,
    backgroundColor: "#FFC400",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#002147",
  },
});
