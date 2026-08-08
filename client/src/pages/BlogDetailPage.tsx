import { useEffect } from "react";
import { Link } from "wouter";
import { MDXProvider } from "@mdx-js/react";
import { ArrowLeft } from "lucide-react";
import { getBlogPost } from "@/data/blog";
import Callout from "@/components/case-study/Callout";

const mdxComponents = { Callout };

export default function BlogDetailPage({ slug }: { slug: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [slug]);

  const post = getBlogPost(slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-24 text-center">
        <h1 className="font-display text-display-md text-ink mb-4">Post not found</h1>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-ink hover:text-accent link-underline">
          <ArrowLeft size={14} />
          All posts
        </Link>
      </div>
    );
  }

  const Post = post.Component;

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-accent transition-colors mb-12 link-underline"
      >
        <ArrowLeft size={14} />
        All posts
      </Link>

      <header className="mb-12">
        {post.date && (
          <p className="text-xs text-ink-faint mb-3 uppercase tracking-wide">{post.date}</p>
        )}
        <h1 className="font-display text-display-lg text-ink mb-4">{post.title}</h1>
        {post.summary && (
          <p className="text-lg text-ink-soft leading-relaxed">{post.summary}</p>
        )}
      </header>

      <div className="case-study-prose">
        <MDXProvider components={mdxComponents}>
          <Post />
        </MDXProvider>
      </div>
    </article>
  );
}
