import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { workProjects } from "@/data/projects";
import PortfolioCard from "@/components/work/PortfolioCard";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", ...Array.from(new Set(workProjects.map((p) => p.category)))];

export default function WorkPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (category === "All") return workProjects;
    return workProjects.filter((p) => p.category === category);
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-16"
      >
        <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
          Products
        </p>
        <h1 className="font-display text-display-lg text-ink mb-6 max-w-3xl">
          Products I&apos;ve <em className="italic text-accent">built</em> and <em className="italic text-accent">shipped</em>.
        </h1>
        <p className="text-lg text-ink-soft max-w-2xl">
          Apps, Websites, Industry Software, AI Systems, and Automations for
          clients and my own product work.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "text-sm px-4 py-2 rounded-full border transition-colors",
              category === cat
                ? "bg-ink text-bg border-ink"
                : "bg-transparent text-ink-soft border-rule hover:border-ink hover:text-ink",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
      >
        {filtered.map((p) => (
          <li key={p.id}>
            <PortfolioCard project={p} />
          </li>
        ))}
      </motion.ul>

      {filtered.length === 0 && (
        <p className="text-center text-ink-faint py-16">No projects in this category yet.</p>
      )}
    </div>
  );
}
