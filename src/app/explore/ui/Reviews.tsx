// components/Reviews.jsx

import { umkmDetails } from "@/interfaces/Umkm";
import React from "react";
// Assuming you have a Rating component, though not directly used in this refactor
import Rating from "../components/Rating";
import ReviewCard from "../components/ReviewCard";

export default function Reviews({ data }: { data: umkmDetails }) {
  // Check if data or reviews exist before rendering the section
  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        <p className="text-gray-600">No reviews available for this UMKM yet.</p>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Customer Reviews
        </h2>
        <div
          className="flex space-x-6 overflow-x-auto pb-4 md:pb-6 
                     scrollbar-hide snap-x snap-mandatory 
                     md:overflow-x-scroll md:scrollbar-default"
        >
          {data.reviews.map((review, index) => (
            <div
              key={index}
              className="shrink-0 w-full sm:w-80 lg:w-96 snap-start overflow-x-scroll"
            >
              <ReviewCard data={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
