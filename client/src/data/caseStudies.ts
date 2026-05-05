import type { ComponentType } from "react";

export const caseStudyModules = import.meta.glob<{ default: ComponentType }>(
  "../case-studies/*.mdx",
);

export const caseStudySlugs: Set<string> = new Set(
  Object.keys(caseStudyModules).map((k) => {
    const file = k.split("/").pop() ?? "";
    return file.replace(/\.mdx$/, "");
  }),
);
