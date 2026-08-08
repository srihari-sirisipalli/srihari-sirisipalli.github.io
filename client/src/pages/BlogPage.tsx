import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function BlogPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-16"
      >
        <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
          Blog
        </p>
        <h1 className="font-display text-display-lg text-ink mb-6">
          Notes on shipping <em className="italic text-accent">software</em> for engineering R&amp;D.
        </h1>
      </motion.div>

      {blogPosts.length === 0 ? (
        <p className="text-ink-faint">No posts yet.</p>
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {blogPosts.map((post) => (
            <motion.li key={post.slug} variants={staggerItem} className="border-b border-rule pb-10 last:border-b-0">
              <Link href={`/blog/${post.slug}`} className="group block">
                {post.date && (
                  <p className="text-xs text-ink-faint mb-3 uppercase tracking-wide">
                    {post.date}
                  </p>
                )}
                <h2 className="font-display text-2xl md:text-3xl text-ink group-hover:text-accent transition-colors mb-3 inline-flex items-center gap-2">
                  {post.title}
                  <ArrowUpRight size={20} className="text-ink-faint group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </h2>
                {post.summary && (
                  <p className="text-ink-soft leading-relaxed">{post.summary}</p>
                )}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
