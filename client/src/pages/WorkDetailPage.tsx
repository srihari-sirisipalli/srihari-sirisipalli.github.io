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
    return <NotFound title="Product not found" message="That URL doesn't match any product in the portfolio." />;
  }

  if (!matchKey) {
    return (
      <NotFound
        title="No write-up yet"
        message={`${project.title} does not have a written case study yet. Coming soon.`}
      />
    );
  }

  const LazyMDX = lazy(caseStudyModules[matchKey]);

  return (
    <CaseStudyLayout project={project}>
      <MDXProvider components={mdxComponents}>
        <Suspense
          fallback={
            <div className="text-ink-faint text-sm py-8" aria-live="polite">
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
    <div className="max-w-3xl mx-auto px-5 pt-32 pb-24 text-center">
      <p className="text-sm text-ink-faint mb-3">404</p>
      <h1 className="font-display text-display-md text-ink mb-3">{title}</h1>
      <p className="text-ink-soft mb-8">{message}</p>
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-ink hover:text-accent link-underline"
      >
        <ArrowLeft size={14} />
        Back to all products
      </Link>
    </div>
  );
}
