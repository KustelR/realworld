import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("http://i.imgur.com/**")],
  },
};

export default nextConfig;
