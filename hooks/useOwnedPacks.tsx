import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Simple ownership store for pack entitlements.
 * Holds a set of entitlement ids (or productIds) and exposes helpers.
 */

type OwnedContextType = {
  owned: Set<string>;
  setOwned: (ids: string[]) => void; // replace all
  addOwned: (ids: string[]) => void; // add/merge
  isOwned: (id?: string | null) => boolean;
  hasFullAccess: boolean;
};

const OwnedContext = createContext<OwnedContextType | undefined>(undefined);

export const OwnedProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [owned, setOwnedState] = useState<Set<string>>(new Set());

  const api = useMemo<OwnedContextType>(
    () => ({
      owned,
      setOwned: (ids: string[]) => setOwnedState(new Set(ids.filter(Boolean))),
      addOwned: (ids: string[]) =>
        setOwnedState((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => id && next.add(id));
          return next;
        }),
      isOwned: (id?: string | null) => (!!id ? owned.has(id) : false),
      hasFullAccess: owned.has("com.listblitz.app.iap.all_packs"),
    }),
    [owned]
  );

  return <OwnedContext.Provider value={api}>{children}</OwnedContext.Provider>;
};

export const useOwnedPacks = () => {
  const ctx = useContext(OwnedContext);
  if (!ctx)
    throw new Error("useOwnedPacks must be used inside <OwnedProvider>");
  return ctx;
};
