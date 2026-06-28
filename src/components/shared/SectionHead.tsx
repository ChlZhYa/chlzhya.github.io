import { Reveal } from "./MotionPrimitives";
import type { ReactNode } from "react";

/**
 * SectionHead — 几何噪点流的大标题块。
 * 变体无衬线 + 荧光小点 kicker + 等宽代号。
 */
export function SectionHead({
  kicker,
  title,
  intro,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {kicker && (
        <Reveal delay={0.05}>
          <div className="meta mb-6 flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
            {kicker}
          </div>
        </Reveal>
      )}
      <Reveal delay={0.12}>
        <h1 className="max-w-[18ch] text-balance">{title}</h1>
      </Reveal>
      {intro && (
        <Reveal delay={0.22}>
          <p
            className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-soft"
            style={align === "center" ? { marginLeft: "auto", marginRight: "auto" } : undefined}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
