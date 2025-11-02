"use client";
import React, { createContext, useContext, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

interface TransitionContextType {
  transitionToNewPage: (href: string) => void;
  curtainRef: React.MutableRefObject<any>;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export const usePageTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error(
      "usePageTransition must be used within a TransitionProvider"
    );
  }
  return context;
};

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const curtainRef = useRef(null);

  const transitionToNewPage = useCallback(
    (href: string) => {
      gsap.to(curtainRef.current, {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.inOut",
        transformOrigin: "top",
        onComplete: () => {
          router.push(href);
        },
      });
    },
    [router]
  );

  const contextValue = {
    transitionToNewPage,
    curtainRef,
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
    </TransitionContext.Provider>
  );
}
