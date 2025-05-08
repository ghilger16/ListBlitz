import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useGetBlitzPacks } from "@Services";
import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/custom-header";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { data: blitzPacks = [] } = useGetBlitzPacks();

  const handlePackPress = (title: string, id: number) => {
    setGameSettings({ blitzPackId: id, blitzPackTitle: title });
    router.push("/player-select");
  };

  const rows = [];
  for (let i = 0; i < blitzPacks.length; i += 3) {
    rows.push(blitzPacks.slice(i, i + 3));
  }

  return (
    <>
      <View style={styles.absoluteContainer}>
        <Text style={styles.title}>Blitz Packs</Text>
      </View>

      <CustomHeader />

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.contentContainer}>
          {rows.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((pack, index) => (
                <BlitzPack
                  key={pack.id}
                  title={pack.title}
                  onPress={() => handlePackPress(pack.title, pack.id)}
                  index={rowIndex * 3 + index}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    width: "100%",
    top: 200,
    zIndex: 3,
    alignItems: "center",
  },
  title: {
    fontFamily: "SourGummy",
    fontSize: 28,
    textTransform: "uppercase",
    color: "#ffffff",
    textShadowColor: "rgba(0, 191, 255, 0.7)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default PackLibrary;
