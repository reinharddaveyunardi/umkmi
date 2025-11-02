"use client";

import { HeroProvider } from "@/contexts/HeroContext";
import { TransitionProvider } from "@/contexts/TransitionContext";
import TransitionCurtainController from "@/utils/TransitionController";
import Navbar from "@/components/Navbar";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider>
      <Navbar />
      <HeroProvider>
        <TransitionCurtainController>{children}</TransitionCurtainController>
      </HeroProvider>
    </TransitionProvider>
  );
}
