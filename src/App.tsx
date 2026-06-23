import { useEffect } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { siteConfig } from "./content/site.config";
import Home from "./pages/Home";
import Learning from "./pages/Learning";
import Travel from "./pages/Travel";
import TravelDetail from "./pages/TravelDetail";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/travel/:slug" element={<TravelDetail />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/" end aria-label="返回首页">
        <span>{siteConfig.name}</span>
      </NavLink>

      <nav className="site-nav" aria-label="主导航">
        {siteConfig.nav.map((item) => (
          <NavLink
            key={item.target}
            to={item.target}
            end={item.target === "/"}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="header-status" aria-label="站点状态">
        <span className="status-local">本地内容<small>Local</small></span>
        <span className="status-update">持续更新<small>Update</small></span>
        <span className="status-date">最近记录<small>2025-05-31</small></span>
        <span className="status-menu" aria-hidden="true" />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>本地优先维护，再同步展示。</span>
      <span>vibe · coded</span>
    </footer>
  );
}

export default App;
