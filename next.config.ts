import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // domains: ["scarlet-calm-impala-601.mypinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scarlet-calm-impala-601.mypinata.cloud",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
