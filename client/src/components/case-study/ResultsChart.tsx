import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type ChartKind = "bar" | "line" | "scatter";

interface ResultsChartProps {
  kind: ChartKind;
  data: Record<string, number | string>[];
  xKey: string;
  series: { dataKey: string; label?: string; color?: string }[];
  caption?: string;
  height?: number;
  yLabel?: string;
}

const palette = ["#60a5fa", "#a78bfa", "#22d3ee", "#facc15", "#4ade80", "#f87171"];

export default function ResultsChart({
  kind,
  data,
  xKey,
  series,
  caption,
  height = 280,
  yLabel,
}: ResultsChartProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart(kind, data, xKey, series, yLabel)}
        </ResponsiveContainer>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-text-dim text-center font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function renderChart(
  kind: ChartKind,
  data: Record<string, number | string>[],
  xKey: string,
  series: { dataKey: string; label?: string; color?: string }[],
  yLabel?: string,
) {
  const axisColor = "#64748b";
  const gridColor = "rgba(255,255,255,0.06)";
  const tooltipStyle = {
    backgroundColor: "#12121a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: 12,
    color: "#e2e8f0",
  } as const;

  const commonAxes = (
    <>
      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
      <XAxis dataKey={xKey} stroke={axisColor} fontSize={11} tickLine={false} />
      <YAxis
        stroke={axisColor}
        fontSize={11}
        tickLine={false}
        label={
          yLabel
            ? { value: yLabel, angle: -90, position: "insideLeft", fill: axisColor, fontSize: 11 }
            : undefined
        }
      />
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(96,165,250,0.06)" }} />
      {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, color: axisColor }} />}
    </>
  );

  if (kind === "bar") {
    return (
      <BarChart data={data}>
        {commonAxes}
        {series.map((s, i) => (
          <Bar
            key={s.dataKey}
            dataKey={s.dataKey}
            name={s.label ?? s.dataKey}
            fill={s.color ?? palette[i % palette.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    );
  }

  if (kind === "line") {
    return (
      <LineChart data={data}>
        {commonAxes}
        {series.map((s, i) => (
          <Line
            key={s.dataKey}
            type="monotone"
            dataKey={s.dataKey}
            name={s.label ?? s.dataKey}
            stroke={s.color ?? palette[i % palette.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    );
  }

  // scatter
  return (
    <ScatterChart>
      {commonAxes}
      {series.map((s, i) => (
        <Scatter
          key={s.dataKey}
          name={s.label ?? s.dataKey}
          data={data.map((d) => ({ [xKey]: d[xKey], [s.dataKey]: d[s.dataKey] }))}
          fill={s.color ?? palette[i % palette.length]}
        />
      ))}
    </ScatterChart>
  );
}
