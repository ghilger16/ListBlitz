import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";

import {
  purchaseProduct,
  restorePurchases,
  getProductPrice,
} from "../../purchases/purchases";
import { useOwnedPacks } from "@Hooks";
import { useScreenInfo } from "../../utils/useScreenInfo";
import { useResponsiveStyles } from "@Hooks";
import { blitzPackIcons } from "@Utils";
import { PACK_COLORS } from "@Context";
import { LinearGradient } from "expo-linear-gradient";
import { BLITZ_TITLE_TO_KEY_MAP, SAMPLE_PROMPTS } from "@Data";

interface PaywallSheetProps {
  visible: boolean;
  title: string;
  index: number;
  productId?: string;
  onClose: () => void;
  onUnlocked: (entitlements: string[]) => void;
}

const FULL_ACCESS_PRODUCT_ID = "com.listblitz.app.iap.all_packs";

type OptionKey = "full" | "single";

export const PaywallSheet: React.FC<PaywallSheetProps> = ({
  visible,
  title,
  productId,
  index,
  onClose,
  onUnlocked,
}) => {
  const { addOwned, setOwned } = useOwnedPacks();
  const { device } = useScreenInfo();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.5);
      if (device.isTablet) return Math.round(base * 1.25);
      if (device.isLargePhone) return Math.round(base * 1.05);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    const paddingX = device.isLargeTablet
      ? 24
      : device.isTablet
      ? 18
      : device.isLargePhone
      ? 18
      : device.isSmallPhone
      ? 12
      : 16;

    const sheetMaxWidth = device.isLargeTablet
      ? 820
      : device.isTablet
      ? 720
      : 640;

    const heroClosePadH = device.isTablet || device.isLargeTablet ? 12 : 8;
    const heroClosePadV = device.isTablet || device.isLargeTablet ? 6 : 2;
    const heroCloseRadius = device.isTablet || device.isLargeTablet ? 18 : 14;
    const heroCloseFont = device.isLargeTablet ? 26 : device.isTablet ? 22 : 18;

    return {
      sheet: { maxWidth: sheetMaxWidth },
      contentPad: { paddingHorizontal: paddingX },
      headline: { fontSize: fs(21) },
      promptText: { fontSize: fs(20) },
      selectTitle: { fontSize: fs(16) },
      selectSub: { fontSize: fs(14) },
      selectPrice: { fontSize: fs(14) },
      buyButtonText: { fontSize: fs(17) },
      checkBullet: { fontSize: fs(15) },
      restoreText: { fontSize: fs(16) },
      heroClose: {
        paddingHorizontal: heroClosePadH,
        paddingVertical: heroClosePadV,
        borderRadius: heroCloseRadius,
        right: 12,
        top: 12,
      },
      heroCloseLabel: { fontSize: heroCloseFont },
    };
  });

  const radioOuter = useMemo(() => {
    if (device.isLargeTablet) return 30;
    if (device.isTablet) return 22;
    if (device.isLargePhone) return 22;
    if (device.isSmallPhone) return 20;
    return 22;
  }, [device]);

  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [singlePrice, setSinglePrice] = useState<string | null>(null);
  const [fullPrice, setFullPrice] = useState<string | null>(null);
  const [selected, setSelected] = useState<OptionKey>("full");

  const { titleImage } = blitzPackIcons[title] || {};

  const gradientColors = useMemo(
    () => PACK_COLORS[index % PACK_COLORS.length],
    [index]
  );
  const accentColor = useMemo(() => gradientColors[0], [gradientColors]);

  const packKey = BLITZ_TITLE_TO_KEY_MAP[title];
  const promptList = SAMPLE_PROMPTS[packKey] || [];

  const [promptIdx, setPromptIdx] = useState(0);
  const promptFade = React.useRef(new Animated.Value(1)).current;
  const promptTranslate = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    if (!promptList || promptList.length === 0) return;
    const rotate = () => {
      Animated.parallel([
        Animated.timing(promptFade, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(promptTranslate, {
          toValue: -6,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPromptIdx((i) => (i + 1) % Math.max(promptList.length, 1));
        promptTranslate.setValue(6);
        Animated.parallel([
          Animated.timing(promptFade, {
            toValue: 1,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(promptTranslate, {
            toValue: 0,
            duration: 180,
            useNativeDriver: true,
          }),
        ]).start();
      });
    };
    const interval = setInterval(rotate, 2300);
    return () => clearInterval(interval);
  }, [visible, promptList, promptFade, promptTranslate]);

  const fetchPrice = React.useCallback(
    async (id: string | undefined, set: (v: string | null) => void) => {
      if (!id) {
        set(null);
        return;
      }
      try {
        const p = await getProductPrice(id);
        set(p ?? null);
      } catch {
        set(null);
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchPrice(productId, (v) => mounted && setSinglePrice(v));
    })();
    return () => {
      mounted = false;
    };
  }, [productId, visible, fetchPrice]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await fetchPrice(
        FULL_ACCESS_PRODUCT_ID,
        (v) => mounted && setFullPrice(v)
      );
    })();
    return () => {
      mounted = false;
    };
  }, [visible, fetchPrice]);

  const currentPrice = selected === "full" ? fullPrice : singlePrice;
  const canBuy =
    !loadingPurchase && !loadingRestore && (selected === "full" || !!productId);

  const onSelectFull = React.useCallback(() => setSelected("full"), []);
  const onSelectSingle = React.useCallback(() => setSelected("single"), []);
  const handlePurchase = React.useCallback(async () => {
    if (!canBuy) return;
    try {
      setLoadingPurchase(true);
      const id = selected === "full" ? FULL_ACCESS_PRODUCT_ID : productId!;
      const ents = await purchaseProduct(id);
      if (ents.length) {
        addOwned(ents);
        onUnlocked(ents);
        onClose();
      }
    } finally {
      setLoadingPurchase(false);
    }
  }, [canBuy, selected, productId, addOwned, onUnlocked, onClose]);

  const handleRestore = React.useCallback(async () => {
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
  }, [setOwned, onUnlocked, onClose]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.heroWrap}>
            <LinearGradient colors={gradientColors} style={styles.heroImage}>
              {titleImage && (
                <>
                  <Image
                    source={titleImage}
                    style={styles.titleImage}
                    resizeMode="contain"
                  />
                </>
              )}
            </LinearGradient>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onClose}
              style={styles.heroClose}
            >
              <Text style={styles.heroCloseLabel}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentPad}>
            <Text style={styles.headline}>
              Unlock our complete Blitz library
            </Text>
            <View style={styles.bulletsWrap}>
              <Text style={styles.checkBullet}>
                ✓ All current & future packs
              </Text>
              <Text style={styles.checkBullet}>
                ✓ One‑time purchase • no subscription
              </Text>
              <Text style={styles.checkBullet}>
                ✓ Restores on all your devices
              </Text>
            </View>

            <View style={styles.promptTicker}>
              <Animated.View
                style={[
                  styles.promptPill,
                  {
                    borderColor: accentColor,
                    opacity: promptFade,
                    transform: [{ translateY: promptTranslate }],
                  },
                ]}
              >
                <Text style={styles.promptText} numberOfLines={1}>
                  {promptList[promptIdx]}
                </Text>
              </Animated.View>
            </View>
          </View>

          <View style={[styles.optionsWrap, styles.contentPad]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onSelectFull}
              accessibilityLabel={`Select Full Access${
                fullPrice ? `, ${fullPrice}` : ""
              }`}
              style={[
                styles.selectCard,
                selected === "full" ? styles.selectCardSelected : undefined,
              ]}
            >
              <View style={styles.selectHeader}>
                <View style={styles.selectLeft}>
                  <Radio
                    selected={selected === "full"}
                    color={accentColor}
                    size={radioOuter}
                  />
                  <Text style={styles.selectTitle}>Full Access</Text>
                </View>
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>BEST VALUE</Text>
                </View>
              </View>
              <Text style={styles.selectSub}>Unlock all Blitz packs</Text>
              <Text style={styles.selectPrice}>
                {fullPrice ?? ""}
                {fullPrice ? " • One‑time" : ""}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onSelectSingle}
              accessibilityLabel={`Select This Pack Only${
                singlePrice ? `, ${singlePrice}` : ""
              }`}
              style={[
                styles.selectCard,
                selected === "single" ? styles.selectCardSelected : undefined,
              ]}
            >
              <View style={styles.selectHeader}>
                <View style={styles.selectLeft}>
                  <Radio
                    selected={selected === "single"}
                    color={accentColor}
                    size={radioOuter}
                  />
                  <Text style={styles.selectTitle}>This Pack Only</Text>
                </View>
              </View>
              <Text style={styles.selectSub}>
                Unlock {title ?? "This Pack"}
              </Text>
              <Text style={styles.selectPrice}>
                {singlePrice ?? ""}
                {singlePrice ? " • One‑time" : ""}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentPad}>
            <TouchableOpacity
              style={[
                styles.buyButton,
                { backgroundColor: accentColor },
                !canBuy && styles.buttonDisabled,
              ]}
              disabled={!canBuy}
              onPress={handlePurchase}
              accessibilityLabel={`Continue with ${
                selected === "full" ? "Full Access" : "This Pack"
              }${currentPrice ? `, ${currentPrice}` : ""}`}
            >
              <Text style={styles.buyButtonText}>
                {loadingPurchase
                  ? "Purchasing..."
                  : currentPrice
                  ? `Continue • ${currentPrice}`
                  : "Continue"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore}>
              <Text style={styles.restoreText}>
                {loadingRestore ? "Restoring..." : "Restore Purchases"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.legal}>
              Prices are localized to your App Store region.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const Radio: React.FC<{ selected: boolean; color?: string; size?: number }> = ({
  selected,
  color,
  size,
}) => {
  const outerSize = size ?? 22;
  const innerSize = Math.round(outerSize * 0.45);

  return (
    <View
      style={[
        BASE_STYLES.radioOuter,
        { width: outerSize, height: outerSize, borderRadius: outerSize / 2 },
        selected && {
          borderColor: color || BASE_STYLES.radioOuterSelected.borderColor,
        },
      ]}
    >
      {selected ? (
        <View
          style={[
            BASE_STYLES.radioInner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: color || BASE_STYLES.radioInner.backgroundColor,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const BASE_STYLES = {
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
    zIndex: -1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  sheet: {
    width: "100%",
    maxWidth: 640,
    maxHeight: "92%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    padding: 8,
  },
  closeLabel: {
    color: "#61D4FF",
    fontSize: 20,
  },
  headerTitle: {
    fontFamily: "SourGummy",
    color: "#61D4FF",
    fontSize: 22,
    textAlign: "center",
  },
  subtitle: {
    color: "#cfe8f6",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  titleImage: {
    width: "100%",
    height: "100%",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  optionEmphasis: {
    borderWidth: 2,
    borderColor: "#61D4FF",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#61D4FF",
    borderRadius: 6,
  },
  badgeText: {
    color: "#0F2033",
    fontSize: 11,
    fontWeight: "700",
  },
  optionTitle: {
    color: "#0F2033",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  optionPrice: {
    color: "#3a516a",
    fontSize: 14,
    marginBottom: 6,
  },
  optionBullet: {
    color: "#3a516a",
    fontSize: 13,
    marginBottom: 2,
  },
  buyButton: {
    backgroundColor: "#61D4FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buyButtonText: {
    color: "#0F2033",
    fontSize: 16,
    fontWeight: "900",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9bcfee",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#61D4FF",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#61D4FF",
  },
  restoreBtn: {
    paddingVertical: 8,
    alignItems: "center",
  },
  restoreText: {
    color: "#536f86",
    fontSize: 16,
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  legal: {
    color: "#7d93a6",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  heroWrap: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    aspectRatio: 32 / 9,
  },
  heroClose: {
    position: "absolute",
    right: 10,
    top: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  heroCloseLabel: { color: "#fff", fontSize: 18 },
  contentPad: { paddingHorizontal: 16, paddingTop: 12 },
  headline: {
    color: "#0F2033",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  bulletsWrap: { marginBottom: 10 },
  checkBullet: { color: "#213b54", fontSize: 14, marginBottom: 4 },

  promptTicker: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  promptPill: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#192c43",
    borderWidth: 3,
    borderColor: "#61D4FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  promptLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginRight: 2,
  },
  promptText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "LuckiestGuy",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexShrink: 1,
  },
  selectCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d5e6f5",
    padding: 12,
    marginBottom: 12,
  },
  selectCardSelected: {
    borderColor: "#5E6AD2",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  selectLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  selectTitle: { color: "#0F2033", fontSize: 16, fontWeight: "800" },
  selectSub: { color: "#3a516a", fontSize: 13 },
  selectPrice: { color: "#3a516a", fontSize: 13, marginTop: 2 },
  discountPill: {
    backgroundColor: "#E9E8FF",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountPillText: { color: "#5E6AD2", fontSize: 12, fontWeight: "700" },
  optionsWrap: {
    paddingBottom: 8,
  },
} as const;

export default PaywallSheet;
