import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { type PortfolioProject } from "@/data/projects";
import { caseStudySlugs } from "@/data/caseStudies";
import { staggerItem } from "@/lib/animations";

interface PortfolioCardProps {
  project: PortfolioProject;
}

export default function PortfolioCard({ project }: PortfolioCardProps) {
  const hasCaseStudy = caseStudySlugs.has(project.id);
  // Prefer internal case study over external href when both exist,
  // so cards open a proper work page instead of jumping to the client's site.
  const externalHref = hasCaseStudy ? undefined : project.href;

  const inner = (
    <article className="group h-full flex flex-col">
      <div className="aspect-[16/10] rounded-xl overflow-hidden bg-accent-soft border border-rule mb-4 group-hover:border-accent transition-colors">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/work/placeholder.svg";
          }}
        />
      </div>
      <p className="text-xs text-ink-faint uppercase tracking-wide mb-2 font-medium">
        {project.category}
      </p>
      <h3 className="font-display text-xl text-ink mb-2 flex items-start gap-2 group-hover:text-accent transition-colors">
        <span>{project.title}</span>
        {externalHref && (
          <ArrowUpRight size={16} className="text-ink-faint mt-1.5 group-hover:text-accent transition-colors" />
        )}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        {project.description}
      </p>
      <ul className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="text-xs text-ink-soft border border-rule px-2.5 py-1 rounded-full"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );

  return (
    <motion.div variants={staggerItem}>
      {externalHref ? (
        <a href={externalHref} target="_blank" rel="noopener noreferrer">
          {inner}
        </a>
      ) : hasCaseStudy ? (
        <Link href={`/work/${project.id}`}>{inner}</Link>
      ) : (
        <div>{inner}</div>
      )}
    </motion.div>
  );
}
