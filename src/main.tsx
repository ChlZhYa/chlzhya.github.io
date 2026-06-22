import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ParticlesProvider init={async (engine) => {
        await loadSlim(engine);
      }}>
        <App />
      </ParticlesProvider>
    </HashRouter>
  </StrictMode>,
);
