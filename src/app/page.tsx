import Image from "next/image";
import Hero from "./ui/Hero";
import Map from "@/api/Map";

export default function Home() {
  return (
    <div className="bg-[#1d1d1d]">
      <Hero />
    </div>
  );
}
