import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { personal } from "@/data/personal";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 md:pt-48 md:pb-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm text-ink-faint mb-6 tracking-wide">
              Fractional CTO &middot; End-to-end software &amp; product
            </p>
            <h1 className="font-display font-medium text-display-xl text-ink mb-8">
              I ship <em className="italic text-accent">software</em> for<br />
              engineering &amp; industrial <em className="italic text-accent">R&amp;D</em>.
            </h1>
            <p className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-2xl mb-10">
              End-to-end product, AI, digital twins, apps, backend, and
              automations. Hired when a project needs hard engineering depth
              and production software delivery in one place.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href={personal.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ink text-bg px-6 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors group"
              >
                Book a call
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 text-ink text-sm font-medium link-underline"
              >
                See the work
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block"
          >
            <div className="relative w-64 h-80 lg:w-72 lg:h-96 rounded-2xl overflow-hidden bg-accent-soft border border-rule">
              <img
                src="/sri.jpg"
                alt={personal.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/sri-placeholder.svg";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-4 text-xs text-ink-faint text-right font-medium">
              {personal.location}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
