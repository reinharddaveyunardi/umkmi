"use client";
import { useParams } from "next/navigation";
import Hero from "../ui/Hero";
import { useEffect, useState } from "react";
import { umkmDetails } from "@/interfaces/Umkm";
import { umkm } from "@/services/api";
import gsap from "gsap";
import { useHero } from "@/contexts/HeroContext";
import Reviews from "../ui/Reviews";

const dayIndexToKey: Record<number, string> = {
  0: "sun",
  1: "mon",
  2: "tue",
  3: "wed",
  4: "thu",
  5: "fri",
  6: "sat",
};

const formatPriceRange = ({ min, max }: { min: number; max: number }) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  if (min === max) return formatter.format(min);
  return `${formatter.format(min)} - ${formatter.format(max)}`;
};

export default function Page() {
  const [data, setData] = useState<umkmDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { setHeroReady } = useHero();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const umkmId = params.id as string;
        const fetchedData = await umkm.getDetails(umkmId);
        if (fetchedData) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setData(fetchedData as umkmDetails);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      } finally {
        setIsLoading(false);
        setHeroReady(true);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-blue-600">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 animate-spin text-white/50"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-200"
            ></path>
          </svg>
          <p className="mt-4 text-white text-lg">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{ backgroundColor: "#1d1d1d" }}
        className="min-h-screen flex items-center justify-center p-10"
      >
        <div className="text-white text-center">
          <h1 className="text-8xl font-bold text-red-500">404</h1>
          <p className="text-2xl mt-4">UMKM with ID {params.id} not found.</p>
          <p className="text-gray-400 mt-2">
            The requested detail page does not exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }
  if (data) {
    const {
      name,
      thumbnail,
      address,
      albums,
      dine_in,
      id,
      location,
      opening_hours,
      phone_number,
      rating,
      reviews,
      take_away,
      user_ratings_total,
    } = data;

    console.log(data);
    return (
      <div className="bg-[#dcdcdc] min-h-screen">
        <Hero data={data} />
        <Reviews data={data} />
      </div>
    );
  }
  return null;
}
