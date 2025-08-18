import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("http://i.imgur.com/**"),
      new URL("https://i.imgur.com/**"),
    ],
  },
};

export default nextConfig;
