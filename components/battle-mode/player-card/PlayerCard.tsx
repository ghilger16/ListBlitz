import { Player } from "@Context";
import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";
import { useGetPlayerIcons } from "@Services";
import { playSound } from "components/utils";
import { tapSound } from "@Assets";
import * as Haptics from "expo-haptics";

interface PlayerCardProps {
  player: Player;
  onPress?: () => void;
  dimmed?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  dimmed,
}) => {
  const { data: ICONS = [] } = useGetPlayerIcons();
  const lottieRef = useRef<LottieView>(null);
  const iconIndex = player.iconIndex;

  // Add slideAnim ref based on player.id
  const slideAnim = useRef(
    new Animated.Value(player.id % 2 === 0 ? 300 : -300)
  ).current;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate slideAnim to 0 when player.id changes
  useEffect(() => {
    slideAnim.setValue(player.id % 2 === 0 ? 300 : -300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [player.id]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={() => {
          Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
          }).start();
          Haptics.selectionAsync();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }}
        onPress={() => {
          onPress?.();
          playSound(tapSound);
        }}
        disabled={dimmed}
        activeOpacity={dimmed ? 1 : 0.9}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={[
          styles.card,
          { borderColor: player.startColor },
          dimmed && styles.dimmedCard,
        ]}
      >
        <Text style={styles.name}>Player {player.id}</Text>
        <LottieView
          ref={lottieRef}
          source={ICONS[iconIndex]}
          autoPlay={!dimmed}
          loop={!dimmed}
          style={styles.icon}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#192c43",
    borderWidth: 6,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 165,
    margin: 10,
  },
  name: {
    color: "#FFD700",
    fontFamily: "LuckiestGuy",
    fontSize: 25,
    marginTop: 10,
    textAlign: "center",
  },
  icon: {
    width: 100,
    height: 100,
  },
  dimmedCard: {
    opacity: 0.4,
  },
});
