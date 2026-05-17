import { motion } from "framer-motion";
import { ArrowDown, Download, Linkedin, Github } from "lucide-react";
import { personal } from "@/data/personal";

const heroStats: { value: string; label: string }[] = [
  { value: "30%", label: "Infra cost reduced" },
  { value: "R² 0.999", label: "Wave-height accuracy" },
  { value: "15K", label: "DOE cases automated" },
  { value: "20M", label: "CFD mesh elements" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: y, behavior: "smooth" });
  window.history.replaceState(null, "", `#${id}`);
}

export default function Hero() {
  const iconMap: Record<string, React.ReactNode> = {
    LinkedIn: <Linkedin size={18} aria-hidden="true" />,
    GitHub: <Github size={18} aria-hidden="true" />,
  };

  return (
    <section className="relative min-h-[100svh] min-h-screen flex items-center overflow-hidden">
      {/* Static gradient backdrop, replaces particle field */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(96,165,250,0.08), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(167,139,250,0.06), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-24">
        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-primary mb-4">
            <span className="text-text-dim">$</span> whoami
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3">
            <span className="gradient-text">{personal.name}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-muted font-medium mb-1">
            {personal.title}
          </p>
          {personal.subtitle && (
            <p className="text-sm sm:text-base text-text-dim font-mono mb-4">
              {personal.subtitle}
            </p>
          )}
          <p className="max-w-2xl text-base sm:text-lg text-text-muted leading-relaxed">
            Scalable ML systems and LLM infrastructure on top of mechanical
            engineering simulation. Surrogate models over CFD, FEA, and
            hydrodynamics; retrieval-based LLM architectures; production-aware
            experimentation pipelines.
          </p>
        </motion.div>

        {/* Outcome stat strip */}
        <motion.div
          className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-lg px-4 py-4 sm:py-5 text-left border-l-2 border-l-primary/60"
            >
              <div className="text-2xl sm:text-3xl font-bold text-primary font-mono leading-none mb-1.5">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button
            onClick={() => scrollToId("projects")}
            className="px-5 py-3 rounded-lg bg-primary text-bg font-semibold text-sm hover:bg-primary-bright active:bg-primary-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            View Work
          </button>
          <a
            href={personal.resumeUrl}
            download
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 active:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            <Download size={16} aria-hidden="true" />
            Download Resume
          </a>
          <button
            onClick={() => scrollToId("contact")}
            className="px-5 py-3 rounded-lg border border-surface-border text-text font-semibold text-sm hover:bg-surface-hover active:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Get In Touch
          </button>

          <span className="hidden sm:inline-block w-px h-6 bg-surface-border mx-2" />

          <div className="flex items-center gap-1">
            {personal.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="p-2.5 rounded-lg text-text-muted hover:text-primary hover:bg-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {iconMap[link.platform]}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 items-center gap-2 text-text-dim text-xs font-mono"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          aria-hidden="true"
        >
          <ArrowDown size={14} />
          scroll
        </motion.div>
      </div>
    </section>
  );
}
