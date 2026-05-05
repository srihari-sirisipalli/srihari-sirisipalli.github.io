import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type PortfolioProject } from "@/data/projects";
import PortfolioCard from "@/components/work/PortfolioCard";
import { staggerContainer } from "@/lib/animations";

interface ProjectGridProps {
  projects: PortfolioProject[];
  emptyMessage?: string;
}

export default function ProjectGrid({
  projects,
  emptyMessage = "No projects match the current filters.",
}: ProjectGridProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="rounded-xl bg-bg-card border border-surface-border p-12 text-center text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <PortfolioCard
            key={project.id}
            project={project}
            isExpanded={expanded === project.id}
            onToggle={() =>
              setExpanded(expanded === project.id ? null : project.id)
            }
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
