import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GrainLayer } from "@/components/chrome/GrainLayer";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { PageTransition } from "@/components/chrome/PageTransition";

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    // 不暴露品牌名/身份，仅用功能描述
    default: "open field",
    template: "%s · open field",
  },
  description:
    "A developer's field notebook — learning in AI & backend, trips and photos, and long-form notes.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="site-root">
          <GrainLayer />
          <SiteHeader />
          {/* pt-[88px] 为常驻页头高度预留，确保内容不被 fixed 页头遮挡 */}
          <div className="pt-[88px]">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </body>
    </html>
  );
}
