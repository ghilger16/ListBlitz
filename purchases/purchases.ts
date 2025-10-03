// RevenueCat Purchases SDK wrapper (real implementation)
// Uses guarded `require` instead of dynamic import to avoid TS module warnings.
// If the native module isn't available (e.g., Expo Go), calls will no-op safely.

let isConfigured = false;

function loadPurchases(): any | null {
  try {
    const mod = require("react-native-purchases");
    if (__DEV__) console.log("[purchases] native module loaded");
    return mod?.default ?? mod;
  } catch (e) {
    console.warn(
      "[purchases] Purchases native module not available (use a dev client or EAS build)."
    );
    return null;
  }
}

export const getEntitlements = async (): Promise<string[]> => {
  const Purchases = loadPurchases();
  if (!Purchases) return [];
  try {
    if (__DEV__)
      console.log("[purchases] getEntitlements → fetching CustomerInfo");
    const info = await Purchases.getCustomerInfo();
    const active = info?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
    if (__DEV__) {
      console.log(
        "[purchases] getEntitlements.active.entitlementIds",
        entitlementIds
      );
      console.log("[purchases] getEntitlements.active.productIds", productIds);
    }
    return Array.from(new Set([...entitlementIds, ...productIds]));
  } catch (e) {
    console.warn("[purchases] getEntitlements failed", e);
    return [];
  }
};

export const getOfferings = async (): Promise<any[]> => {
  const Purchases = loadPurchases();
  if (!Purchases) return [];
  try {
    if (__DEV__) console.log("[purchases] getOfferings → fetching offerings");
    const offerings = await Purchases.getOfferings();
    if (__DEV__)
      console.log(
        "[purchases] getOfferings.current.availablePackages",
        offerings?.current?.availablePackages?.length ?? 0
      );
    return offerings?.current?.availablePackages ?? [];
  } catch (e) {
    console.warn("[purchases] getOfferings failed", e);
    return [];
  }
};

export const getProductPrice = async (
  productId: string
): Promise<string | null> => {
  const Purchases = loadPurchases();
  if (!Purchases) return null;
  try {
    if (__DEV__) console.log("[purchases] getProductPrice for", productId);
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings?.current?.availablePackages ?? [];
    const matchFromOffering = pkgs.find(
      (p: any) => p?.product?.identifier === productId
    );
    if (matchFromOffering?.product?.priceString) {
      if (__DEV__)
        console.log(
          "[purchases] price from offering",
          matchFromOffering?.product?.priceString
        );
      return matchFromOffering.product.priceString as string;
    }
    const prods = await Purchases.getProducts([productId]);
    if (__DEV__)
      console.log(
        "[purchases] price from direct store",
        prods?.[0]?.priceString
      );
    if (Array.isArray(prods) && prods[0]?.priceString) {
      return prods[0].priceString as string;
    }
    return null;
  } catch (e) {
    console.warn("[purchases] getProductPrice failed", e);
    return null;
  }
};

export const hasFullAccess = async (): Promise<boolean> => {
  const Purchases = loadPurchases();
  if (!Purchases) return false;
  try {
    if (__DEV__)
      console.log("[purchases] hasFullAccess → fetching CustomerInfo");
    const info = await Purchases.getCustomerInfo();
    if (__DEV__)
      console.log(
        "[purchases] hasFullAccess:",
        !!info?.entitlements?.active?.all_packs
      );
    return !!info?.entitlements?.active?.all_packs;
  } catch (e) {
    console.warn("[purchases] hasFullAccess failed", e);
    return false;
  }
};

export const initPurchases = async () => {
  if (isConfigured) return;
  const Purchases = loadPurchases();
  if (!Purchases) return;
  try {
    if (__DEV__) console.log("[purchases] Initializing Purchases");
    if (Purchases.setLogLevel) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL?.DEBUG ?? 3);
    }
    const IOS_PUBLIC_KEY = "appl_foSuygGzaBNbgmabTLnsgGeagCB";
    Purchases.configure({ apiKey: IOS_PUBLIC_KEY });
    isConfigured = true;
    if (__DEV__) console.log("[purchases] configure() done");
    try {
      const info = await Purchases.getCustomerInfo();
      if (__DEV__)
        console.log(
          "[purchases] current App User ID:",
          info?.originalAppUserId
        );
    } catch {}
  } catch (e) {
    console.warn("[purchases] configure failed", e);
  }
};

export const purchaseProduct = async (productId: string): Promise<string[]> => {
  const Purchases = loadPurchases();
  if (!Purchases) return [];
  try {
    if (__DEV__) console.log("[purchases] purchaseProduct →", productId);
    const { customerInfo } = await Purchases.purchaseProduct(productId);
    const active = customerInfo?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
    if (__DEV__) {
      console.log("[purchases] purchaseProduct.entitlementIds", entitlementIds);
      console.log("[purchases] purchaseProduct.productIds", productIds);
    }
    return Array.from(new Set([...entitlementIds, ...productIds]));
  } catch (e: any) {
    if (__DEV__)
      console.log("[purchases] purchaseProduct cancelled?", !!e?.userCancelled);
    if (!e?.userCancelled) {
      console.warn("[purchases] purchaseProduct failed", e);
    }
    return [];
  }
};

export const restorePurchases = async (): Promise<string[]> => {
  const Purchases = loadPurchases();
  if (!Purchases) return [];
  try {
    if (__DEV__) console.log("[purchases] restorePurchases → fetching");
    const info = await Purchases.restorePurchases();
    const active = info?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
    if (__DEV__) {
      console.log(
        "[purchases] restorePurchases.entitlementIds",
        entitlementIds
      );
      console.log("[purchases] restorePurchases.productIds", productIds);
    }
    return Array.from(new Set([...entitlementIds, ...productIds]));
  } catch (e) {
    console.warn("[purchases] restorePurchases failed", e);
    return [];
  }
};
