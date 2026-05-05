import type { ReactNode } from "react";
import { Info, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";

type CalloutKind = "info" | "warning" | "danger" | "insight";

interface CalloutProps {
  kind?: CalloutKind;
  title?: string;
  children: ReactNode;
}

const styles: Record<CalloutKind, { border: string; bg: string; text: string; icon: typeof Info }> = {
  info: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    text: "text-primary",
    icon: Info,
  },
  warning: {
    border: "border-l-terminal-yellow",
    bg: "bg-terminal-yellow/5",
    text: "text-terminal-yellow",
    icon: AlertTriangle,
  },
  danger: {
    border: "border-l-terminal-red",
    bg: "bg-terminal-red/5",
    text: "text-terminal-red",
    icon: AlertCircle,
  },
  insight: {
    border: "border-l-accent",
    bg: "bg-accent/5",
    text: "text-accent",
    icon: Lightbulb,
  },
};

export default function Callout({ kind = "info", title, children }: CalloutProps) {
  const s = styles[kind];
  const Icon = s.icon;
  return (
    <aside
      className={`my-6 rounded-r-lg border-l-2 ${s.border} ${s.bg} p-4 sm:p-5`}
      role="note"
    >
      <div className={`flex items-center gap-2 mb-2 ${s.text}`}>
        <Icon size={16} aria-hidden="true" />
        {title && <span className="font-semibold text-sm">{title}</span>}
      </div>
      <div className="text-sm text-text-muted leading-relaxed [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
