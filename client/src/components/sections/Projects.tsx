import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Waves, Cog, Fingerprint, TrendingUp, BarChart3,
  Plane, Atom, Film, Zap, FileSearch, ArrowRightLeft,
  LayoutDashboard, ChevronDown,
} from "lucide-react";
import { portfolio, type PortfolioProject } from "@/data/projects";
import SectionWrapper from "@/components/layout/SectionWrapper";
import TiltCard from "@/components/ui/TiltCard";
import Badge from "@/components/ui/Badge";
import { staggerContainer, scaleIn } from "@/lib/animations";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Bot: <Bot size={20} />,
  Waves: <Waves size={20} />,
  Cog: <Cog size={20} />,
  Fingerprint: <Fingerprint size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Plane: <Plane size={20} />,
  Atom: <Atom size={20} />,
  Film: <Film size={20} />,
  Zap: <Zap size={20} />,
  FileSearch: <FileSearch size={20} />,
  ArrowRightLeft: <ArrowRightLeft size={20} />,
  LayoutDashboard: <LayoutDashboard size={20} />,
};

type Filter = "all" | "professional" | "rnd" | "academic";

const filterLabels: Record<Filter, string> = {
  all: "All",
  professional: "Professional",
  rnd: "R&D",
  academic: "Academic",
};

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = portfolio.filter(
    (p) => filter === "all" || p.type === filter
  );

  return (
    <SectionWrapper id="projects">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Portfolio</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-3" />
      <p className="text-text-muted max-w-2xl mb-8">
        A collection of professional, R&D, and academic projects across AI/ML,
        cloud infrastructure, computer vision, and engineering simulation.
      </p>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {(Object.keys(filterLabels) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setExpanded(null);
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === f
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-text-muted hover:text-text border border-transparent hover:border-surface-border"
            )}
          >
            {filterLabels[f]}
            <span className="ml-1.5 text-xs text-text-dim">
              ({portfolio.filter((p) => f === "all" || p.type === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Project grid */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
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
    </SectionWrapper>
  );
}

function PortfolioCard({
  project,
  isExpanded,
  onToggle,
}: {
  project: PortfolioProject;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const typeColor = {
    professional: "text-terminal-green bg-terminal-green/10",
    rnd: "text-terminal-blue bg-terminal-blue/10",
    academic: "text-terminal-purple bg-terminal-purple/10",
  };

  return (
    <motion.div
      variants={scaleIn}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <TiltCard className="h-full">
        <div className="glass rounded-xl p-6 h-full flex flex-col hover:bg-surface-hover transition-colors group">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                {iconMap[project.icon] || <Cog size={20} />}
              </div>
              <div>
                <span
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full",
                    typeColor[project.type]
                  )}
                >
                  {project.type === "rnd" ? "R&D" : project.type}
                </span>
                {project.company && (
                  <span className="text-[10px] text-text-dim ml-2">
                    {project.company}
                  </span>
                )}
              </div>
            </div>
            {project.period && (
              <span className="text-[10px] text-text-dim font-mono shrink-0 mt-1">
                {project.period}
              </span>
            )}
          </div>

          {/* Title & description */}
          <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors mb-1">
            {project.title}
          </h3>
          <p className="text-xs text-text-dim mb-2">{project.category}</p>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Expand button */}
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors mb-3"
          >
            {isExpanded ? "Hide details" : "View details"}
            <ChevronDown
              size={14}
              className={cn("transition-transform", isExpanded && "rotate-180")}
            />
          </button>

          {/* Expanded highlights */}
          <AnimatePresence>
            {isExpanded && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 mb-4 overflow-hidden"
              >
                {project.highlights.map((h, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2 text-sm text-text-muted"
                  >
                    <span className="text-primary mt-1 shrink-0">▹</span>
                    {h}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
