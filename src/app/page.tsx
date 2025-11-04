"use client";
import Image from "next/image";
import Hero from "./ui/Hero";
import Map from "@/app/ui/Map";
import Recommendation from "./ui/Recommendation";
import { useHero } from "@/contexts/HeroContext";

export default function Home() {
  const { heroReady } = useHero();
  return (
    <div className="w-full bg-[#171717]/70 backdrop-blur-sm text-white">
      <Hero />
      <Recommendation />
    </div>
  );
}
