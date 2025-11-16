"use client";

import { useEffect, useState } from "react";
import { useHero } from "@/contexts/HeroContext";
import { umkm } from "@/services/api";
import { distance } from "@/utils/Distance";
import { FlattenedUMKM } from "@/interfaces/Umkm";
import Rating from "../explore/components/Rating";
import Link from "next/link";

import "./css/Recommendation.css";

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
        .filter((u) => u !== null);

      const finalRecommendation = withDistance
        .filter((u) => u.distance < MAX_DISTANCE_METERS)
        .sort((a, b) => {
          if (a.rating !== b.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return a.distance - b.distance;
        })
        .slice(0, MAX_RECOMMENDATIONS);

      setRecommendation(finalRecommendation);
    };

    fetchData();
  }, [heroReady]);

  return (
    <section className="rekomen-wrapper">
      <h1 className="rekomen-title up">REKOMENDASI</h1>
      <h1 className="rekomen-title down">TERATAS</h1>

      <div className="rekomen-grid">
        {recommendation.map((u) => (
          <Card key={u.id} data={u} />
        ))}
      </div>

      {recommendation.length === 0 && (
        <p className="rekomen-empty">Tidak ada rekomendasi UMKM saat ini</p>
      )}
    </section>
  );
}

function Card({ data }: { data: FlattenedUMKM }) {
  if (!data) return null;

  return (
    <div className="rekomen-card">
      <figure className="rekomen-thumb">
        <img src={data.thumbnailUrl} alt={data.name} />
        <div className="rekomen-badge">{data.distance}</div>
      </figure>

      <div className="rekomen-body">
        <h2 className="rekomen-name">{data.name}</h2>

        <div className="rekomen-rating">
          <Rating rating={data.rating || 0} />
          <span className="rekomen-rating-text">
            ({data.rating?.toFixed(1) || 0})
          </span>
        </div>

        <p className="rekomen-desc">
          {data.description || "No description available."}
        </p>

        <div className="rekomen-actions">
          <Link href={`/explore/${data.id}`} className="rekomen-btn">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
