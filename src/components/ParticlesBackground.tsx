import { useMemo } from "react";
import Particles from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";

type Theme = "learning" | "travel";

const palettes: Record<Theme, { particles: string[]; link: string }> = {
  learning: { particles: ["#14b8d8", "#3d7cff"], link: "#14b8d8" },
  travel: { particles: ["#9bdc45", "#ffb547", "#ff7d61"], link: "#9bdc45" },
};

function buildOptions(theme: Theme, reducedMotion: boolean): ISourceOptions {
  const palette = palettes[theme];
  return {
    fullScreen: { enable: false },
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: { value: 30, density: { enable: true } },
      color: { value: palette.particles },
      links: {
        enable: true,
        distance: 130,
        color: { value: palette.link },
        opacity: 0.1,
        width: 1,
      },
      move: {
        enable: !reducedMotion,
        speed: reducedMotion ? 0 : 0.5,
        outModes: { default: "out" as const },
      },
      opacity: { value: { min: 0.08, max: 0.35 } },
      size: { value: { min: 1, max: 2.4 } },
    },
    interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
  };
}

export default function ParticlesBackground({ theme }: { theme: Theme }) {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const options = useMemo(() => buildOptions(theme, reducedMotion), [theme, reducedMotion]);

  return <Particles id={`particles-${theme}`} className="page-particles" options={options} />;
}
