import type { ReactNode } from "react";
import { Info, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";

type CalloutKind = "info" | "warning" | "danger" | "insight";

interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}

const icons: Record<CalloutKind, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  insight: Lightbulb,
};

export default function Callout({ kind = "info", title, children }: CalloutProps) {
  const Icon = icons[kind];
  return (
    <aside
      className="my-6 rounded-lg border-l-2 border-l-accent bg-accent-soft p-5 not-prose"
      role="note"
    >
      <div className="flex items-center gap-2 mb-2 text-accent-ink">
        <Icon size={16} />
        {title && <span className="font-semibold text-sm">{title}</span>}
      </div>
      <div className="text-sm text-ink-soft leading-relaxed [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
