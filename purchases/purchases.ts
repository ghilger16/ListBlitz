// RevenueCat Purchases SDK wrapper (real implementation)
// Uses guarded `require` instead of dynamic import to avoid TS module warnings.
// If the native module isn't available (e.g., Expo Go), calls will no-op safely.

let isConfigured = false;

function loadPurchases(): any | null {
  try {
    // Guarded require so we don't evaluate the module until needed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("react-native-purchases");
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
    const info = await Purchases.getCustomerInfo();
    const active = info?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
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
    const offerings = await Purchases.getOfferings();
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
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings?.current?.availablePackages ?? [];
    const matchFromOffering = pkgs.find(
      (p: any) => p?.product?.identifier === productId
    );
    if (matchFromOffering?.product?.priceString) {
      return matchFromOffering.product.priceString as string;
    }
    const prods = await Purchases.getProducts([productId]);
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
    const info = await Purchases.getCustomerInfo();
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
    if (Purchases.setLogLevel) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL?.DEBUG ?? 3);
    }
    const IOS_PUBLIC_KEY = "appl_foSuygGzaBNbgmabTLnsgGeagCB";
    Purchases.configure({ apiKey: IOS_PUBLIC_KEY });
    isConfigured = true;
  } catch (e) {
    console.warn("[purchases] configure failed", e);
  }
};

export const purchaseProduct = async (productId: string): Promise<string[]> => {
  const Purchases = loadPurchases();
  if (!Purchases) return [];
  try {
    const { customerInfo } = await Purchases.purchaseProduct(productId);
    const active = customerInfo?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
    return Array.from(new Set([...entitlementIds, ...productIds]));
  } catch (e: any) {
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
    const info = await Purchases.restorePurchases();
    const active = info?.entitlements?.active ?? {};
    const entitlementIds = Object.keys(active);
    const productIds = Object.values(active)
      .map((e: any) => e?.productIdentifier)
      .filter(Boolean) as string[];
    return Array.from(new Set([...entitlementIds, ...productIds]));
  } catch (e) {
    console.warn("[purchases] restorePurchases failed", e);
    return [];
  }
};
