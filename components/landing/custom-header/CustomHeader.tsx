import React, { useEffect, useState, useCallback } from "react";
import { View, Image, StyleSheet } from "react-native";

import { Asset } from "expo-asset";
import { useScreenInfo } from "@Utils";

const CustomHeader: React.FC = () => {
  const [headerUri, setHeaderUri] = useState<string | null>(null);
  const { isTablet, isSmallPhone } = useScreenInfo();

  const loadHeaderAsset = useCallback(() => {
    const asset = Asset.fromModule(require("@Assets/gifs/header.gif"));
    setHeaderUri(asset.localUri || asset.uri);
  }, []);

  useEffect(() => {
    loadHeaderAsset();
  }, [loadHeaderAsset]);

  const getHeaderHeight = () => {
    if (isTablet) return 400;
    if (isSmallPhone) return 185;
    return 220;
  };

  if (!headerUri) return null;

  return (
    <View style={[styles.headerContainer, { height: getHeaderHeight() }]}>
      <Image
        source={{ uri: headerUri }}
        style={[styles.headerImage, { height: getHeaderHeight() }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
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
