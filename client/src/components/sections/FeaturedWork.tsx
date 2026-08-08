import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/data/projects";
import { caseStudySlugs } from "@/data/caseStudies";
import { staggerContainer, staggerItem } from "@/lib/animations";

const FEATURED_IDS = ["openct-rebuild", "offshore-digital-twin", "sccl-mining-cv"];

export default function FeaturedWork() {
  const featured = FEATURED_IDS.map((id) => portfolio.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section id="work-preview" className="py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
              Selected products
            </p>
            <h2 className="font-display text-display-lg text-ink">
              Recently <em className="italic text-accent">shipped</em>.
            </h2>
          </motion.div>
          <Link
            href="/work"
            className="text-sm text-ink font-medium inline-flex items-center gap-1 link-underline"
          >
            All products
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-6 md:gap-8"
        >
          {featured.map((p) => (
            <motion.li key={p.id} variants={staggerItem}>
              <ProjectPreviewCard project={p} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function ProjectPreviewCard({ project }: { project: typeof portfolio[number] }) {
  const hasCaseStudy = caseStudySlugs.has(project.id);
  const externalHref = hasCaseStudy ? undefined : project.href;

  const inner = (
    <>
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-accent-soft border border-rule mb-4 group-hover:border-accent transition-colors">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/work/placeholder.svg";
          }}
        />
      </div>
      <p className="text-xs text-ink-faint uppercase tracking-wide mb-2 font-medium">
        {project.category}
      </p>
      <h3 className="font-display text-xl text-ink mb-2 group-hover:text-accent transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-ink-soft leading-relaxed">
        {project.description}
      </p>
    </>
  );

  if (hasCaseStudy) {
    return (
      <Link href={`/work/${project.id}`} className="block group">
        {inner}
      </Link>
    );
  }
  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        {inner}
      </a>
    );
  }
  return <div className="block group">{inner}</div>;
}
