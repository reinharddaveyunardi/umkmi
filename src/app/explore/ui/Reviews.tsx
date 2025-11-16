import { umkmDetails } from "@/interfaces/Umkm";
import React from "react";
import Rating from "../components/Rating";
import ReviewCard from "../components/ReviewCard";
import "./css/Reviews.css";
import { usePathname } from "next/navigation";

export default function Reviews({ data }: { data: umkmDetails }) {
  const pathname = usePathname();
  console.log("CURRENT PATH:", pathname);

  if (!data || !data.reviews || data.reviews.length === 0) {
    return (
      <section className="reviews-wrapper">
        <h2 className="reviews-title">Reviews</h2>
        <p className="reviews-empty">Tidak ada review untuk UMKM ini.</p>
      </section>
    );
  }

  return (
    <section className="reviews-wrapper">
      <div className="reviews-container">
        <h2 className="reviews-title">Customer Reviews</h2>

        <div className="reviews-scroll">
          {data.reviews.map((review, index) => (
            <div key={index} className="review-item">
              <ReviewCard data={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
