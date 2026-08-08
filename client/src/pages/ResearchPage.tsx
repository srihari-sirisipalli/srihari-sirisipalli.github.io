import { useEffect } from "react";
import { motion } from "framer-motion";
import { researchProjects } from "@/data/projects";
import PortfolioCard from "@/components/work/PortfolioCard";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function ResearchPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-16"
      >
        <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
          Research
        </p>
        <h1 className="font-display text-display-lg text-ink mb-6 max-w-3xl">
          Research &amp; <em className="italic text-accent">product development</em>.
        </h1>
        <p className="text-lg text-ink-soft max-w-2xl">
          Longer-horizon work: autonomous underwater systems, ML for engineering
          R&amp;D, and frameworks I use to help clients make sharper technology
          decisions.
        </p>
      </motion.div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        {researchProjects.map((p) => (
          <li key={p.id}>
            <PortfolioCard project={p} />
          </li>
        ))}
      </motion.ul>

      {researchProjects.length === 0 && (
        <p className="text-center text-ink-faint py-16">No research pieces yet.</p>
      )}
    </div>
  );
}
