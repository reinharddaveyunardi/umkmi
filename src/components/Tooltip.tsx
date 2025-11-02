import { NearbyUMKM } from "@/interfaces/Umkm";

export default function UMKMTooltip({
  data,
  containerOffset,
}: {
  data: NearbyUMKM & { x: number; y: number };
  containerOffset: { top: number; left: number };
}) {
  const SCREEN_WIDTH = typeof window !== "undefined" ? window.innerWidth : 0;
  const TOOLTIP_WIDTH = 192;
  const OFFSET_X = 10;
  const rawLeft = containerOffset.left + data.x + OFFSET_X;
  const rawTop = containerOffset.top + data.y - 60;
  const left =
    rawLeft + TOOLTIP_WIDTH > SCREEN_WIDTH - 15
      ? containerOffset.left + data.x - TOOLTIP_WIDTH - OFFSET_X
      : rawLeft;
  const top =
    rawTop < window.scrollY + 20 ? containerOffset.top + data.y + 15 : rawTop;

  return (
    <div
      style={{
        position: "absolute",
        left: Math.max(10, left),
        top,
        pointerEvents: "none",
        zIndex: 99,
      }}
      className="w-48 bg-white p-3 rounded-lg shadow-xl border border-blue-600"
    >
      <img
        src={data.thumbnailUrl}
        alt={data.name}
        className="w-full h-16 object-cover rounded mb-2"
      />
      <p className="font-bold text-sm text-gray-900 truncate">{data.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Lat: {data.lat.toFixed(3)}, Lon: {data.lon.toFixed(3)}
      </p>
      <p
        className={`text-sm font-semibold mt-1 ${
          data.distance < 5
            ? "text-green-600 dark:text-green-400"
            : "text-orange-600 dark:text-orange-400"
        }`}
      >
        {data.distance.toFixed(2)} km away
      </p>
    </div>
  );
}
