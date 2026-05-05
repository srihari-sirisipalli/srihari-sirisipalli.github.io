interface MetricChipProps {
  value: string;
  label: string;
}

export default function MetricChip({ value, label }: MetricChipProps) {
  return (
    <div className="inline-flex flex-col items-start px-2.5 py-1.5 rounded-md bg-primary/10 border border-primary/20">
      <span className="font-mono text-sm font-semibold text-primary leading-none">
        {value}
      </span>
      <span className="text-[10px] text-text-dim uppercase tracking-wider mt-0.5 leading-none">
        {label}
      </span>
    </div>
  );
}
