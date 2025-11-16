"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isMapPage = pathname === "/ui/Map" || pathname.startsWith("/explore/");

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-inner">
          <h1 className="logo">
            UMKMi.<span className="logo-accent">id</span>
          </h1>

          <div className="btn-group">
            {isMapPage ? (
              <Link href="/">
                <button className="btn-get-started">
                  <span>Home</span>
                </button>
              </Link>
            ) : (
              <Link href={`/ui/Map`}>
                <button className="btn-get-started">
                  <span>Get Started</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
