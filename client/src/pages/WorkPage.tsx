import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { portfolio, type PortfolioProject } from "@/data/projects";
import TechStackFrequency from "@/components/sections/TechStackFrequency";
import ProjectGrid from "@/components/work/ProjectGrid";
import ProjectFilters, {
  type FilterState,
  type FilterType,
  type SortKey,
} from "@/components/work/ProjectFilters";
import { fadeUp } from "@/lib/animations";

const VALID_TYPES: FilterType[] = ["all", "professional", "rnd", "academic"];
const VALID_SORTS: SortKey[] = ["default", "az", "za", "metrics"];

function readStateFromUrl(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const typeRaw = params.get("type");
  const techRaw = params.get("tech");
  const queryRaw = params.get("q");
  const sortRaw = params.get("sort");

  return {
    type: VALID_TYPES.includes(typeRaw as FilterType) ? (typeRaw as FilterType) : "all",
    techs: new Set(
      techRaw ? techRaw.split(",").map((s) => s.trim()).filter(Boolean) : [],
    ),
    query: queryRaw ?? "",
    sort: VALID_SORTS.includes(sortRaw as SortKey) ? (sortRaw as SortKey) : "default",
  };
}

function writeStateToUrl(state: FilterState) {
  const params = new URLSearchParams();
  if (state.type !== "all") params.set("type", state.type);
  if (state.techs.size > 0) params.set("tech", Array.from(state.techs).join(","));
  if (state.query.trim()) params.set("q", state.query.trim());
  if (state.sort !== "default") params.set("sort", state.sort);
  const qs = params.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
  window.history.replaceState(null, "", url);
}

function applyFilters(
  all: PortfolioProject[],
  state: FilterState,
): PortfolioProject[] {
  let out = all;

  if (state.type !== "all") {
    out = out.filter((p) => p.type === state.type);
  }

  if (state.techs.size > 0) {
    out = out.filter((p) =>
      Array.from(state.techs).every((t) => p.technologies.includes(t)),
    );
  }

  if (state.query.trim()) {
    const q = state.query.trim().toLowerCase();
    out = out.filter((p) => {
      const hay = [
        p.title,
        p.description,
        p.category,
        ...p.technologies,
        ...(p.metrics?.map((m) => `${m.value} ${m.label}`) ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  if (state.sort === "az") {
    out = [...out].sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sort === "za") {
    out = [...out].sort((a, b) => b.title.localeCompare(a.title));
  } else if (state.sort === "metrics") {
    out = [...out].sort(
      (a, b) => (b.metrics?.length ?? 0) - (a.metrics?.length ?? 0),
    );
  }

  return out;
}

export default function WorkPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const [state, setState] = useState<FilterState>(() => readStateFromUrl());

  useEffect(() => {
    writeStateToUrl(state);
  }, [state]);

  const filtered = useMemo(() => applyFilters(portfolio, state), [state]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-24 md:py-28">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <p className="text-sm font-mono text-primary mb-3">
          <span className="text-text-dim">$</span> ls /work
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Selected <span className="gradient-text">Work</span>
        </h1>
        <div className="w-16 h-1 bg-primary rounded-full mb-3" />
        <p className="text-text-muted max-w-2xl mb-8">
          Every professional engagement, R&D project, and academic build I've
          shipped. Filter by type or tech, search by anything, sort however
          works for you.
        </p>
      </motion.div>

      <TechStackFrequency />

      <ProjectFilters
        state={state}
        onChange={setState}
        totalCount={portfolio.length}
        filteredCount={filtered.length}
      />

      <ProjectGrid projects={filtered} />
    </div>
  );
}
