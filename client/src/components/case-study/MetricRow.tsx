interface MetricRowProps {
  metrics: { value: string; label: string }[];
}

export default function MetricRow({ metrics }: MetricRowProps) {
  return (
    <div className="flex flex-wrap gap-6 my-8 not-prose border-t border-b border-rule py-6">
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col">
          <span className="font-display text-2xl md:text-3xl text-ink">{m.value}</span>
          <span className="text-xs text-ink-faint uppercase tracking-wide mt-1">{m.label}</span>
        </div>
      ))}
    </div>
  );
}
