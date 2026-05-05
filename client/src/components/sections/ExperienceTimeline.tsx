import { useMemo } from "react";
import {
  workExperience,
  consultingRole,
  advisoryExperience,
} from "@/data/experience";

type Category = "work" | "consulting" | "advisory";

interface TimelineRole {
  id: string;
  label: string;
  sub: string;
  start: number;
  end: number;
  category: Category;
}

const monthMap: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseMonthYear(s: string): number {
  // "Mar 2024" → 2024 + 2/12 ; "2024" → 2024
  const m = s.trim().match(/^([A-Za-z]+)?\s*(\d{4})$/);
  if (!m) return Number.NaN;
  const year = parseInt(m[2], 10);
  const monthName = (m[1] ?? "").slice(0, 3).toLowerCase();
  const month = monthName in monthMap ? monthMap[monthName] : 0;
  return year + month / 12;
}

function nowFractional(): number {
  const d = new Date();
  return d.getFullYear() + d.getMonth() / 12;
}

function parseRange(period: string): { start: number; end: number } | null {
  // "Mar 2024 – Present" or "2024 – 2025" or "2023"
  const parts = period.split(/[–-]/).map((s) => s.trim());
  if (parts.length === 1) {
    const v = parseMonthYear(parts[0]);
    if (Number.isNaN(v)) return null;
    return { start: v, end: v + 1 / 12 };
  }
  const start = parseMonthYear(parts[0]);
  const endRaw = parts[1].toLowerCase();
  const end = endRaw === "present" ? nowFractional() : parseMonthYear(parts[1]);
  if (Number.isNaN(start) || Number.isNaN(end)) return null;
  return { start, end };
}

const colors: Record<Category, { bar: string; label: string }> = {
  work:       { bar: "#60a5fa", label: "Work" },
  consulting: { bar: "#a78bfa", label: "R&D" },
  advisory:   { bar: "#22d3ee", label: "Advisory" },
};

export default function ExperienceTimeline() {
  const roles: TimelineRole[] = useMemo(() => {
    const out: TimelineRole[] = [];

    workExperience.forEach((e) => {
      const r = parseRange(e.period);
      if (!r) return;
      out.push({
        id: e.id,
        label: e.title,
        sub: e.company,
        start: r.start,
        end: r.end,
        category: "work",
      });
    });

    const cr = parseRange(consultingRole.period);
    if (cr) {
      out.push({
        id: "consulting",
        label: consultingRole.title,
        sub: consultingRole.company,
        start: cr.start,
        end: cr.end,
        category: "consulting",
      });
    }

    advisoryExperience.forEach((a) => {
      const r = parseRange(a.period);
      if (!r) return;
      out.push({
        id: a.id,
        label: a.title,
        sub: a.company,
        start: r.start,
        end: r.end,
        category: "advisory",
      });
    });

    return out.sort((a, b) => a.start - b.start);
  }, []);

  if (roles.length === 0) return null;

  const minYear = Math.floor(Math.min(...roles.map((r) => r.start)));
  const maxYearRaw = Math.max(...roles.map((r) => r.end));
  const maxYear = Math.ceil(maxYearRaw + 0.001);
  const yearSpan = maxYear - minYear;

  const yearTicks: number[] = [];
  for (let y = minYear; y <= maxYear; y++) yearTicks.push(y);

  const labelW = 180;
  const padR = 24;
  const rowH = 32;
  const rowGap = 8;
  const axisH = 28;
  const innerW = 720; // SVG viewBox width inner content
  const totalW = labelW + innerW + padR;
  const totalH = roles.length * (rowH + rowGap) + axisH + 16;

  const xFor = (year: number) =>
    labelW + ((year - minYear) / yearSpan) * innerW;

  return (
    <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-5 mb-10 overflow-x-auto">
      <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-text-dim">
        <span>Career timeline</span>
        <div className="flex items-center gap-3">
          {(Object.entries(colors) as [Category, typeof colors.work][]).map(
            ([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded"
                  style={{ background: v.bar }}
                  aria-hidden="true"
                />
                {v.label}
              </span>
            ),
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        width="100%"
        role="img"
        aria-label="Career timeline showing role periods across work, consulting, and advisory engagements."
        style={{ minWidth: 600 }}
      >
        {/* Year grid + axis */}
        <g>
          {yearTicks.map((y) => {
            const x = xFor(y);
            return (
              <g key={y}>
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={totalH - axisH}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={totalH - 8}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={11}
                  fontFamily="Fira Code, monospace"
                >
                  {y}
                </text>
              </g>
            );
          })}
        </g>

        {/* Role bars */}
        <g>
          {roles.map((r, i) => {
            const y = i * (rowH + rowGap);
            const x1 = xFor(r.start);
            const x2 = xFor(r.end);
            const width = Math.max(x2 - x1, 6);
            const c = colors[r.category];
            return (
              <g key={r.id}>
                <text
                  x={labelW - 12}
                  y={y + rowH / 2 + 4}
                  textAnchor="end"
                  fill="#e2e8f0"
                  fontSize={12}
                  fontWeight={500}
                >
                  {r.sub}
                </text>
                <rect
                  x={x1}
                  y={y}
                  width={width}
                  height={rowH}
                  rx={4}
                  fill={c.bar}
                  fillOpacity={0.18}
                  stroke={c.bar}
                  strokeWidth={1.25}
                />
                <text
                  x={x1 + 8}
                  y={y + rowH / 2 + 4}
                  fill="#e2e8f0"
                  fontSize={11}
                  fontFamily="Inter, sans-serif"
                >
                  {r.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
