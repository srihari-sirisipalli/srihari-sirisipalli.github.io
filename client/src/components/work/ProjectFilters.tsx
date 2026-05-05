import { useMemo } from "react";
import { Search, X } from "lucide-react";
import { portfolio } from "@/data/projects";
import { cn } from "@/lib/utils";

export type FilterType = "all" | "professional" | "rnd" | "academic";
export type SortKey = "default" | "az" | "za" | "metrics";

const TYPE_LABELS: Record<FilterType, string> = {
  all: "All",
  professional: "Professional",
  rnd: "R&D",
  academic: "Academic",
};

const SORT_LABELS: Record<SortKey, string> = {
  default: "Default",
  az: "A to Z",
  za: "Z to A",
  metrics: "Most metrics first",
};

const TOP_TECH_LIMIT = 12;

export interface FilterState {
  type: FilterType;
  techs: Set<string>;
  query: string;
  sort: SortKey;
}

interface ProjectFiltersProps {
  state: FilterState;
  onChange: (next: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export default function ProjectFilters({
  state,
  onChange,
  totalCount,
  filteredCount,
}: ProjectFiltersProps) {
  const topTechs = useMemo(() => {
    const counts: Record<string, number> = {};
    portfolio.forEach((p) =>
      p.technologies.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      }),
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_TECH_LIMIT)
      .map(([name]) => name);
  }, []);

  const typeCounts = useMemo(() => {
    const out: Record<FilterType, number> = { all: 0, professional: 0, rnd: 0, academic: 0 };
    portfolio.forEach((p) => {
      out.all += 1;
      out[p.type] += 1;
    });
    return out;
  }, []);

  const toggleTech = (t: string) => {
    const next = new Set(state.techs);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    onChange({ ...state, techs: next });
  };

  const isFiltered =
    state.type !== "all" ||
    state.techs.size > 0 ||
    state.query.trim() !== "" ||
    state.sort !== "default";

  return (
    <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-5 mb-8 space-y-4">
      {/* Type chips + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(TYPE_LABELS) as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => onChange({ ...state, type: t })}
            aria-pressed={state.type === t}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              state.type === t
                ? "bg-primary/15 text-primary border-primary/30"
                : "text-text-muted hover:text-text border-transparent hover:border-surface-border",
            )}
          >
            {TYPE_LABELS[t]}
            <span className="ml-1.5 text-xs text-text-dim">
              ({typeCounts[t]})
            </span>
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs text-text-dim font-mono uppercase tracking-wider">
            Sort
          </label>
          <select
            id="sort-select"
            value={state.sort}
            onChange={(e) => onChange({ ...state, sort: e.target.value as SortKey })}
            className="bg-bg border border-surface-border rounded-lg px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
        />
        <input
          type="search"
          value={state.query}
          onChange={(e) => onChange({ ...state, query: e.target.value })}
          placeholder="Search title, description, technologies..."
          aria-label="Search projects"
          className="w-full bg-bg border border-surface-border rounded-lg pl-10 pr-10 py-2.5 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        />
        {state.query && (
          <button
            onClick={() => onChange({ ...state, query: "" })}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-dim hover:text-text rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Tech chips */}
      <div>
        <div className="text-[11px] font-mono uppercase tracking-wider text-text-dim mb-2">
          Filter by tech (top {topTechs.length})
        </div>
        <div className="flex flex-wrap gap-1.5">
          {topTechs.map((t) => {
            const active = state.techs.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleTech(t)}
                aria-pressed={active}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-mono transition-all border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  active
                    ? "bg-primary/20 text-primary border-primary/40"
                    : "bg-surface text-text-muted border-surface-border hover:bg-surface-hover hover:text-text",
                )}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + clear */}
      <div className="flex items-center justify-between text-xs text-text-dim font-mono">
        <span>
          Showing <span className="text-text">{filteredCount}</span> of{" "}
          <span className="text-text">{totalCount}</span> projects
        </span>
        {isFiltered && (
          <button
            onClick={() =>
              onChange({ type: "all", techs: new Set(), query: "", sort: "default" })
            }
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
