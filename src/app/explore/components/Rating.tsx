import React from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

export default function Rating({ rating }: { rating: number }) {
  const isWhole = Number.isInteger(rating);
  const fullStars = isWhole ? rating : Math.floor(rating);
  const decimal = rating - fullStars;
  const halfStar = !isWhole && decimal > 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex text-yellow-400 items-center">
      {Array.from({ length: fullStars }, (_, i) => (
        <AiFillStar key={`full-${i}`} />
      ))}
      {halfStar === 1 && <AiFillStar key="half" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <AiOutlineStar key={`empty-${i}`} />
      ))}
    </div>
  );
}
