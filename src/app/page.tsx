"use client";
import Image from "next/image";
import Hero from "./ui/Hero";
import Map from "@/app/ui/Map";
import Recommendation from "./ui/Recommendation";
import { useHero } from "@/contexts/HeroContext";

export default function Home() {
  const { heroReady } = useHero();
  return (
    <div className="bg-[#E7E7E7]">
      <Hero />
      <Recommendation />
    </div>
  );
}
