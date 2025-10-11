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
import { useResponsiveStyles } from "@Hooks";

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
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.85);
      if (device.isTablet) return Math.round(base * 1.4);
      if (device.isLargePhone) return Math.round(base * 1.1);
      if (device.isSmallPhone) return Math.round(base * 0.85);
      return base;
    };

    // Base phone dimensions
    const cardW = 110;
    const cardH = 95;
    const radius = 16;

    const dims = device.isLargeTablet
      ? { w: 180, h: 150, r: 22, padTop: 90, padH: 40, rowGap: 22 }
      : device.isTablet
      ? { w: 150, h: 130, r: 20, padTop: 80, padH: 32, rowGap: 20 }
      : device.isLargePhone
      ? { w: 125, h: 110, r: 18, padTop: 70, padH: 26, rowGap: 18 }
      : device.isSmallPhone
      ? { w: 100, h: 88, r: 14, padTop: 55, padH: 16, rowGap: 12 }
      : { w: cardW, h: cardH, r: radius, padTop: 60, padH: 20, rowGap: 16 };

    return {
      container: { paddingTop: dims.padTop, paddingHorizontal: dims.padH },
      title: { fontSize: fs(18), letterSpacing: 1 },
      subtitle: { fontSize: fs(32) },
      row: { marginBottom: dims.rowGap },
      card: { width: dims.w, height: dims.h, borderRadius: dims.r },
      emoji: { fontSize: fs(36) },
      cardLabel: { fontSize: fs(14) },
      buttonText: { fontSize: fs(18) },
      button: {
        paddingVertical: device.isLargeTablet || device.isTablet ? 18 : 14,
        paddingHorizontal: device.isLargeTablet
          ? 44
          : device.isTablet
          ? 40
          : 32,
      },
    } as const;
  });

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

const BASE_STYLES = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
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
    width: 110,
    height: 95,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  button: {
    marginTop: 28,
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
