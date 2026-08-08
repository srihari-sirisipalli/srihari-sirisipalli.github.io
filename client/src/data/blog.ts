import type { ComponentType } from "react";

interface MdxModule {
  default: ComponentType;
  frontmatter?: {
    title?: string;
    date?: string;
    summary?: string;
  };
}

const modules = import.meta.glob<MdxModule>("/src/blog/*.mdx", { eager: true });

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  Component: ComponentType;
}

export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split("/").pop()!.replace(/\.mdx$/, "");
    return {
      slug,
      title: mod.frontmatter?.title ?? slug,
      date: mod.frontmatter?.date ?? "",
      summary: mod.frontmatter?.summary ?? "",
      Component: mod.default,
    };
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

export const blogSlugs = new Set(blogPosts.map((p) => p.slug));

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
