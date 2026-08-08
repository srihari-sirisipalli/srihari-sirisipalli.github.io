import type { ReactNode } from "react";

interface DiagramProps {
  caption?: string;
  children: ReactNode;
}

export default function Diagram({ caption, children }: DiagramProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-xl bg-bg-sunk border border-rule p-4 sm:p-6 overflow-x-auto">
        <div className="text-ink">{children}</div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-ink-faint text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
