import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github, Download } from "lucide-react";
import { personal } from "@/data/personal";
import About from "@/components/sections/About";
import ByTheNumbers from "@/components/sections/ByTheNumbers";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Leadership from "@/components/sections/Leadership";
import { fadeUp } from "@/lib/animations";

const iconMap: Record<string, React.ReactNode> = {
  LinkedIn: <Linkedin size={16} aria-hidden="true" />,
  GitHub: <Github size={16} aria-hidden="true" />,
};

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-28 pb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-sm font-mono text-primary mb-3">
            <span className="text-text-dim">$</span> cat /about
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="gradient-text">Me</span>
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-3" />
          <p className="text-text-muted max-w-2xl mb-6">
            Background, capability surface, education, and the public side of
            the work.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" />
              {personal.location}
            </span>
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <Mail size={14} aria-hidden="true" />
              {personal.email}
            </a>
            {personal.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                aria-label={link.platform}
              >
                {iconMap[link.platform]}
                {link.platform}
              </a>
            ))}
            <a
              href={personal.resumeUrl}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
            >
              <Download size={14} aria-hidden="true" />
              Resume
            </a>
          </div>
        </motion.div>
      </div>

      <About />
      <div className="section-divider" />
      <ByTheNumbers />
      <div className="section-divider" />
      <Skills />
      <div className="section-divider" />
      <Education />
      <div className="section-divider" />
      <Leadership />
    </>
  );
}
