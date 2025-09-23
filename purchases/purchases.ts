// MOCK Purchases module for development before RevenueCat is fully set up.
// This keeps the same API surface so the rest of the app can integrate now.

// --- Mock state (in-memory; replace with AsyncStorage if you want persistence) ---
const mockOwned = new Set<string>();

// Minimal package shape used by the app (price display + identifier)
export type MockPackage = {
  product: { identifier: string; priceString: string };
};

// Define a few example products (ids should match your blitzPackIcons productId values)
const MOCK_PACKAGES: MockPackage[] = [
  { product: { identifier: "pack_snack_attack_ios", priceString: "$1.99" } },
  {
    product: { identifier: "pack_big_screen_blitz_ios", priceString: "$1.99" },
  },
  { product: { identifier: "pack_music_mania_ios", priceString: "$1.99" } },
];

// Utility: simulate network latency
function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

let isConfigured = false;

export async function initPurchases() {
  // Simulate async init
  await delay(150);
  isConfigured = true;
}

export async function getEntitlements(): Promise<string[]> {
  await delay(100);
  return Array.from(mockOwned);
}

export async function getOfferings(): Promise<MockPackage[]> {
  await delay(120);
  return MOCK_PACKAGES;
}

export async function purchaseProduct(productId: string): Promise<string[]> {
  await delay(350);
  // "Purchase" succeeds and grants entitlement = productId
  if (productId) mockOwned.add(productId);
  return Array.from(mockOwned);
}

export async function restorePurchases(): Promise<string[]> {
  await delay(250);
  // For a mock, just return whatever we've "purchased" so far
  return Array.from(mockOwned);
}
