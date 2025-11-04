"use client";
import { NavbarLinkProps } from "@/interfaces/Navbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarClass = isOpen ? "translate-x-1" : "translate-x-full";

  return (
    <div
      style={{
        width: "100%",
        height: "70px",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        backgroundColor: "#171717",
        boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* === Logo / Judul === */}
        <div
          style={{
            width: "100%",
            maxWidth: "200px",
            display: "flex",
            alignItems: "center",
            paddingTop: "2px",
            overflow: "visible",
          }}
        >
          <h1
            style={{
              width: "100%",
              color: "white",
              fontSize: "1.5rem",
              fontWeight: 800,
              fontStyle: "italic",
              lineHeight: "1.1",
              overflow: "visible",
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            UMKMi.<span style={{ color: "#3B82F6" }}>id</span>
          </h1>
        </div>

        {/* === Navigation Links === */}
        <div className="hidden gap-4 sm:hidden md:flex md:flex-wrap lg:flex">
          <Navigation href="/" label="Home" />
          <Navigation href="/about" label="About" />
          <Navigation href="/search" label="Search" />
        </div>

        {/* === Menu Button (Mobile) === */}
        <button
          className="flex gap-4 lg:hidden md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 dark:invert"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
            />
          </svg>
        </button>
      </div>

      {/* === Sidebar (Mobile Navigation) === */}
      <div
        className={`
          fixed top-0 right-0
          w-[40%] h-screen
          z-[999]
          bg-blue-500
          transition-transform duration-300 ease-in-out
          overflow-hidden
          rounded-tl-2xl
          shadow-2xl
          ${sidebarClass}
        `}
      >
        <div className="flex flex-col grow gap-4 pt-4 relative">
          <button
            className="self-end text-white mb-8 px-4 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={Colors.darkRed}
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="px-4 z-10">
            <Navigation href="/" label="Home" mobile />
            <Navigation href="/about" label="About" mobile />
            <Navigation href="/search" label="Search" mobile />
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-[120px] overflow-hidden">
          <Image
            src="/accessories_1.png"
            alt="corak batik"
            fill
            className="object-cover object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function Navigation({
  href,
  label,
  icon,
  mobile,
}: NavbarLinkProps & { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div className={mobile ? "pl-4 py-2" : ""}>
      {icon && icon()}
      <Link
        className={`cursor-pointer ${
          mobile ? "text-xl block text-white" : "text-lg text-white"
        } ${pathname === href ? "font-bold text-[#E00303]" : ""}`}
        href={href}
      >
        {label}
      </Link>
    </div>
  );
}
