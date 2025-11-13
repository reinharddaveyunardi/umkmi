"use client";

import React, { useEffect, useState, useRef } from "react";
import "@/app/ui/css/LandingPage.css";
import Counter from "@/components/Counter";
import { umkm } from "@/services/api";
import { useHero } from "@/contexts/HeroContext";

const images = ["/DUMMY ADS/1.jpg", "/DUMMY ADS/2.jpg", "/DUMMY ADS/3.jpg"];

export default function LandingPage() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const { setHeroReady } = useHero();
  const [umkmCount, setUmkmCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const allData = await umkm.getAll();
        setUmkmCount(allData.length);
        setHeroReady(true);
      } catch (err) {
        console.error("Gagal ambil data UMKM:", err);
        setHeroReady(true);
      }
    }

    fetchData();
  }, [setHeroReady]);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleClick = (i: number) => {
    setIndex(i);
    startAutoScroll();
  };

  //geser
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    stopAutoScroll();
    isDraggingRef.current = true;
    startXRef.current =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || startXRef.current === null) return;
    const currentX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = currentX - startXRef.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) prevSlide();
      else nextSlide();
      isDraggingRef.current = false; //sekali geser
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    startXRef.current = null;
    startAutoScroll();
  };

  const getPosition = (i: number) => {
    const diff = (i - index + images.length) % images.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === 2) return "left";
    return "hidden";
  };

  return (
    <div className="landing-wrapper">
      <div className="landing-wrapper-info">
        <div className="landing-container">
          <div className="landing-up">
            <div className="landing-up-left">
              <div className="landing-up-left-text up">TEMUKAN UMKM</div>
              <div className="landing-up-left-text down">LOCALMU</div>
              <div className="landing-up-left-desc">
                Jelajahi peta interaktif untuk mendukung pelaku usaha Indonesia.
              </div>
            </div>
            <div className="landing-up-right">
              <div className="stat-card">
                <div className="stat-number">#1</div>
                <div className="stat-desc">
                  Platform untuk seluruh Indonesia
                </div>
              </div>
            </div>
          </div>

          <div className="landing-desc-container">
            <div className="landing-desc">
              <div className="landing-desc-text">
                UMKMi memudahkan kamu menemukan usaha kecil di seluruh
                Indonesia, mulai dari kuliner rumahan sampai pengrajin lokal.
              </div>
              <div className="landing-desc-text bold">
                Jelajahi, dukung, dan bantu UMKM tumbuh.
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="landing-card-container">
            <div className="card-container">
              <div className="card">
                <div className="card-number">
                  <Counter end={6436} />
                </div>
                <div className="card-info">Pengunjung</div>
              </div>
              <div className="card">
                <div className="card-number">
                  <Counter end={umkmCount ?? 0} />
                </div>
                <div className="card-info">UMKM Terdaftar</div>
              </div>
              <div className="card">
                <div className="card-number">
                  <Counter end={38} />
                </div>
                <div className="card-info">Provinsi Terjangkau</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kenapa */}
      <div className="landing-wrapper-others">
        <div className="landing-kenapa">
          <div className="kenapa-title">
            KENAPA <span>UMKMi?</span>
          </div>
          <div className="kenapa-desc">
            Karena UMKMi hadir untuk membantu pelaku usaha lokal berkembang dan
            dikenal lebih luas di seluruh Indonesia.
          </div>
        </div>

        {/* Card Kenapa */}
        <div className="landing-card-why-container">
          <div className="card-why-container">
            <div className="card-why">
              <div className="card-why-number">1</div>
              <div className="card-why-text">
                Peta interaktif seluruh Indonesia
              </div>
            </div>
            <div className="card-why">
              <div className="card-why-number">2</div>
              <div className="card-why-text">Gratis untuk pelaku UMKM</div>
            </div>
            <div className="card-why">
              <div className="card-why-number">3</div>
              <div className="card-why-text">
                Dapat diakses di semua perangkat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Iklan UMKM */}
      <div
        className="umkm-img-ads-section"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
      >
        <div className="img-ads-title">Semua UMKM ada di satu platform!</div>
        <div
          className="umkm-img-ads"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className={`umkm-item ${getPosition(i)}`}
              onClick={() => handleClick(i)}
            >
              <img src={src} alt={`umkm-${i}`} draggable={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Ajakan */}
      <div className="landing-wrapper-others">
        <div className="landing-ajakan-container">
          <div className="ajakan-text">
            <div className="ajakan-text up">YUK!</div>
            <div className="ajakan-text down">DUKUNG UMKM INDONESIA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
