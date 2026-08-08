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

const palette = ["#E4572E", "#B4421F", "#1A1A1A", "#4A4A4A", "#8B8B8B", "#DDD5C6"];

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
      <div className="rounded-xl bg-bg-sunk border border-rule p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart(kind, data, xKey, series, yLabel)}
        </ResponsiveContainer>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-ink-faint text-center">
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
  const axisColor = "#8B8B8B";
  const gridColor = "rgba(26,26,26,0.08)";
  const tooltipStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDD5C6",
    borderRadius: 8,
    fontSize: 12,
    color: "#1A1A1A",
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
      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(228,87,46,0.08)" }} />
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
