"use client";
import { NavbarLinkProps } from "@/interfaces/Navbar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Colors } from "@/constants/Colors";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarClass = isOpen ? "translate-x-0" : "translate-x-full";

  return (
    <div className="w-full h-[70px] justify-center flex fixed z-10 bg-slate-200">
      <div className="flex w-[80%] h-full justify-between items-center">
        <div>
          <Logo />
        </div>

        <div className="hidden gap-4 sm:hidden md:flex md:flex-wrap lg:flex">
          <Navigation href="/" label="Home" />
          <Navigation href="/about" label="About" />
          <Navigation href="/search" label="Search" />
        </div>

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

      <div
        className={`
          overflow-y-hidden
          flex flex-col 
          w-[40%] lg:hidden 
          h-screen absolute top-0 right-0 
          bg-[#1d1d1d] 
          transition-transform duration-300 ease-in-out
          rounded-tl-2xl
          shadow-2xl
          ${sidebarClass}
        `}
      >
        <div className="flex flex-col grow gap-4 pt-4 overflow">
          <button
            className="self-end text-white mb-8 px-4"
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

          <div className="px-1">
            <Navigation href="/" label="Home" mobile />
            <Navigation href="/about" label="About" mobile />
            <Navigation href="/search" label="Search" mobile />
          </div>

          <div className="absolute border h-auto bottom-0 w-full object-cover">
            <Image
              src={"/accessories_1.png"}
              alt="accessories_1"
              className="object-cover"
              width={500}
              height={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div>
      <Image src="/UMKMi.png" alt="UMKMi Logo" width={160} height={50} />
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
        className={`cursor-pointer ${mobile ? "text-xl block" : "text-lg"} ${
          pathname === href ? "font-bold text-[#E00303]" : "text-black"
        }`}
        href={href}
      >
        {label}
      </Link>
    </div>
  );
}
