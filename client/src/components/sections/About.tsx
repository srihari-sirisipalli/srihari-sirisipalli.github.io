import { motion } from "framer-motion";
import { personal } from "@/data/personal";
import SectionWrapper from "@/components/layout/SectionWrapper";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { staggerContainer, fadeUp } from "@/lib/animations";

export default function About() {
  return (
    <SectionWrapper id="about">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-6" />
          {personal.bio.map((p, i) => (
            <p key={i} className="text-text-muted leading-relaxed mb-4">
              {p}
            </p>
          ))}
        </div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {personal.stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="glass rounded-xl p-4 sm:p-6 text-center hover:bg-surface-hover transition-colors"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
