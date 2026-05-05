import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";

const WorkPage = lazy(() => import("@/pages/WorkPage"));
const WorkDetailPage = lazy(() => import("@/pages/WorkDetailPage"));
const ExperiencePage = lazy(() => import("@/pages/ExperiencePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

function PageFallback() {
  return (
    <div className="text-text-muted text-sm py-32 text-center" aria-live="polite">
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-bg focus:font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg"
      >
        Skip to main content
      </a>
      <ScrollProgress />
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
          <Route path="/experience">
            <Suspense fallback={<PageFallback />}>
              <ExperiencePage />
            </Suspense>
          </Route>
          <Route path="/about">
            <Suspense fallback={<PageFallback />}>
              <AboutPage />
            </Suspense>
          </Route>
          <Route path="/contact">
            <Suspense fallback={<PageFallback />}>
              <ContactPage />
            </Suspense>
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
    <div className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="text-sm font-mono text-text-dim mb-3">404</p>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-text-muted mb-8">
        The URL you visited doesn't exist on this site.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-primary hover:underline"
      >
        Back home
      </a>
    </div>
  );
}
