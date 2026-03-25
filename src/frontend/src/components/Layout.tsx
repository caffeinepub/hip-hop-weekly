import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navLinks = [
  { label: "RUNDOWN", to: "/" },
  { label: "TRENDING", to: "/trending" },
  { label: "UNDERGROUND", to: "/underground" },
  { label: "BEATS", to: "/beats" },
  { label: "WATCH LIST", to: "/watch-list" },
  { label: "REVIEWS", to: "/reviews" },
  { label: "SUBMIT", to: "/submit" },
  { label: "ADMIN", to: "/admin" },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-[oklch(0.11_0_0)] border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-display font-black text-gold text-2xl tracking-tighter uppercase">
              HIP-HOP
            </span>
            <span className="font-display font-black text-gold text-2xl tracking-tighter uppercase -mt-1">
              WEEKLY
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 6).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-xs uppercase tracking-widest font-display font-semibold transition-colors ${
                  location.pathname === l.to
                    ? "text-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/submit"
              className="text-xs uppercase tracking-widest font-display font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              SUBMIT
            </Link>
            <Link
              to="/subscribe"
              className="bg-crimson hover:bg-crimson-hover text-foreground text-xs uppercase tracking-widest font-display font-bold px-4 py-2 rounded transition-colors"
            >
              SUBSCRIBE
            </Link>
            <Link
              to="/admin"
              className="text-xs uppercase tracking-widest font-display font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              ADMIN
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden bg-[oklch(0.11_0_0)] border-t border-border px-4 pb-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-xs uppercase tracking-widest font-display font-semibold transition-colors ${
                  location.pathname === l.to
                    ? "text-gold"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Secondary subnav */}
      <div className="bg-[oklch(0.13_0_0)] border-b border-border hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`whitespace-nowrap px-3 py-2 text-[10px] uppercase tracking-widest font-display font-semibold transition-colors border-b-2 ${
                  location.pathname === l.to
                    ? "border-gold text-gold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[oklch(0.08_0_0)] border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex flex-col leading-none mb-4">
                <span className="font-display font-black text-gold text-3xl tracking-tighter uppercase">
                  HIP-HOP
                </span>
                <span className="font-display font-black text-gold text-3xl tracking-tighter uppercase -mt-1">
                  WEEKLY
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your weekly source for hip-hop news, culture, and discovery.
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground uppercase tracking-wider text-xs mb-3">
                Sections
              </h4>
              <div className="flex flex-col gap-2">
                {["Weekly Rundown", "Trending", "Underground", "Beats"].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-muted-foreground text-sm hover:text-gold cursor-pointer transition-colors"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground uppercase tracking-wider text-xs mb-3">
                Features
              </h4>
              <div className="flex flex-col gap-2">
                {["Watch List", "Reviews", "Submit Track", "Subscribe"].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-muted-foreground text-sm hover:text-gold cursor-pointer transition-colors"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-foreground uppercase tracking-wider text-xs mb-3">
                Connect
              </h4>
              <div className="flex flex-col gap-2">
                {["Twitter/X", "Instagram", "YouTube", "SoundCloud"].map(
                  (t) => (
                    <span
                      key={t}
                      className="text-muted-foreground text-sm hover:text-gold cursor-pointer transition-colors"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground text-xs">
            © {new Date().getFullYear()} Hip-Hop Weekly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
