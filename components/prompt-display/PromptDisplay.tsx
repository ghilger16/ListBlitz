import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import { playSound } from "components/utils";
import { countdownSound } from "@Assets";
import LottieView from "lottie-react-native";
import { useGetAlphabetIcons } from "@Services";

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
  isObscured?: boolean;
  countdown?: number | null;
  categoryBubble?: ImageSourcePropType;
  isAlphaBlitz?: boolean;
  selectedCategory?: string | null;
}> = ({
  prompt,
  playerColor,
  isObscured,
  countdown,
  categoryBubble,
  isAlphaBlitz,
  selectedCategory,
}) => {
  console.log("🚀 ~ selectedCategory:", selectedCategory);
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const { icon: alphaIcon } = useGetAlphabetIcons(0);

  useEffect(() => {
    if (typeof countdown === "number" && !hasPlayedSound) {
      playSound(countdownSound);
      setHasPlayedSound(true);
    }

    if (countdown === null) {
      setHasPlayedSound(false);
    }
  }, [countdown, hasPlayedSound]);

  useEffect(() => {
    if (countdown !== null) {
      fadeValue.setValue(0);
      scaleValue.setValue(0.8);
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.spring(bounceValue, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(bounceValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [countdown]);

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderColor: playerColor,
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={containerStyle}>
        {isAlphaBlitz ? (
          <Animated.Text
            style={[styles.promptText, { transform: [{ scale: bounceValue }] }]}
          >
            {selectedCategory}
          </Animated.Text>
        ) : isObscured ? (
          countdown !== null ? (
            <Animated.Text
              style={[
                styles.promptText,
                {
                  opacity: fadeValue,
                  transform: [{ scale: scaleValue }],
                  fontSize: 70,
                  color: "#fff",
                  marginTop: countdown ? 20 : 5,
                },
              ]}
            >
              {countdown}
            </Animated.Text>
          ) : (
            <Text style={styles.promptText}>List Blitz</Text>
          )
        ) : (
          <Animated.Text
            style={[styles.promptText, { transform: [{ scale: bounceValue }] }]}
          >
            {selectedCategory ? selectedCategory : prompt}
          </Animated.Text>
        )}
      </View>
      {selectedCategory ? (
        <View style={[styles.letterBubble, { borderColor: playerColor }]}>
          {isObscured ? (
            <Text
              style={{
                fontSize: 40,
                color: "#fff",
                fontWeight: "bold",
                fontFamily: "LuckiestGuy",
              }}
            >
              ?
            </Text>
          ) : (
            <LottieView
              source={alphaIcon}
              autoPlay
              loop={false}
              style={styles.alphaIcon}
            />
          )}
        </View>
      ) : categoryBubble ? (
        <Image source={categoryBubble} style={styles.bubbleImage} />
      ) : null}

      {isAlphaBlitz && isObscured && countdown !== null && (
        <View style={[styles.letterBubble, { borderColor: playerColor }]}>
          <Text
            style={{
              fontSize: 40,
              color: "#fff",
              fontWeight: "bold",
              fontFamily: "LuckiestGuy",
              marginTop: 10,
            }}
          >
            {countdown}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#192c43",
    borderRadius: 30,
    width: 350,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 5,
  },
  promptText: {
    fontFamily: "LuckiestGuy",
    fontSize: 23,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: "wrap",
  },
  bubbleImage: {
    position: "absolute",
    bottom: 90,
    height: 80,
    resizeMode: "contain",
    zIndex: 1,
  },
  alphaIcon: {
    width: 75,
    height: 75,
    position: "absolute",
    // bottom: 110,
    // left: 140,
    color: "#fff",
    marginBottom: 5,
  },
  letterBubble: {
    position: "absolute",
    bottom: 95,
    left: 135,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#192c43",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    zIndex: 2,
  },
});
