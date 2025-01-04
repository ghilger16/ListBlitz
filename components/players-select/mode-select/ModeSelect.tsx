import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// Constants
const INNER_CIRCLE_RADIUS = 60; // Size of center button
const MODES = ["Chill Mode", "Blitz Mode"]; // Available modes

interface CenterOptionsProps {
  onModeChange: (mode: string) => void;
}

const ModeSelect: React.FC<CenterOptionsProps> = ({ onModeChange }) => {
  const [activeIndex, setActiveIndex] = useState(0); // Track active mode

  // Handle mode change
  const handleModeChange = (newIndex: number) => {
    setActiveIndex(newIndex);
    onModeChange(MODES[newIndex].toLowerCase());
  };

  // Swipe gesture handling for switching modes
  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const direction = event.translationX > 0 ? 1 : -1; // Swipe direction
    const newIndex = (activeIndex + direction + MODES.length) % MODES.length;
    handleModeChange(newIndex);
  });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        {/* Center Circle */}
        <View
          style={[
            styles.circle,
            { backgroundColor: activeIndex === 0 ? "#FFD700" : "#1E90FF" },
          ]}
        >
          <Text style={styles.modeText}>{MODES[activeIndex]}</Text>
        </View>
      </GestureDetector>

      {/* Tabs Below the Wheel */}
      <View style={styles.indicatorContainer}>
        {MODES.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleModeChange(index)}
            style={[
              styles.indicator,
              {
                backgroundColor: activeIndex === index ? "#FFD700" : "#D3D3D3",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: INNER_CIRCLE_RADIUS * 2,
    height: INNER_CIRCLE_RADIUS * 2,
    borderRadius: INNER_CIRCLE_RADIUS, // Makes it a circle
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000", // Outer border
  },
  modeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
});

export default ModeSelect;
