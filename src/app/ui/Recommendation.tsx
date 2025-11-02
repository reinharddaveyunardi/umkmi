"use client";

import { useEffect, useState } from "react";
import { useHero } from "@/contexts/HeroContext";
import { umkm } from "@/services/api";
import { distance } from "@/utils/Distance";
import { FlattenedUMKM } from "@/interfaces/Umkm";
import Rating from "../explore/components/Rating";
import { Colors } from "@/constants/Colors";
import Link from "next/link";

const MAX_DISTANCE_METERS = 10000;
const MAX_RECOMMENDATIONS = 6;

export default function Recommendation() {
  const [recommendation, setRecommendation] = useState<FlattenedUMKM[]>([]);
  const { heroReady } = useHero();

  useEffect(() => {
    const fetchData = async () => {
      const userCoordsStr = sessionStorage.getItem("coords");
      const userCoords = userCoordsStr ? JSON.parse(userCoordsStr) : null;
      if (!userCoords) return;

      const nearby = await umkm.getNearby(userCoords.lat, userCoords.lon);
      const userLat = parseFloat(userCoords.lat);
      const userLon = parseFloat(userCoords.lon || userCoords.long);

      const withDistance = nearby
        .map((u: FlattenedUMKM) => {
          const umkmLat = parseFloat(u.lat as unknown as string);
          const umkmLon = parseFloat(u.lon as unknown as string);

          if (
            isNaN(userLat) ||
            isNaN(userLon) ||
            isNaN(umkmLat) ||
            isNaN(umkmLon)
          ) {
            return null;
          }

          return {
            ...u,
            distance: distance(userLat, userLon, umkmLat, umkmLon),
          };
        })
        .filter(
          (u): u is FlattenedUMKM & { distance: number } =>
            u !== null && u.distance !== undefined
        );

      const filteredByDistance = withDistance.filter(
        (u) => u.distance < MAX_DISTANCE_METERS
      );
      const sortedRecommendation = filteredByDistance.sort((a, b) => {
        if (a.rating !== b.rating) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return a.distance - b.distance;
      });
      const finalRecommendation = sortedRecommendation.slice(
        0,
        MAX_RECOMMENDATIONS
      );

      setRecommendation(finalRecommendation);
    };
    fetchData();
  }, [heroReady]);
  return (
    <section
      className={`flex flex-col items-center p-4 sm:p-6 md:p-8 bg-[#92B4F4] min-h-screen`}
    >
      <h1 className="text-3xl font-extrabold mb-8 text-black pb-2">
        Top {MAX_RECOMMENDATIONS} Recommendations Near You
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:max-w-full lg:grid-cols-3 gap-6 w-full lg:max-w-[80%] sm:p-16 lg:p-16">
        {recommendation.map((u) => (
          <Card key={u.id} data={u} />
        ))}
      </div>

      {recommendation.length === 0 && (
        <p className="text-gray-500 mt-12 text-lg p-6 bg-white rounded-lg shadow-inner">
          Tidak ada rekomendasi UMKM yang cocok dalam jarak{" "}
          {MAX_DISTANCE_METERS / 1000} km.
        </p>
      )}
    </section>
  );
}

function Card({ data }: { data: FlattenedUMKM }) {
  if (!data) return null;
  return (
    <div className="card bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 transform">
      <figure className="relative h-36 w-full">
        <img
          src={data.thumbnailUrl}
          alt={data.name}
          className="w-full h-full object-cover rounded-t-xl"
        />
        <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
          {data.distance}
        </div>
      </figure>
      <div className="card-body p-5">
        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
          {data.name}
        </h2>

        <div className="flex items-center space-x-3 my-1">
          <Rating rating={data.rating || 0} />
          <span className="text-sm text-gray-600 font-medium">
            ({data.rating?.toFixed(1) || 0})
          </span>
        </div>

        <p className="text-sm text-gray-700 mt-1 line-clamp-2 h-10">
          {data.description || "No description available."}
        </p>

        <div className="card-actions h-10 items-center justify-start flex">
          <Link
            href={`/explore/${data.id}`}
            className="w-32 items-center justify-center flex p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-150 shadow-md transform "
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
