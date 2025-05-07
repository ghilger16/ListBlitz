import React, { useEffect, useRef } from "react";
import { GameMode } from "@Context";
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const MODES = {
  [GameMode.CHILL]: "Chill\nMode",
  [GameMode.BLITZ]: "Blitz\nMode",
};

interface ModeSelectProps {
  onModeChange: (newMode: GameMode) => void;
  mode: GameMode;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ onModeChange, mode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onModeChange(mode === GameMode.CHILL ? GameMode.BLITZ : GameMode.CHILL);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <View
            style={[
              styles.circle,
              {
                borderColor: mode === GameMode.CHILL ? "#FFD700" : "#87CEFA",
                backgroundColor:
                  mode === GameMode.CHILL ? "#FFD700" : "#87CEFA",
              },
            ]}
          >
            <View style={styles.arrowRow}>
              <Text style={styles.arrow}>‹</Text>
              <View style={styles.modeTextWrapper}>
                <Text style={styles.modeText}>{MODES[mode]}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ModeSelect;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -262,
  },
  circle: {
    width: 130,
    height: 130,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#fff",
    shadowRadius: 10,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  modeTextWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#192c43",
    borderRadius: 50,
    width: 85,
    height: 85,
  },
  modeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    fontFamily: "SourGummy",
    textAlign: "center",
    lineHeight: 30,
    textShadowColor: "#333",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  arrowRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginHorizontal: 5,
    marginBottom: 1,
  },
});
