import type { NextConfig } from "next";

/**
 * 部署策略：
 * - Vercel（默认）：完整 Next.js，保留 SSR/ISR/API route 等全部能力。
 * - GitHub Pages（CI 里设 EXPORT=1）：静态导出到 out/，供 Pages 托管。
 *   Pages 是纯静态托管，需要 output:'export'，但本地开发和 Vercel 不需要。
 */
const nextConfig: NextConfig =
  process.env.EXPORT === "1"
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {};

export default nextConfig;
