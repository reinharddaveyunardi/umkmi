import { review, umkmDetails } from "@/interfaces/Umkm";
import Image from "next/image";
import React from "react";
import Rating from "./Rating";

export default function ReviewCard({ data }: { data: review }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between h-full border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-200">
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          <Image
            src={data.profile_photo_url}
            alt={data.author_name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{data.author_name}</p>
        </div>
      </div>

      <p className="text-gray-700 text-base mb-4 grow">"{data.text}"</p>
    </div>
  );
}
