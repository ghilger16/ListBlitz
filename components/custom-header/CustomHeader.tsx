import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur";

const headerGif = require("@Assets/gifs/header.gif");

const CustomHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Image source={headerGif} style={styles.headerImage} />
      <BlurView intensity={10} tint="dark" style={styles.blurOverlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 220,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  headerImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blurOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default CustomHeader;
