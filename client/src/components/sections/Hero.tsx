import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Linkedin, Github } from "lucide-react";
import { personal } from "@/data/personal";
import ParticleField from "@/components/ui/ParticleField";

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const lines = personal.roles;

  useEffect(() => {
    const currentLine = lines[lineIndex];

    if (!isDeleting && charIndex < currentLine.length) {
      const timer = setTimeout(() => setCharIndex((c) => c + 1), 60);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && charIndex === currentLine.length) {
      const timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex > 0) {
      const timer = setTimeout(() => setCharIndex((c) => c - 1), 30);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setLineIndex((i) => (i + 1) % lines.length);
    }
  }, [charIndex, isDeleting, lineIndex, lines]);

  useEffect(() => {
    setDisplayText(lines[lineIndex].slice(0, charIndex));
  }, [charIndex, lineIndex, lines]);

  const iconMap: Record<string, React.ReactNode> = {
    LinkedIn: <Linkedin size={18} />,
    GitHub: <Github size={18} />,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Terminal window */}
        <motion.div
          className="terminal-window max-w-2xl mx-auto text-left mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-terminal-red" />
            <div className="terminal-dot bg-terminal-yellow" />
            <div className="terminal-dot bg-terminal-green" />
            <span className="ml-2 text-xs text-text-dim font-mono">
              sri_hari@portfolio ~ $
            </span>
          </div>
          <div className="p-5 md:p-6 font-mono text-sm md:text-base leading-relaxed">
            <p className="text-text-dim">
              <span className="text-terminal-purple">const</span>{" "}
              <span className="text-terminal-blue">engineer</span>{" "}
              <span className="text-text-dim">=</span>{" "}
              <span className="text-terminal-yellow">{"{"}</span>
            </p>
            <p className="pl-4">
              <span className="text-terminal-cyan">name</span>
              <span className="text-text-dim">:</span>{" "}
              <span className="text-terminal-green">
                "{personal.name}"
              </span>
              <span className="text-text-dim">,</span>
            </p>
            <p className="pl-4">
              <span className="text-terminal-cyan">role</span>
              <span className="text-text-dim">:</span>{" "}
              <span className="text-terminal-green">
                "{displayText}
                <span className="animate-blink text-primary">|</span>"
              </span>
              <span className="text-text-dim">,</span>
            </p>
            <p className="pl-4">
              <span className="text-terminal-cyan">experience</span>
              <span className="text-text-dim">:</span>{" "}
              <span className="text-terminal-green">"4+ years"</span>
              <span className="text-text-dim">,</span>
            </p>
            <p className="pl-4">
              <span className="text-terminal-cyan">domains</span>
              <span className="text-text-dim">:</span>{" "}
              <span className="text-text-dim">[</span>
              <span className="text-terminal-green">"GenAI"</span>
              <span className="text-text-dim">,</span>{" "}
              <span className="text-terminal-green">"Cloud"</span>
              <span className="text-text-dim">,</span>{" "}
              <span className="text-terminal-green">"Defense"</span>
              <span className="text-text-dim">,</span>{" "}
              <span className="text-terminal-green">"Offshore"</span>
              <span className="text-text-dim">,</span>
            </p>
            <p className="pl-4">
              {"  "}
              <span className="text-terminal-green">"Agritech"</span>
              <span className="text-text-dim">,</span>{" "}
              <span className="text-terminal-green">"Biometrics"</span>
              <span className="text-text-dim">,</span>{" "}
              <span className="text-terminal-green">"Data Eng"</span>
              <span className="text-text-dim">]</span>
            </p>
            <p>
              <span className="text-terminal-yellow">{"}"}</span>
              <span className="text-text-dim">;</span>
            </p>
          </div>
        </motion.div>

        {/* CTA + social */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#projects"
              className="px-6 py-3 rounded-lg bg-primary text-bg font-semibold text-sm hover:bg-primary-bright transition-colors"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-lg border border-surface-border text-text font-semibold text-sm hover:bg-surface-hover transition-colors"
            >
              Get In Touch
            </a>
          </div>

          <div className="flex items-center gap-3">
            {personal.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-surface-hover transition-colors"
              >
                {iconMap[link.platform]}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-text-dim" />
        </motion.div>
      </div>
    </section>
  );
}
