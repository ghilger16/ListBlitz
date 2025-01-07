import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const INNER_CIRCLE_RADIUS = 60; // Size of center button
const MODES = ["Chill", "Blitz"]; // Available modes

interface CenterOptionsProps {
  onModeChange: (mode: string) => void;
  mode: number;
}

const ModeSelect: React.FC<CenterOptionsProps> = ({ onModeChange, mode }) => {
  // Handle mode change
  const handleModeChange = () => {
    onModeChange(MODES[mode].toLowerCase()); // Trigger parent callback
  };

  return (
    <TouchableOpacity
      style={styles.fullScreen} // Make the entire area tappable
      activeOpacity={1} // Prevent fade animation
      onPress={handleModeChange} // Handle taps anywhere
    >
      <View style={styles.container}>
        {/* Center Circle */}
        <View
          style={[
            styles.circle,
            { backgroundColor: mode === 0 ? "#FFD700" : "#1E90FF" },
          ]}
        >
          <Text style={styles.modeText}>{MODES[mode]}</Text>
        </View>

        {/* Tabs Below the Wheel */}
        <View style={styles.indicatorContainer}>
          {MODES.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: mode === index ? "#FFD700" : "#D3D3D3",
                },
              ]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  fullScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -255,
  },
  circle: {
    width: INNER_CIRCLE_RADIUS * 2,
    height: INNER_CIRCLE_RADIUS * 2,
    borderRadius: INNER_CIRCLE_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  modeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 175,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});

export default ModeSelect;
