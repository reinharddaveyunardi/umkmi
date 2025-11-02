"use client";
import React, { createContext, useContext, useState, useMemo } from "react";

interface HeroContextType {
  heroReady: boolean;
  setHeroReady: (isReady: boolean) => void;
}

const HeroContext = createContext<HeroContextType>({
  heroReady: false,
  setHeroReady: () => {},
});

export const useHero = () => useContext(HeroContext);

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [heroReady, setHeroReady] = useState(false);
  const value = useMemo(
    () => ({
      heroReady,
      setHeroReady,
    }),
    [heroReady]
  );

  return <HeroContext.Provider value={value}>{children}</HeroContext.Provider>;
}
