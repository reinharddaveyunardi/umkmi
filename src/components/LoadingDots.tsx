import { useEffect, useState } from "react";

export function LoadingDots({
  text = "Loading",
  speed = 450,
}: {
  text?: string,
  speed?: number,
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setDisplay(text + ".".repeat(dots));
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="mt-4 text-[#f0f0f0] text-lg font-medium tracking-wide">
      {display}
    </p>
  );
}
