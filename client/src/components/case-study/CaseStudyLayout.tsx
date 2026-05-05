import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { portfolio, type PortfolioProject } from "@/data/projects";
import MetricChip from "@/components/ui/MetricChip";
import Badge from "@/components/ui/Badge";

export function getProject(id: string): PortfolioProject | undefined {
  return portfolio.find((p) => p.id === id);
}

export default function CaseStudyLayout({
  project,
  children,
}: {
  project: PortfolioProject;
  children: ReactNode;
}) {
  const typeLabel =
    project.type === "rnd" ? "R&D" : project.type[0].toUpperCase() + project.type.slice(1);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-28">
      {/* Back link */}
      <Link
        to="/work"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to all work
      </Link>

      {/* Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] font-mono uppercase tracking-wider text-text-dim">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {typeLabel}
          </span>
          {project.company && <span>{project.company}</span>}
          {project.period && <span>· {project.period}</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-base text-text-dim mb-6">{project.category}</p>
        <p className="text-lg text-text-muted leading-relaxed">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {project.metrics.map((m) => (
              <MetricChip key={m.label} value={m.value} label={m.label} />
            ))}
          </div>
        )}
      </header>

      {/* MDX content */}
      <div className="case-study-prose">{children}</div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-surface-border">
        <h2 className="text-sm font-mono uppercase tracking-wider text-text-dim mb-3">
          Stack
        </h2>
        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.technologies.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          More projects
          <ExternalLink size={12} aria-hidden="true" className="ml-0.5 opacity-60" />
        </Link>
      </footer>
    </article>
  );
}
