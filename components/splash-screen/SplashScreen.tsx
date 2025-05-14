import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Image, StyleSheet, Dimensions, Animated } from "react-native";

interface SplashScreenProps {
  backgroundPath: string;
}

const { width, height } = Dimensions.get("window");

const AnimatedImageBackground = Animated.createAnimatedComponent(Image);

const imageMap: Record<string, any> = {
  blitz: require("assets/images/blitz-splash.png"),
  // chill: require("assets/images/chill-bg.png"),
  // battle: require("assets/images/battle-bg.png"),
};

const SplashScreen: React.FC<SplashScreenProps> = ({ backgroundPath }) => {
  const imageSource = imageMap[backgroundPath];

  if (!imageSource) {
    console.warn(`No image found for backgroundPath: ${backgroundPath}`);
    return null;
  }

  return (
    <View style={styles.overlay}>
      <AnimatedImageBackground
        source={imageSource}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;
