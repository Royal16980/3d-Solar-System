import type { NextConfig } from "next";
import { withEve } from "eve/next";

const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        ...(process.env.PAGES_BASE_PATH
          ? { basePath: process.env.PAGES_BASE_PATH }
          : {}),
        images: { unoptimized: true },
      }
    : {
        images: {
          remotePatterns: [
            { protocol: "https", hostname: "upload.wikimedia.org" },
            { protocol: "https", hostname: "apod.nasa.gov" },
          ],
        },
      }),
};

export default isStaticExport
  ? nextConfig
  : withEve(nextConfig, {
      eveBuildCommand: "npm run build:eve",
    });
