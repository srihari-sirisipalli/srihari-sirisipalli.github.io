import { useEffect } from "react";
import { motion } from "framer-motion";
import Experience from "@/components/sections/Experience";
import DomainMatrix from "@/components/sections/DomainMatrix";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { fadeUp } from "@/lib/animations";

export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-28 pb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-sm font-mono text-primary mb-3">
            <span className="text-text-dim">$</span> ls /experience
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Career &amp; <span className="gradient-text">Capability</span>
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-3" />
          <p className="text-text-muted max-w-2xl">
            Roles, parallel engagements, and the cross-cutting capability map
            that connects them. Hover the timeline bars to scan periods at a
            glance, then drill into each role below.
          </p>
        </motion.div>
      </div>

      <Experience />

      <div className="section-divider" />

      <SectionWrapper id="capability-matrix">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Capability <span className="gradient-text">Matrix</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-3" />
        <p className="text-text-muted max-w-2xl mb-8">
          Where each capability has shipped: domain on one axis, technical
          surface on the other. Cell intensity tracks depth of work.
        </p>
        <DomainMatrix />
      </SectionWrapper>
    </>
  );
}
