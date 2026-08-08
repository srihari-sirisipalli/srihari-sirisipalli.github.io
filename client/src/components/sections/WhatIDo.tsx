import { motion } from "framer-motion";
import {
  Sparkles, Waves, Smartphone, Server, Zap, Eye, Ruler, Anchor, Bot,
  Ship, Compass, Cpu,
  type LucideIcon,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

const pillars: { icon: LucideIcon; label: string; hint: string }[] = [
  { icon: Ship, label: "Ship & Boat Design", hint: "Naval architecture, hydrostatics, stability" },
  { icon: Waves, label: "Offshore Structures", hint: "Platforms, risers, mooring, gangways" },
  { icon: Anchor, label: "AUV & Underwater", hint: "Leading vehicle design and delivery" },
  { icon: Compass, label: "Simulations", hint: "CFD, FEA, MOSES, hydrodynamics" },
  { icon: Cpu, label: "Digital Twins", hint: "Marine, offshore, battery, motion" },
  { icon: Bot, label: "AI, ML & GenAI", hint: "LLMs, RAG, offline agents, DL" },
  { icon: Eye, label: "Computer Vision", hint: "Detection, tracking, retrieval" },
  { icon: Zap, label: "Automation", hint: "CAD, CAE, DOE, CI/CD, pipelines" },
  { icon: Ruler, label: "Industry Software", hint: "Domain apps for engineering teams" },
  { icon: Smartphone, label: "Apps", hint: "Mobile and desktop, Flutter and PyQt" },
  { icon: Server, label: "Websites & Platforms", hint: "Full-stack web, in production" },
  { icon: Sparkles, label: "Fractional CTO", hint: "Product, delivery, teams" },
];

export default function WhatIDo() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
            What I do
          </p>
          <h2 className="font-display text-display-lg text-ink max-w-3xl">
            Lead. Engineer. <em className="italic text-accent">Build</em>.<br />
            End-to-end.
          </h2>
        </motion.div>

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-rule border border-rule rounded-2xl overflow-hidden"
        >
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <motion.li
                key={p.label}
                variants={staggerItem}
                className="bg-bg-elev p-6 sm:p-8 hover:bg-accent-soft transition-colors group cursor-default"
              >
                <Icon size={20} className="text-accent mb-4 transition-transform group-hover:-translate-y-0.5" />
                <p className="font-display font-medium text-lg sm:text-xl text-ink mb-1">{p.label}</p>
                <p className="text-sm text-ink-faint">{p.hint}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
