import React, { useEffect, useState, useRef } from "react";

interface CounterProps {
  end: number;
  duration?: number;
}

export default function Counter({ end, duration = 1500 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [startAnim, setStartAnim] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnim(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!startAnim) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [startAnim, end, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000)
      return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
    if (num >= 1_000)
      return (num / 1_000).toFixed(2).replace(/\.?0+$/, "") + "K";
    return num.toString();
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}
