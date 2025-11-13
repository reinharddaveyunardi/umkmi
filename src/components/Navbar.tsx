"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isMapPage = pathname === "@/app/ui/Map";

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-inner">
          <h1 className="logo">
            UMKMi.<span className="logo-accent">id</span>
          </h1>

          <div className="btn-group">
            {isMapPage ? (
              <Link href="/login">
                <button className="btn-get-started">
                  <span>Login</span>
                </button>
              </Link>
            ) : (
              <Link href={`/ui/Map.tsx`}>
                <button className="btn-get-started">
                  <span>Get Started</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR MOBILE */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>

        <div className="sidebar-buttons">
          <button className="btn-get-started">
            <span>Get Started</span>
          </button>
        </div>

        <div className="sidebar-img">
          <Image
            src="/accessories_1.png"
            alt="batik"
            fill
            className="img-cover"
            priority
          />
        </div>
      </div>
    </>
  );
}
