import { useEffect, useRef } from "react";

export default function TechCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tokenLayers = ["Input", "Retrieval", "Reasoning", "Generation", "Synthesis"];
    const tokenRows = window.innerWidth < 760 ? 4 : 6;
    const nodes = tokenLayers.flatMap((layer, layerIndex) =>
      Array.from({ length: tokenRows }, (_, rowIndex) => ({
        layer,
        layerIndex,
        rowIndex,
        phase: layerIndex * 1.4 + rowIndex * 0.9,
      })),
    );

    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      const startX = width * (window.innerWidth < 760 ? 0.18 : 0.46);
      const stageWidth = width * (window.innerWidth < 760 ? 0.7 : 0.46);
      const startY = height * (window.innerWidth < 760 ? 0.52 : 0.2);
      const stageHeight = height * (window.innerWidth < 760 ? 0.38 : 0.54);
      const time = reducedMotion ? 18 : frame;

      const gradient = context.createRadialGradient(width * 0.72, height * 0.42, 10, width * 0.72, height * 0.42, width * 0.5);
      gradient.addColorStop(0, "rgba(42, 211, 255, 0.13)");
      gradient.addColorStop(0.45, "rgba(127, 232, 179, 0.07)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.lineWidth = 1;
      for (let x = 0; x < width; x += 38) {
        context.strokeStyle = "rgba(26, 46, 69, 0.035)";
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 38) {
        context.strokeStyle = "rgba(26, 46, 69, 0.035)";
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const points = nodes.map((node) => {
        const x = startX + (stageWidth / Math.max(tokenLayers.length - 1, 1)) * node.layerIndex;
        const y = startY + (stageHeight / Math.max(tokenRows - 1, 1)) * node.rowIndex;
        const drift = time * 0.018 + node.phase;
        return {
          ...node,
          x: x + Math.sin(drift) * 7,
          y: y + Math.cos(drift * 0.8) * 5,
        };
      });

      for (let layer = 0; layer < tokenLayers.length - 1; layer += 1) {
        const current = points.filter((point) => point.layerIndex === layer);
        const next = points.filter((point) => point.layerIndex === layer + 1);
        for (let index = 0; index < current.length; index += 1) {
          const from = current[index];
          const to = next[(index + layer) % next.length];
          const alpha = 0.045 + Math.sin(time * 0.026 + from.phase) * 0.02;
          context.strokeStyle = `rgba(30, 144, 206, ${Math.max(0.02, alpha)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.bezierCurveTo(from.x + 50, from.y - 26, to.x - 50, to.y + 26, to.x, to.y);
          context.stroke();
        }
      }

      context.font = "600 12px Inter, system-ui, sans-serif";
      context.textAlign = "center";

      const sigLayer = tokenLayers.length - 1;
      const sigRow = Math.floor(tokenRows / 2);
      points.forEach((point, index) => {
        const pulse = 0.35 + Math.sin(time * 0.032 + index) * 0.18;
        const isSignature = point.layerIndex === sigLayer && point.rowIndex === sigRow;
        if (isSignature) {
          context.fillStyle = "rgba(13, 109, 134, 0.18)";
          context.beginPath();
          context.arc(point.x, point.y, 7 + pulse * 1.6, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = "rgba(11, 86, 106, 0.95)";
          context.beginPath();
          context.arc(point.x, point.y, 3.4 + pulse, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillStyle = index % 5 === 0 ? "rgba(172, 239, 104, 0.45)" : "rgba(28, 172, 224, 0.34)";
          context.beginPath();
          context.arc(point.x, point.y, 2 + pulse, 0, Math.PI * 2);
          context.fill();
        }

        if (point.rowIndex === 0) {
          context.fillStyle = "rgba(16, 42, 58, 0.16)";
          context.fillText(point.layer, point.x, point.y - 18);
        }
      });

      const codeX = width * 0.79;
      const codeY = height * 0.64;
      context.textAlign = "left";
      context.font = "600 13px ui-monospace, SFMono-Regular, Consolas, monospace";
      ["Context", "Retrieval()", "Reasoning()", "Generation()"].forEach((line, index) => {
        context.fillStyle = `rgba(20, 42, 58, ${0.08 - index * 0.01})`;
        context.fillText(line, codeX, codeY + index * 22);
      });

      if (!reducedMotion && !document.hidden) {
        animation = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    const handleVisibility = () => {
      cancelAnimationFrame(animation);
      if (!document.hidden) {
        animation = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="ai-canvas" aria-hidden="true" />;
}
