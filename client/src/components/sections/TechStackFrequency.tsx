import { useMemo } from "react";
import { portfolio } from "@/data/projects";

interface TechCount {
  name: string;
  count: number;
}

const TOP_N = 10;

export default function TechStackFrequency() {
  const top: TechCount[] = useMemo(() => {
    const counts: Record<string, number> = {};
    portfolio.forEach((p) => {
      p.technologies.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_N);
  }, []);

  if (top.length === 0) return null;
  const max = top[0].count;

  return (
    <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-5 mb-10">
      <div className="flex items-center justify-between mb-4 text-[11px] font-mono uppercase tracking-wider text-text-dim">
        <span>Top stack across portfolio</span>
        <span>{portfolio.length} projects</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
        {top.map((t) => {
          const pct = (t.count / max) * 100;
          return (
            <div key={t.name} className="flex items-center gap-3">
              <span className="w-28 sm:w-32 shrink-0 text-xs sm:text-sm text-text-muted font-mono truncate">
                {t.name}
              </span>
              <div className="flex-1 h-2 rounded-full bg-surface-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs text-text-dim font-mono tabular-nums">
                {t.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
