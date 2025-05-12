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
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const { icon: alphaIcon } = useGetAlphabetIcons(1);

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
        {isAlphaBlitz && selectedCategory ? (
          <>
            <View
              style={{ position: "absolute", top: 15, alignItems: "center" }}
            >
              <Animated.View
                style={{
                  transform: [{ scale: bounceValue }],
                }}
              >
                <Text style={[styles.promptText]}>List {selectedCategory}</Text>
                <Text style={[styles.promptText]}>
                  that start with the letter
                </Text>
              </Animated.View>
            </View>
            <View
              style={{ position: "absolute", bottom: -5, alignItems: "center" }}
            >
              {countdown !== null ? (
                <Animated.Text
                  style={[
                    styles.promptText,
                    {
                      opacity: fadeValue,
                      transform: [{ scale: scaleValue }],
                      fontSize: 45,
                      color: "#fff",
                      marginTop: countdown ? 20 : 5,
                    },
                  ]}
                >
                  {countdown}
                </Animated.Text>
              ) : !isObscured ? (
                <LottieView
                  source={alphaIcon}
                  autoPlay
                  loop={false}
                  style={[styles.alphaIcon, { marginTop: 20 }]}
                />
              ) : (
                <Text
                  style={[
                    styles.promptText,
                    {
                      fontSize: 45,
                      color: "#fff",
                      fontFamily: "LuckiestGuy",
                    },
                  ]}
                >
                  ?
                </Text>
              )}
            </View>
          </>
        ) : isAlphaBlitz && isObscured ? (
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
      {categoryBubble && (
        <Image source={categoryBubble} style={styles.bubbleImage} />
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
    width: 55,
    height: 60,
    color: "#fff",
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
