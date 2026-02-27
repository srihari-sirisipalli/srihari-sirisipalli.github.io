import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(
    navItems.map((n) => n.id),
    80
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Update URL hash when scroll spy detects section change
  useEffect(() => {
    if (activeId) {
      window.history.replaceState(null, "", `#${activeId}`);
    } else if (window.scrollY < 200) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [activeId]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.pushState(null, "", `#${id}`);
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "glass-strong py-3" : "py-5"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState(null, "", window.location.pathname);
          }}
          className="text-lg font-semibold tracking-tight min-h-[44px] min-w-[44px] flex items-center"
        >
          <span className="text-primary font-mono">&gt;</span>{" "}
          <span className="text-text">sri</span>
        </button>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  activeId === item.id
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                )}
              >
                {item.label}
                {activeId === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-full"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-3 text-text-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "w-full text-left px-6 py-3.5 text-sm font-medium transition-colors",
                      activeId === item.id
                        ? "text-primary bg-primary/5"
                        : "text-text-muted"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
