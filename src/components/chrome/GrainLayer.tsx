/**
 * 质感层 — 底层固定噪点 + 上层流动荧光光晕。
 * 全站签名质感，零交互、低透明度。
 */
export function GrainLayer() {
  return (
    <>
      <div className="noise-grain" aria-hidden="true" />
      <div className="noise-glow" aria-hidden="true" />
    </>
  );
}
