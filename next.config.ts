import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "googleusercontent.com",
        port: "",
        pathname: "/profile/picture/**",
      },
    ],
  },
};

export default nextConfig;
