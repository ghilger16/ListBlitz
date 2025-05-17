import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Asset } from "expo-asset";

const CustomHeader: React.FC = () => {
  const [headerUri, setHeaderUri] = useState<string | null>(null);

  useEffect(() => {
    const loadHeaderGif = async () => {
      const asset = Asset.fromModule(require("@Assets/gifs/header.gif"));
      await asset.downloadAsync();
      setHeaderUri(asset.uri);
    };

    loadHeaderGif();
  }, []);

  if (!headerUri) return null;

  return (
    <View style={styles.headerContainer}>
      <Image source={{ uri: headerUri }} style={styles.headerImage} />
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
});

export default CustomHeader;
