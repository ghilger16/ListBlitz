import { Player } from "@Context";
import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useGetIcons } from "@Services";

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
  const { data: ICONS = [] } = useGetIcons();
  const lottieRef = useRef<LottieView>(null);
  const iconIndex = (player.id - 1) % ICONS.length;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#192c43",
    borderWidth: 6,
    borderRadius: 16,
    // paddingVertical: 20,
    // paddingHorizontal: 25,
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
