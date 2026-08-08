import type { ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { portfolio, type PortfolioProject } from "@/data/projects";

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
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors mb-12 link-underline"
      >
        <ArrowLeft size={14} />
        All work
      </Link>

      <header className="mb-16">
        <p className="text-sm text-accent uppercase tracking-wide font-medium mb-4">
          {project.category}
        </p>
        <h1 className="font-display text-display-lg text-ink mb-6">
          {project.title}
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          {project.description}
        </p>
        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-6">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="text-xs text-ink-soft border border-rule px-2.5 py-1 rounded-full"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="case-study-prose">{children}</div>

      <footer className="mt-16 pt-8 border-t border-rule">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-accent transition-colors link-underline"
        >
          <ArrowLeft size={14} />
          More work
        </Link>
      </footer>
    </article>
  );
}
