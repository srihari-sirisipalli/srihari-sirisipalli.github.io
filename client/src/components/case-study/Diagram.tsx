import type { ReactNode } from "react";

interface DiagramProps {
  caption?: string;
  children: ReactNode;
}

export default function Diagram({ caption, children }: DiagramProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-xl bg-bg-card border border-surface-border p-4 sm:p-6 overflow-x-auto">
        <div className="text-text">{children}</div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-text-dim text-center font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
