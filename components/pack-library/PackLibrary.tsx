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
          <Text style={styles.sectionTitle}>Family & Kids</Text>
          <View style={styles.row}>
            {blitzPacks
              .filter((pack) =>
                ["Snack Attack", "Categorical Chaos"].includes(pack.title)
              )
              .map((pack, index) => (
                <BlitzPack
                  key={pack.id}
                  title={pack.title}
                  onPress={() => handlePackPress(pack.title, pack.id)}
                  index={index}
                />
              ))}
          </View>

          <Text style={styles.sectionTitle}>Entertainment</Text>
          <View style={styles.row}>
            {blitzPacks
              .filter((pack) =>
                ["Big Screen Blitz", "Alpha Blitz"].includes(pack.title)
              )
              .map((pack, index) => (
                <BlitzPack
                  key={pack.id}
                  title={pack.title}
                  onPress={() => handlePackPress(pack.title, pack.id)}
                  index={index}
                />
              ))}
          </View>
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
  sectionTitle: {
    fontFamily: "SourGummy",
    fontSize: 20,
    textTransform: "uppercase",
    color: "#6BDFFF",
    marginBottom: 10,
    textAlign: "left",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
});

export default PackLibrary;
