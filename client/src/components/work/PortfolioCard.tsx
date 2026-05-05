import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Bot, Waves, Cog, Fingerprint, TrendingUp, BarChart3,
  Plane, Atom, Film, Zap, FileSearch, ArrowRightLeft,
  LayoutDashboard, ChevronDown, ArrowRight,
} from "lucide-react";
import { type PortfolioProject } from "@/data/projects";
import { caseStudySlugs } from "@/data/caseStudies";
import Badge from "@/components/ui/Badge";
import MetricChip from "@/components/ui/MetricChip";
import { scaleIn } from "@/lib/animations";
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

const typeColor = {
  professional: "text-terminal-green bg-terminal-green/10",
  rnd: "text-terminal-blue bg-terminal-blue/10",
  academic: "text-terminal-purple bg-terminal-purple/10",
} as const;

interface PortfolioCardProps {
  project: PortfolioProject;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function PortfolioCard({
  project,
  isExpanded,
  onToggle,
}: PortfolioCardProps) {
  const hasCaseStudy = caseStudySlugs.has(project.id);

  return (
    <motion.div
      variants={scaleIn}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full">
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
                    "text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full",
                    typeColor[project.type],
                  )}
                >
                  {project.type === "rnd" ? "R&D" : project.type}
                </span>
                {project.company && (
                  <span className="text-[11px] text-text-dim ml-2">
                    {project.company}
                  </span>
                )}
              </div>
            </div>
            {project.period && (
              <span className="text-[11px] text-text-dim font-mono shrink-0 mt-1">
                {project.period}
              </span>
            )}
          </div>

          {/* Title (links to case study if available) */}
          {hasCaseStudy ? (
            <Link
              to={`/work/${project.id}`}
              className="text-lg font-semibold text-text hover:text-primary group-hover:text-primary transition-colors mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
            >
              {project.title}
            </Link>
          ) : (
            <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors mb-1">
              {project.title}
            </h3>
          )}
          <p className="text-xs text-text-dim mb-2">{project.category}</p>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Metric chips */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.metrics.map((m) => (
                <MetricChip key={m.label} value={m.value} label={m.label} />
              ))}
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={onToggle}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Hide" : "Show"} details for ${project.title}`}
              className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary active:text-primary transition-colors py-2 -my-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
            >
              {isExpanded ? "Hide details" : "View details"}
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={cn("transition-transform", isExpanded && "rotate-180")}
              />
            </button>
            {hasCaseStudy && (
              <Link
                to={`/work/${project.id}`}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded py-2 -my-1"
                aria-label={`Read full case study for ${project.title}`}
              >
                Read case study
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
          </div>

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
      </div>
    </motion.div>
  );
}
