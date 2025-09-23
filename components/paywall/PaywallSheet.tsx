import React, { useEffect, useMemo, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";

import {
  purchaseProduct,
  restorePurchases,
  getOfferings,
} from "../../purchases/purchases";
import { useOwnedPacks } from "@Hooks";

interface PaywallSheetProps {
  visible: boolean;
  title?: string;
  productId?: string;
  onClose: () => void;
  onUnlocked: (entitlements: string[]) => void;
}

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  visible,
  title,
  productId,
  onClose,
  onUnlocked,
}) => {
  const { addOwned, setOwned } = useOwnedPacks();
  const [loadingUnlock, setLoadingUnlock] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [price, setPrice] = useState<string | null>(null);

  // Load localized price for this productId from the current offering
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!productId) {
          setPrice(null);
          return;
        }
        const pkgs = await getOfferings();
        const match = pkgs.find((p) => p.product.identifier === productId);
        if (mounted) setPrice(match?.product.priceString ?? null);
      } catch (e) {
        if (mounted) setPrice(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const canUnlock = !!productId && !loadingUnlock && !loadingRestore;

  if (!visible) return null;

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.headerText}>Unlock {title}</Text>
          <Text style={styles.subText}>
            Get access to all prompts in this pack forever.
            {price ? `\nOne-time purchase • ${price}` : ""}
          </Text>

          <TouchableOpacity
            style={[styles.primaryButton, !canUnlock && styles.buttonDisabled]}
            disabled={!canUnlock}
            onPress={async () => {
              if (!productId) return;
              try {
                setLoadingUnlock(true);
                const ents = await purchaseProduct(productId);
                if (ents.length) {
                  addOwned(ents);
                  onUnlocked(ents);
                  onClose();
                }
              } finally {
                setLoadingUnlock(false);
              }
            }}
          >
            <Text style={styles.primaryButtonText}>
              {loadingUnlock
                ? "Purchasing..."
                : price
                ? `Unlock • ${price}`
                : "Unlock"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textButton}
            onPress={async () => {
              try {
                setLoadingRestore(true);
                const ents = await restorePurchases();
                if (ents.length) {
                  setOwned(ents);
                  onUnlocked(ents);
                  onClose();
                }
              } finally {
                setLoadingRestore(false);
              }
            }}
          >
            <Text style={styles.textButtonLabel}>
              {loadingRestore ? "Restoring..." : "Restore Purchases"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#61D4FF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  textButtonLabel: {
    color: "#192c43",
    fontSize: 15,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: "#192c43",
    fontSize: 16,
  },
});
