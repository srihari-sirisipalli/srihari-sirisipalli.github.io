import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Calendar, Linkedin, Download } from "lucide-react";
import Hero from "@/components/sections/Hero";
import ProjectGrid from "@/components/work/ProjectGrid";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { portfolio } from "@/data/projects";
import { personal } from "@/data/personal";
import { fadeUp, staggerContainer } from "@/lib/animations";

const FEATURED_IDS = ["offshore-digital-twin", "patent-similarity", "moses-doe-pipeline"];

const featuredStats = [
  { value: "88,560", label: "Simulated sea states" },
  { value: "1.08M", label: "Model fits" },
  { value: "15,000", label: "Automated DOE cases" },
];

export default function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 300);
    }
  }, []);

  const featured = FEATURED_IDS.map((id) => portfolio.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <>
      <Hero />

      <div className="section-divider" />

      {/* Featured stats strip */}
      <SectionWrapper id="scale-preview">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {featuredStats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="glass rounded-xl p-5 sm:p-6 border-l-2 border-l-primary/60"
            >
              <div className="font-mono text-3xl sm:text-4xl font-bold text-primary leading-none mb-2">
                {s.value}
              </div>
              <div className="text-sm text-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-6">
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
          >
            See full numbers, education, and skills
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </SectionWrapper>

      <div className="section-divider" />

      {/* Featured work */}
      <SectionWrapper id="featured-work">
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Featured <span className="gradient-text">Work</span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
          </div>
          <Link
            to="/work"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
          >
            All {portfolio.length} projects
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <p className="text-text-muted max-w-2xl mb-8">
          Three projects that span the work I do most: ML infrastructure,
          large-scale simulation automation, and LLM-powered retrieval.
        </p>

        <ProjectGrid projects={featured} />

        <div className="text-center mt-8 sm:hidden">
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            All {portfolio.length} projects
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </SectionWrapper>

      <div className="section-divider" />

      {/* About teaser */}
      <SectionWrapper id="about-teaser">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              About <span className="gradient-text">Me</span>
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-4" />
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
            >
              Read the longer story
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="md:col-span-2 space-y-4">
            {personal.bio.map((p, i) => (
              <p key={i} className="text-text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <div className="section-divider" />

      {/* Contact CTA */}
      <SectionWrapper id="contact-cta">
        <div className="rounded-2xl glass p-6 sm:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Let's build something <span className="gradient-text">together</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto mb-6">
            Open to ML infrastructure, RAG, and applied R&D engagements. Reach
            out by email, grab a calendar slot, or browse the work first.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${personal.email}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-bg font-semibold text-sm hover:bg-primary-bright transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Mail size={16} aria-hidden="true" />
              Email
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Calendar size={16} aria-hidden="true" />
              Schedule a call
            </Link>
            <a
              href={personal.socialLinks[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-muted font-semibold text-sm hover:text-primary hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={personal.resumeUrl}
              download
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-surface-border text-text-muted font-semibold text-sm hover:text-primary hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Download size={16} aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
