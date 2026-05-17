interface MatrixData {
  rows: string[];
  cols: string[];
  /** rows × cols of intensity 0-3. 0 = blank, 1 = touched, 2 = shipped, 3 = deep */
  cells: (0 | 1 | 2 | 3)[][];
}

const matrix: MatrixData = {
  rows: [
    "LLM / RAG",
    "ML pipelines",
    "Cloud & IaC",
    "Signal processing",
    "Computer vision",
    "Data engineering",
    "Hydrodynamics & CFD",
    "FEA & numerics",
  ],
  cols: [
    "Patents",
    "Offshore",
    "Defense",
    "Power electronics",
    "Agritech",
    "Maritime / naval arch",
  ],
  cells: [
    /* LLM / RAG */            [3, 1, 2, 0, 2, 0],
    /* ML pipelines */         [2, 3, 2, 3, 2, 1],
    /* Cloud & IaC */          [3, 1, 0, 0, 1, 0],
    /* Signal processing */    [0, 3, 2, 1, 0, 1],
    /* Computer vision */      [0, 0, 2, 0, 3, 0],
    /* Data engineering */     [2, 2, 1, 1, 1, 1],
    /* Hydrodynamics & CFD */  [0, 3, 1, 0, 0, 3],
    /* FEA & numerics */       [0, 2, 1, 2, 0, 3],
  ],
};

const intensityClass: Record<0 | 1 | 2 | 3, string> = {
  0: "bg-transparent border border-surface-border/40",
  1: "bg-primary/15 border border-primary/25",
  2: "bg-primary/35 border border-primary/45",
  3: "bg-primary/70 border border-primary",
};

const intensityLabel: Record<0 | 1 | 2 | 3, string> = {
  0: "Not yet",
  1: "Touched",
  2: "Shipped",
  3: "Deep work",
};

export default function DomainMatrix() {
  return (
    <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-6 mb-12 overflow-x-auto">
      <div className="flex items-center justify-between mb-4 text-[11px] font-mono uppercase tracking-wider text-text-dim">
        <span>Domain × capability</span>
        <div className="hidden sm:flex items-center gap-3">
          {([0, 1, 2, 3] as const).map((lvl) => (
            <span key={lvl} className="inline-flex items-center gap-1.5">
              <span
                className={`inline-block w-3 h-3 rounded-sm ${intensityClass[lvl]}`}
                aria-hidden="true"
              />
              {intensityLabel[lvl]}
            </span>
          ))}
        </div>
      </div>

      <table
        className="w-full border-collapse text-xs sm:text-sm"
        role="table"
        aria-label="Domain by capability matrix. Intensity of shipped work per cell."
      >
        <thead>
          <tr>
            <th scope="col" className="p-2 text-left font-semibold text-text" />
            {matrix.cols.map((c) => (
              <th
                key={c}
                scope="col"
                className="p-2 text-left font-semibold text-text whitespace-nowrap align-bottom"
              >
                <span className="block max-w-[100px]">{c}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((rowLabel, ri) => (
            <tr key={rowLabel}>
              <th
                scope="row"
                className="p-2 text-right font-medium text-text-muted whitespace-nowrap"
              >
                {rowLabel}
              </th>
              {matrix.cells[ri].map((lvl, ci) => (
                <td key={ci} className="p-2 align-middle">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md ${intensityClass[lvl]}`}
                    title={`${rowLabel} · ${matrix.cols[ci]}: ${intensityLabel[lvl]}`}
                    aria-label={`${rowLabel} in ${matrix.cols[ci]}: ${intensityLabel[lvl]}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile-only legend */}
      <div className="sm:hidden flex flex-wrap items-center gap-3 mt-4 text-[11px] font-mono uppercase tracking-wider text-text-dim">
        {([0, 1, 2, 3] as const).map((lvl) => (
          <span key={lvl} className="inline-flex items-center gap-1.5">
            <span
              className={`inline-block w-3 h-3 rounded-sm ${intensityClass[lvl]}`}
              aria-hidden="true"
            />
            {intensityLabel[lvl]}
          </span>
        ))}
      </div>
    </div>
  );
}
