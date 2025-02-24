import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["plum-advisory-salamander-792.mypinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plum-advisory-salamander-792.mypinata.cloud",
        pathname: "/**",
      },
    ],
  },
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     fs: false,
  //     child_process: false,
  //     "fs/promises": false,
  //     async_hooks: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
