import { DropSplash } from "@/components/home/DropSplash";

/**
 * 首页 — 水滴入湖面开屏动画，结束后自动流向 /workbench。
 * 首页不再承载内容，是一个仪式性过渡。
 * 同一会话仅首次访问播放（sessionStorage 记忆），之后直接跳转。
 */
export default function Home() {
  return (
    <main className="min-h-dvh bg-[var(--paper)]">
      <DropSplash />
    </main>
  );
}
