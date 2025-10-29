"use client";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";
import { FeatureCollection } from "geojson";
import React, { useEffect, useState, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { umkmList as rawUmkmList } from "@/data/umkmdata";
import { FlattenedUMKM, NearbyUMKM, NewUMKM } from "@/interfaces/Umkm";

// Import GSAP dan Draggable
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import dynamic from "next/dynamic";

// Daftarkan plugin GSAP hanya di sisi klien
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const NEARBY_RADIUS_KM = 5;
const INDONESIA_CENTROID: [number, number] = [118, -2];

function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const toRad = (angle: number) => (angle * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const UMKMTooltip = ({
  data,
  containerOffset,
}: {
  data: NearbyUMKM & { x: number; y: number };
  containerOffset: { top: number; left: number };
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: containerOffset.left + data.x + 10,
    top: containerOffset.top + data.y - 120,
    pointerEvents: "none",
    zIndex: 100,
  };

  return (
    <div
      style={style}
      className="w-48 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 transition-opacity duration-150"
    >
      <img
        src={data.thumbnailUrl}
        alt={data.name}
        className="w-full h-16 object-cover rounded mb-2"
      />
      <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
        {data.name}
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Lat: {data.lat.toFixed(3)}, Lon: {data.lon.toFixed(3)}
      </p>
      <p
        className={`text-sm font-semibold mt-1 ${
          data.distance < NEARBY_RADIUS_KM
            ? "text-green-600 dark:text-green-400"
            : "text-orange-600 dark:text-orange-400"
        }`}
      >
        {data.distance.toFixed(2)} km away
      </p>
    </div>
  );
};

const MapComponent = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | any>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [nearby, setNearby] = useState<NearbyUMKM[]>([]);
  const [mapDimensions, setMapDimensions] = useState({
    width: 900,
    height: 500,
  });
  const [hoveredUMKM, setHoveredUMKM] = useState<
    (NearbyUMKM & { x: number; y: number }) | null
  >(null);

  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const mapGroupRef = React.useRef<SVGGElement>(null);

  const [containerOffset, setContainerOffset] = useState({ top: 0, left: 0 });

  const isMobile = mapDimensions.width < 768;
  const processedUMKMList: FlattenedUMKM[] = useMemo(() => {
    const allNestedUMKM: NewUMKM[] = Object.values(rawUmkmList).flat();

    return allNestedUMKM.map((item) => ({
      name: item.name,
      lat: item.location.lat,
      lon: item.location.long,
      thumbnailUrl: item.thumbnail,
    }));
  }, []);

  // Fungsi baru untuk mendapatkan skala saat ini
  const getCurrentScale = () => {
    if (mapGroupRef.current) {
      return gsap.getProperty(mapGroupRef.current, "scale") as number;
    }
    return 1;
  };

  const handleMouseEnter = (u: NearbyUMKM, coords: [number, number]) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setContainerOffset({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setHoveredUMKM({
      ...u,
      x: coords[0],
      y: coords[1],
    });
  };

  const handleMouseLeave = () => {
    setHoveredUMKM(null);
  };

  const processLocation = (lat: number, lon: number) => {
    sessionStorage.setItem("userPos", JSON.stringify({ lat, lon }));
    setUserPos({ lat, lon });

    const umkmWithDistance: NearbyUMKM[] = processedUMKMList.map((u) => {
      const dist = distance(lat, lon, u.lat, u.lon);
      return { ...u, distance: dist };
    });

    const nearbyUMKM = umkmWithDistance
      .filter((u) => u.distance < NEARBY_RADIUS_KM)
      .sort((a, b) => a.distance - b.distance);
    setNearby(nearbyUMKM);
  };

  useEffect(() => {
    const handleResize = () => {
      const containerWidth =
        document.getElementById("map-container")?.offsetWidth ||
        window.innerWidth;
      setMapDimensions({
        width: containerWidth,
        height: isMobile
          ? window.innerHeight - 100
          : Math.min(600, window.innerHeight - 100),
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    fetch("/indonesia.json")
      .then((response) => response.json())
      .then((topojsonData) => {
        const key =
          topojsonData.objects.indonesia_boundaries ||
          Object.keys(topojsonData.objects)[0];
        const convertedGeoJSON = topojson.feature(
          topojsonData,
          topojsonData.objects[key]
        );
        setGeoData(convertedGeoJSON);
      })
      .catch((error) => console.error("Map Data Error:", error));
  }, []);

  // 🌟 CRITICAL CHANGE HERE: High-Accuracy Geolocation Logic 🌟
  useEffect(() => {
    let locationProcessed = false;
    const DEFAULT_FALLBACK_POS = { lat: -6.593, lon: 106.8 }; // Default: Bogor/Jakarta area

    // 1. Check for cached location (to prevent re-prompting immediately)
    const storedPos = sessionStorage.getItem("userPos");
    if (storedPos) {
      const { lat, lon } = JSON.parse(storedPos);
      processLocation(lat, lon);
      locationProcessed = true;
    }

    // 2. Request new high-accuracy location if not cached
    if (!locationProcessed && navigator.geolocation) {
      const options = {
        // ESSENTIAL: Forces the device to use GPS/Wi-Fi for high precision
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds to get a good fix
        maximumAge: 0, // Ensures a new, fresh position is obtained
      };

      const locationErrorCallback = (error: GeolocationPositionError) => {
        console.error("Geolocation Error:", error.code, error.message);
        let userMessage = "Gagal mendapatkan lokasi tepat Anda.";

        // Detailed error messages for better UX
        if (error.code === error.PERMISSION_DENIED) {
          userMessage = "Akses lokasi ditolak. Menggunakan lokasi perkiraan.";
        } else if (error.code === error.TIMEOUT) {
          userMessage =
            "Waktu tunggu habis. Pastikan GPS/Wi-Fi aktif untuk akurasi tinggi.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          userMessage =
            "Lokasi tidak tersedia (sinyal lemah). Menggunakan lokasi perkiraan.";
        }

        // Fallback: Use the default location if the request fails
        processLocation(DEFAULT_FALLBACK_POS.lat, DEFAULT_FALLBACK_POS.lon);
        // Alert the user about the low accuracy fallback
        alert(userMessage + " (Akurasi saat ini rendah/menggunakan default).");
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Success: Process the high-accuracy location
          processLocation(pos.coords.latitude, pos.coords.longitude);
          console.log(
            "High-accuracy location retrieved. Accuracy:",
            pos.coords.accuracy,
            "meters"
          );
        },
        locationErrorCallback,
        options
      );
    } else if (!locationProcessed) {
      // 3. Final fallback if Geolocation API is not supported
      processLocation(DEFAULT_FALLBACK_POS.lat, DEFAULT_FALLBACK_POS.lon);
    }
  }, [processedUMKMList]);

  // useEffect baru untuk mengaktifkan Draggable (Pan)
  useEffect(() => {
    if (!mapGroupRef.current) return;

    // Draggable mengizinkan pan (geser) pada elemen <g>
    const instance = Draggable.create(mapGroupRef.current, {
      type: "x,y",
      bounds: svgRef.current,
      edgeResistance: 0.65,
      inertia: true,
      allowContextMenu: true,
      cursor: "grab",
      // Tambahkan touch-action none di elemen SVG agar Draggable berfungsi lebih baik di sentuhan
      onPress: () => {
        if (svgRef.current) {
          svgRef.current.style.touchAction = "none";
        }
      },
      onRelease: () => {
        if (svgRef.current) {
          svgRef.current.style.touchAction = "auto";
        }
      },
    });

    return () => {
      if (instance.length) instance[0].kill();
    };
  }, [mapDimensions]);

  // useEffect baru untuk mengaktifkan Wheel Zoom
  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = svgElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const currentScale = getCurrentScale();
      const zoomFactor = event.deltaY > 0 ? 0.8 : 1.25;

      let newScale = currentScale * zoomFactor;
      // Batasi zoom minimal 1 (skala normal) hingga maksimal 8
      newScale = Math.max(1, Math.min(8, newScale));

      gsap.to(mapGroupRef.current, {
        scale: newScale,
        duration: 0.2,
        ease: "power2.out",
        // Zoom di titik kursor/jari
        transformOrigin: `${mouseX}px ${mouseY}px`,
      });
    };

    svgElement.addEventListener("wheel", handleWheel);

    return () => {
      svgElement.removeEventListener("wheel", handleWheel);
    };
  }, [mapDimensions]);

  const [projection, pathGenerator] = useMemo(() => {
    if (!geoData) return [null, null];

    let proj;
    if (isMobile && userPos) {
      proj = d3
        .geoMercator()
        .center([userPos.lon, userPos.lat])
        .scale(mapDimensions.width * 30)
        .translate([mapDimensions.width / 2, mapDimensions.height / 2]);
    } else {
      proj = d3
        .geoMercator()
        .fitSize([mapDimensions.width, mapDimensions.height], geoData);
    }
    const pathGen = d3.geoPath().projection(proj);
    return [proj, pathGen];
  }, [geoData, mapDimensions, isMobile, userPos]);

  if (!geoData || !projection || !pathGenerator)
    return (
      <div className="p-8 text-center text-gray-500">Loading Map Data...</div>
    );

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      style={{ touchAction: "none" }}
      className="flex flex-col items-center select-none pt-20 w-full bg-gray-100/10 dark:bg-[#1d1d1d] min-h-screen relative"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        UMKM Map
      </h1>

      <svg
        ref={svgRef}
        width={mapDimensions.width}
        height={mapDimensions.height}
        className=" dark:border-gray-700 max-w-full"
        viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
      >
        <g ref={mapGroupRef}>
          <path
            d={pathGenerator(geoData) || ""}
            fill="#1d1d1d"
            stroke="#e4e4e4"
            strokeWidth={isMobile ? 0.1 : 0.5}
          />
          {processedUMKMList.map((u, i) => {
            const coords = projection([u.lon, u.lat]);
            if (!coords) return null;

            const dist = userPos
              ? distance(userPos.lat, userPos.lon, u.lat, u.lon)
              : Infinity;

            return (
              <g
                key={`umkm-${u.name}-${i}`}
                onMouseEnter={() =>
                  handleMouseEnter({ ...u, distance: dist }, coords)
                }
                onMouseLeave={handleMouseLeave}
              >
                {/* Tambahkan hitbox transparan agar tooltip mudah diakses */}
                <circle
                  cx={coords[0]}
                  cy={coords[1]}
                  r={isMobile ? 12 : 10}
                  fill="transparent"
                  stroke="none"
                />
                <circle
                  cx={coords[0]}
                  cy={coords[1]}
                  r={isMobile ? 3 : 3}
                  fill={dist < NEARBY_RADIUS_KM ? "green" : "blue"}
                  stroke="white"
                  strokeWidth={isMobile ? 2 : 1.5}
                />
                <title>
                  {u.name} - {dist.toFixed(2)} km
                </title>
              </g>
            );
          })}

          {userPos && projection([userPos.lon, userPos.lat]) && (
            <g key="user-pos">
              <circle
                cx={projection([userPos.lon, userPos.lat])![0]}
                cy={projection([userPos.lon, userPos.lat])![1]}
                r={isMobile ? 3 : 3}
                fill={Colors.darkRed}
                stroke={Colors.white}
                strokeWidth={isMobile ? 3 : 2}
                className="animate-pulse"
              />
              <title>Current Location</title>
            </g>
          )}
        </g>
      </svg>

      {hoveredUMKM && (
        <UMKMTooltip data={hoveredUMKM} containerOffset={containerOffset} />
      )}
      {userPos && (
        <div className="mt-8 bg-white/80 dark:bg-black/70 px-6 py-4 rounded-xl shadow-lg backdrop-blur-sm w-full max-w-sm">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100 mb-2">
            Rekomendasi Terdekat ({NEARBY_RADIUS_KM} km)
          </h2>
          <hr className="my-2 border-gray-300 dark:border-gray-700" />
          {nearby.length > 0 ? (
            nearby.map((u, i) => (
              <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                {i + 1}. {u.name} | {u.distance.toFixed(2)} km
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tidak ada UMKM dalam radius {NEARBY_RADIUS_KM} km dari lokasi
              Anda.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapComponent;

export const Map = dynamic(() => Promise.resolve(MapComponent), {
  ssr: false,
});
