import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { PACK_COLORS } from "../../context/constants";

const CATEGORIES = [
  { label: "Animals", icon: "🐾" },
  { label: "Foods", icon: "🍔" },
  { label: "Occupations", icon: "💼" },
  { label: "Countries", icon: "🌍" },
  { label: "Movies", icon: "🎬" },
  { label: "Famous People", icon: "🌟" },
];
interface AlphaCategorySelectProps {
  onSelectCategory: (category: string) => void;
  onPickRandom: () => void;
}

export const AlphaCategorySelect: React.FC<AlphaCategorySelectProps> = ({
  onSelectCategory,
  onPickRandom,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHOOSE A CATEGORY FOR</Text>
      <Text style={styles.subtitle}>ALPHA BLITZ</Text>

      <View style={styles.grid}>
        {Array.from(
          { length: Math.ceil(CATEGORIES.length / 3) },
          (_, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {CATEGORIES.slice(rowIndex * 3, rowIndex * 3 + 3).map(
                ({ label, icon }, colIndex) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.card}
                    onPress={() => onSelectCategory(label)}
                  >
                    <LinearGradient
                      colors={
                        PACK_COLORS[
                          (rowIndex * 3 + colIndex) % PACK_COLORS.length
                        ]
                      }
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.emoji}>{icon}</Text>
                    <Text style={styles.cardLabel}>{label}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={onPickRandom}>
        <Text style={styles.buttonText}>SHUFFLE</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 125,
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
    // No gap property in React Native. Layout handled by rows.
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
