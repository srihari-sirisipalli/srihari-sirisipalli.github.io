import { lazy, Suspense, useEffect } from "react";
import { Link } from "wouter";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft } from "lucide-react";
import CaseStudyLayout, { getProject } from "@/components/case-study/CaseStudyLayout";
import Diagram from "@/components/case-study/Diagram";
import MetricRow from "@/components/case-study/MetricRow";
import ResultsChart from "@/components/case-study/ResultsChart";
import Callout from "@/components/case-study/Callout";
import { caseStudyModules } from "@/data/caseStudies";

const mdxComponents = {
  Diagram,
  MetricRow,
  ResultsChart,
  Callout,
};

export default function WorkDetailPage({ id }: { id: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  const project = getProject(id);
  const matchKey = Object.keys(caseStudyModules).find((k) =>
    k.endsWith(`/${id}.mdx`),
  );

  if (!project) {
    return <NotFound title="Project not found" message="That URL doesn't match any project in the portfolio." />;
  }

  if (!matchKey) {
    return (
      <NotFound
        title="No case study yet"
        message={`${project.title} doesn't have a deep-dive case study written yet. Check back soon, or browse all projects.`}
      />
    );
  }

  const LazyMDX = lazy(caseStudyModules[matchKey]);

  return (
    <CaseStudyLayout project={project}>
      <MDXProvider components={mdxComponents}>
        <Suspense
          fallback={
            <div className="text-text-muted text-sm py-8" aria-live="polite">
              Loading case study…
            </div>
          }
        >
          <LazyMDX />
        </Suspense>
      </MDXProvider>
    </CaseStudyLayout>
  );
}

function NotFound({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="text-sm font-mono text-text-dim mb-3">404</p>
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <p className="text-text-muted mb-8">{message}</p>
      <Link
        to="/work"
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to all work
      </Link>
    </div>
  );
}
