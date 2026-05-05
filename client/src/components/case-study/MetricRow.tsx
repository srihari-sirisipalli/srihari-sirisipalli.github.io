import MetricChip from "@/components/ui/MetricChip";

interface MetricRowProps {
  metrics: { value: string; label: string }[];
}

export default function MetricRow({ metrics }: MetricRowProps) {
  return (
    <div className="flex flex-wrap gap-2 my-6 not-prose">
      {metrics.map((m) => (
        <MetricChip key={m.label} value={m.value} label={m.label} />
      ))}
    </div>
  );
}
