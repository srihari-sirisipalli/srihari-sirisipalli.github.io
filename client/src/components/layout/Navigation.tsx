import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { personal } from "@/data/personal";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/work", label: "Products" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Writing" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-colors duration-300",
        scrolled ? "bg-bg/90 backdrop-blur-sm border-b border-rule" : "bg-transparent",
      )}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between py-4 sm:py-5">
          <Link
            href="/"
            className="font-display text-lg sm:text-xl font-medium tracking-editorial text-ink hover:text-accent transition-colors"
          >
            {personal.name}
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-soft hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={personal.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-bg bg-ink px-4 py-2 rounded-full hover:bg-accent transition-colors"
            >
              Book a call
            </a>
          </nav>

          <button
            className="md:hidden p-2 -m-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pb-6 flex flex-col gap-4 border-t border-rule pt-5"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-ink-soft hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={personal.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-bg bg-ink px-4 py-2 rounded-full self-start hover:bg-accent transition-colors"
            >
              Book a call
            </a>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}
