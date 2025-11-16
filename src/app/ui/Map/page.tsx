"use client";

import MapComponent from "@/app/ui/Map";
import Recommendation from "../Recommendation";

export default function Page() {
  return (
    <div className="w-full bg-[#171717]/70 backdrop-blur-sm text-white">
      <MapComponent />
      <Recommendation />
    </div>
  );
}
