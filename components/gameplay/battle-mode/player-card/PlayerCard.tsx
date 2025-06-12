import {
  useSlideInAnimation,
  usePressScaleAnimation,
} from "hooks/useBattleAnimation";
import { Player } from "@Context";
import React, { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { playerIcons } from "@Context";

interface PlayerCardProps {
  player: Player;
  onPress?: () => void;
  dimmed?: boolean;
  isRightCard?: boolean; // Optional prop to control slide direction
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onPress,
  dimmed,
  isRightCard = false,
}) => {
  const lottieRef = useRef<LottieView>(null);
  const iconIndex = player.iconIndex;

  const slideAnim = useSlideInAnimation(isRightCard ? "right" : "left");
  const { scaleAnim, onPressIn, onPressOut } = usePressScaleAnimation();

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          onPress?.();
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
          source={playerIcons[iconIndex]}
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
