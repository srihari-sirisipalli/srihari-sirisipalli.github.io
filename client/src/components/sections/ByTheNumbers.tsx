import { motion } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { staggerContainer, fadeUp } from "@/lib/animations";

interface BigStat {
  value: string;
  label: string;
  context: string;
}

const stats: BigStat[] = [
  {
    value: "88,560",
    label: "Simulated sea states",
    context: "Offshore riser ML training corpus",
  },
  {
    value: "1.08M",
    label: "Model fits",
    context: "Across 3,525 ML/DL experiments",
  },
  {
    value: "15,000",
    label: "Automated DOE cases",
    context: "Bentley MOSES sea-transport sweep",
  },
  {
    value: "100K+",
    label: "Images indexed",
    context: "Multi-view FAISS biometric pipeline",
  },
  {
    value: "1,000+",
    label: "LLM evals / day",
    context: "Patent prior-art similarity at scale",
  },
  {
    value: "20M",
    label: "CFD mesh elements",
    context: "Mosaic Poly-Hexcore on DGX-1",
  },
];

export default function ByTheNumbers() {
  return (
    <SectionWrapper id="scale">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        By the <span className="gradient-text">Numbers</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-3" />
      <p className="text-text-muted max-w-2xl mb-10">
        Aggregate scale of the systems, simulations, and pipelines I've shipped,
        drawn from real production and R&D workloads.
      </p>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="glass rounded-xl p-5 sm:p-6 border-l-2 border-l-primary/60 hover:bg-surface-hover transition-colors"
          >
            <div className="font-mono text-3xl sm:text-4xl font-bold text-primary leading-none mb-2">
              {s.value}
            </div>
            <div className="text-sm font-semibold text-text mb-1">
              {s.label}
            </div>
            <div className="text-xs text-text-muted leading-snug">
              {s.context}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
