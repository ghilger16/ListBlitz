import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { useGetBlitzPacks } from "@Services";
import { useGameplay } from "@Context";

import { BlitzPack } from "../blitz-packs";
import { CustomHeader } from "components/custom-header";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay();
  const { data: blitzPacks = [] } = useGetBlitzPacks();
  const animatedValues = useRef<Animated.Value[]>([]).current;

  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    blitzPacks.forEach((_, i) => {
      if (!animatedValues[i]) {
        animatedValues[i] = new Animated.Value(0);
      }
    });

    Animated.stagger(
      150,
      animatedValues.map((val) =>
        Animated.timing(val, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [blitzPacks]);

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
      <View style={styles.absoluteContainer}></View>

      <View style={{ position: "absolute", top: 0, width: "100%", zIndex: 2 }}>
        <Animated.View style={{ opacity: headerFadeAnim }}>
          <CustomHeader />
        </Animated.View>
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Text style={styles.title}>Blitz Packs</Text>
        <View style={styles.contentContainer}>
          {rows.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((pack, index) => (
                <Animated.View
                  key={pack.id}
                  style={{
                    opacity: animatedValues[rowIndex * 3 + index] || 0,
                    transform: [
                      {
                        scale:
                          animatedValues[rowIndex * 3 + index]?.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.6, 1],
                          }) || 1,
                      },
                    ],
                  }}
                >
                  <BlitzPack
                    title={pack.title}
                    onPress={() => handlePackPress(pack.title, pack.id)}
                    index={rowIndex * 3 + index}
                  />
                </Animated.View>
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
    // position: "absolute",
    // width: "100%",
    // top: 200,
    // zIndex: 3,
    // alignItems: "center",
  },
  title: {
    fontFamily: "SourGummy",
    fontSize: 25,
    color: "#61D4FF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 175,
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
