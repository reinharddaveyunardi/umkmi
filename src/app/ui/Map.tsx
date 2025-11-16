"use client";
import * as topojson from "topojson-client";
import * as d3 from "d3-geo";
import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Colors } from "@/constants/Colors";
import { FlattenedUMKM, NearbyUMKM } from "@/interfaces/Umkm";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import dynamic from "next/dynamic";
import { useHero } from "@/contexts/HeroContext";
import { umkm } from "@/services/api";
import Link from "next/link";
import { distance } from "@/utils/Distance";
import UMKMTooltip from "@/components/Tooltip";
import CustomLink from "@/components/CustomLink";
import { LoadingDots } from "@/components/LoadingDots";
import "./css/Map.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

function geoCircleFeature(center: [number, number], radiusKm: number) {
  const g = d3.geoCircle();
  const deg = (radiusKm / 6371) * (180 / Math.PI);
  g.center(center).radius(deg);
  return g();
}

const MapComponent = () => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [umkmList, setUmkmList] = useState<FlattenedUMKM[]>([]);
  const [nearby, setNearby] = useState<FlattenedUMKM[]>([]);
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [hoveredUMKM, setHoveredUMKM] = useState<
    (NearbyUMKM & { x: number; y: number }) | null
  >(null);
  const [mapDimensions, setMapDimensions] = useState({
    width: 900,
    height: 500,
  });
  const [containerOffset, setContainerOffset] = useState({ top: 0, left: 0 });
  const [isDataLoading, setIsDataLoading] = useState(true);

  const mapGroupRef = useRef<SVGGElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const zonePathRef = useRef<SVGPathElement>(null);
  const { setHeroReady } = useHero();
  const searchRadiusKm = 100;
  useEffect(() => {
    fetch("/indonesia.json")
      .then((r) => r.json())
      .then((data) => {
        const key =
          data.objects.indonesia_boundaries || Object.keys(data.objects)[0];
        const conv = topojson.feature(
          data,
          data.objects[key]
        ) as unknown as FeatureCollection<Point, GeoJsonProperties>;
        setGeoData(conv);
      });
  }, []);

  useEffect(() => {
    async function init() {
      setIsDataLoading(true);

      try {
        const pos = await new Promise<{ lat: number; lon: number }>(
          (resolve) => {
            navigator.geolocation.getCurrentPosition(
              (p) =>
                resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
              () => resolve({ lat: -6.593, lon: 106.8 })
            );
          }
        );
        setUserPos(pos);
        sessionStorage.setItem("coords", JSON.stringify(pos));

        const [nearbyData, allData] = await Promise.all([
          umkm.getNearby(pos.lat, pos.lon),
          umkm.getAll(),
        ]);

        setNearby(nearbyData);
        setUmkmList(allData);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setIsDataLoading(false);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (geoData && !isDataLoading) {
      setHeroReady(true);
    }
  }, [geoData, isDataLoading, setHeroReady]);

  //Resize map untuk mobile and desktop

  useEffect(() => {
    const h = () => {
      const w =
        document.getElementById("map-container")?.offsetWidth ||
        window.innerWidth;
      const newH = Math.min(600, window.innerHeight - 100);
      setMapDimensions({ width: w, height: newH });
    };
    h();
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  //Merge

  const mergedUMKM = useMemo(
    () => [...nearby, ...umkmList],
    [nearby, umkmList]
  );

  const [projection, pathGenerator] = useMemo(() => {
    if (!geoData) return [null, null];
    const proj = d3
      .geoMercator()
      .fitSize([mapDimensions.width, mapDimensions.height], geoData);
    return [proj, d3.geoPath().projection(proj)];
  }, [geoData, mapDimensions]);

  //Handler

  const handleMouseEnter = useCallback(
    (u: FlattenedUMKM, coords: [number, number]) => {
      if (!mapContainerRef.current || !userPos) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      setContainerOffset({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
      const dist = distance(userPos.lat, userPos.lon, u.lat, u.lon);
      setHoveredUMKM({ ...u, distance: dist, x: coords[0], y: coords[1] });
    },
    [userPos]
  );

  if (!geoData || !projection || !pathGenerator || isDataLoading)
    return (
      <div className="loading-screen">
        <svg
          className="w-16 h-16 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
            stroke="#f0f0f0"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <LoadingDots text="Memuat peta" />
      </div>
    );

  const userCoords = userPos && projection([userPos.lon, userPos.lat]);

  return (
    <div id="map-container" ref={mapContainerRef} className="map-container">
      <div className="map-header">
        <h1 className="map-title">Peta UMKM</h1>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/80 text-sm z-20">
        <span>Geser ke bawah</span>
        <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2">
          <path d="M5 7l5 5 5-5" />
        </svg>
      </div>

      <svg
        width={mapDimensions.width}
        height={mapDimensions.height}
        viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}
        className="map-svg"
      >
        <g ref={mapGroupRef}>
          <path
            d={pathGenerator(geoData) || ""}
            fill="#9e9e9e"
            stroke="#9e9e9e"
            strokeWidth={0.6}
          />

          {userPos && userCoords && (
            <path
              ref={zonePathRef}
              d={
                pathGenerator(
                  geoCircleFeature([userPos.lon, userPos.lat], searchRadiusKm)
                ) || ""
              }
              fill={Colors.green}
              fillOpacity={0.1}
              stroke={Colors.green}
              strokeWidth={1}
              className="animate-pulse"
            />
          )}

          {mergedUMKM.map((u, i) => {
            const coords = projection([u.lon, u.lat]);
            if (!coords) return null;
            const dist = userPos
              ? distance(userPos.lat, userPos.lon, u.lat, u.lon)
              : Infinity;

            const colorPalette = [
              "#CC4629",
              "#CC9C00",
              "#29CC49",
              "#29A3CC",
              "#7A29CC",
              "#CC2986",
              "#CC7029",
            ];

            const randomColor = colorPalette[i % colorPalette.length];
            return (
              <CustomLink key={`umkm-${u.name}-${i}`} href={`/explore/${u.id}`}>
                <g
                  onMouseEnter={() => handleMouseEnter(u, coords)}
                  onMouseLeave={() => setHoveredUMKM(null)}
                >
                  <circle
                    cx={coords[0]}
                    cy={coords[1]}
                    r={10}
                    fill="rgba(0,0,0,0)"
                    pointerEvents="all"
                    cursor="pointer"
                  />
                  <circle
                    cx={coords[0]}
                    cy={coords[1]}
                    r={3}
                    fill={
                      dist < searchRadiusKm ? randomColor : `${randomColor}90`
                    }
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              </CustomLink>
            );
          })}
        </g>
      </svg>

      {hoveredUMKM && (
        <UMKMTooltip data={hoveredUMKM} containerOffset={containerOffset} />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(MapComponent), { ssr: false });
