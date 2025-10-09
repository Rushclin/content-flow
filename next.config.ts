import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
};

export default nextConfig;
