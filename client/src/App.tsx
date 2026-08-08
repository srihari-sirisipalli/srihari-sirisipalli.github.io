import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";

const WorkPage = lazy(() => import("@/pages/WorkPage"));
const WorkDetailPage = lazy(() => import("@/pages/WorkDetailPage"));
const ResearchPage = lazy(() => import("@/pages/ResearchPage"));
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailPage = lazy(() => import("@/pages/BlogDetailPage"));

function PageFallback() {
  return (
    <div className="text-ink-faint text-sm py-32 text-center" aria-live="polite">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-ink focus:text-bg focus:font-semibold focus:outline-none"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/work">
            <Suspense fallback={<PageFallback />}>
              <WorkPage />
            </Suspense>
          </Route>
          <Route path="/work/:id">
            {(p) => (
              <Suspense fallback={<PageFallback />}>
                <WorkDetailPage id={p.id} />
              </Suspense>
            )}
          </Route>
          <Route path="/case/:id">
            {(p) => <Redirect to={`/work/${p.id}`} replace />}
          </Route>
          <Route path="/research">
            <Suspense fallback={<PageFallback />}>
              <ResearchPage />
            </Suspense>
          </Route>
          <Route path="/experience">
            <Suspense fallback={<PageFallback />}>
              <ExperiencePage />
            </Suspense>
          </Route>
          <Route path="/blog">
            <Suspense fallback={<PageFallback />}>
              <BlogPage />
            </Suspense>
          </Route>
          <Route path="/blog/:slug">
            {(p) => (
              <Suspense fallback={<PageFallback />}>
                <BlogDetailPage slug={p.slug} />
              </Suspense>
            )}
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function NoMatch() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-32 text-center">
      <p className="text-sm text-ink-faint mb-3">404</p>
      <h1 className="font-display text-display-md text-ink mb-3">Page not found</h1>
      <p className="text-ink-soft mb-8">
        The URL you visited doesn't exist on this site.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-ink hover:text-accent link-underline"
      >
        Back home
      </a>
    </div>
  );
}
