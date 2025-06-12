import React, { useEffect, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";

import { Asset } from "expo-asset";

const CustomHeader: React.FC = () => {
  const [headerUri, setHeaderUri] = useState<string | null>(null);

  const loadHeaderAsset = useCallback(() => {
    const asset = Asset.fromModule(require("@Assets/gifs/header.gif"));
    setHeaderUri(asset.localUri || asset.uri);
  }, []);

  useEffect(() => {
    loadHeaderAsset();
  }, [loadHeaderAsset]);

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
