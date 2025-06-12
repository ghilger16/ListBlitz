import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import LottieView from "lottie-react-native";

interface EditScoreModalProps {
  visible: boolean;
  onClose: () => void;
  playerName: string;
  initialScore: number | null;
  onSave: (newScore: number) => void;
  startColor: string;
  playerIcon: any;
}

export const EditScoreModal: React.FC<EditScoreModalProps> = ({
  visible,
  onClose,
  playerName,
  initialScore,
  onSave,
  startColor,
  playerIcon,
}) => {
  const [score, setScore] = useState((initialScore ?? 0).toString());

  const incrementScore = () => {
    setScore((prev) => (parseInt(prev || "0", 10) + 1).toString());
  };

  const decrementScore = () => {
    setScore((prev) => {
      const newVal = parseInt(prev || "0", 10) - 1;
      return newVal >= 0 ? newVal.toString() : "0";
    });
  };

  const handlePressSave = () => {
    const newScore = parseInt(score, 10);
    if (!isNaN(newScore)) {
      onSave(newScore);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View
            style={[styles.playerNamePill, { backgroundColor: startColor }]}
          >
            <View style={styles.playerNameContent}>
              <Text style={styles.playerName}>{playerName}</Text>
              <LottieView
                source={playerIcon}
                autoPlay
                loop
                style={styles.playerIcon}
              />
            </View>
          </View>
          <View style={styles.scoreRow}>
            <TouchableOpacity
              style={styles.incrementButton}
              onPress={decrementScore}
            >
              <Text style={styles.incrementButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={score}
                onChangeText={setScore}
              />
            </View>
            <TouchableOpacity
              style={styles.incrementButton}
              onPress={incrementScore}
            >
              <Text style={styles.incrementButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handlePressSave}
              activeOpacity={1}
            >
              <Text style={styles.playerName}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: 320,
    height: 360,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowRadius: 10,
    shadowOpacity: 0.25,
    elevation: 10,
    paddingVertical: 50,
  },
  playerNamePill: {
    backgroundColor: "#192C43",
    borderRadius: 20,
    width: 260,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playerNameContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playerIcon: {
    width: 40,
    height: 40,
    marginRight: -10,
    marginLeft: 10,
  },
  playerName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    fontFamily: "LuckiestGuy",
    marginTop: 10,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontSize: 50,
    borderColor: "#192C43",
    textAlign: "center",
    color: "#192C43",
    fontWeight: "bold",
    fontFamily: "LuckiestGuy",
    marginTop: 15,
  },
  incrementButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4FD1C5",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  incrementButtonText: {
    color: "#fff",
    fontSize: 60,
    fontFamily: "LuckiestGuy",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#FFD700",
    width: 200,
    height: 50,
    borderRadius: 30,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "LuckiestGuy",
  },
});
