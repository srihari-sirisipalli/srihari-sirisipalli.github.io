import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Briefcase, FlaskConical, Lightbulb } from "lucide-react";
import {
  workExperience,
  rndExperience,
  advisoryExperience,
} from "@/data/experience";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";

type Tab = "work" | "rnd" | "advisory";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "work", label: "Work", icon: <Briefcase size={16} /> },
  { id: "rnd", label: "R&D", icon: <FlaskConical size={16} /> },
  { id: "advisory", label: "Advisory", icon: <Lightbulb size={16} /> },
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<Tab>("work");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SectionWrapper id="experience">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Experience</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-8" />

      {/* Tabs */}
      <div className="flex gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setExpanded(null);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary/15 text-primary border border-primary/30"
                : "text-text-muted hover:text-text border border-transparent hover:border-surface-border"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "work" && (
            <Timeline
              items={workExperience.map((e) => ({
                id: e.id,
                title: e.title,
                subtitle: `${e.company} • ${e.location}`,
                period: e.period,
                bullets: e.achievements,
              }))}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          )}
          {activeTab === "rnd" && (
            <Timeline
              items={rndExperience.map((e) => ({
                id: e.id,
                title: e.title,
                subtitle: e.description,
                period: "",
                bullets: e.achievements,
              }))}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          )}
          {activeTab === "advisory" && (
            <Timeline
              items={advisoryExperience.map((e) => ({
                id: e.id,
                title: e.title,
                subtitle: `${e.company} • ${e.period}`,
                period: e.period,
                bullets: e.achievements,
              }))}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  bullets: string[];
}

function Timeline({
  items,
  expanded,
  setExpanded,
}: {
  items: TimelineItem[];
  expanded: string | null;
  setExpanded: (id: string | null) => void;
}) {
  return (
    <motion.div
      className="relative ml-1.5 pl-6 border-l border-primary/20"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        const isOpen = expanded === item.id;
        return (
          <motion.div
            key={item.id}
            variants={fadeUp}
            className="relative mb-8 last:mb-0"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[30px] top-[22px] w-3 h-3 rounded-full bg-primary/60 border-2 border-bg" />

            <button
              onClick={() => setExpanded(isOpen ? null : item.id)}
              className="w-full text-left glass rounded-xl p-5 hover:bg-surface-hover transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-text group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {item.subtitle}
                  </p>
                  {item.period && (
                    <p className="text-xs text-text-dim font-mono mt-1">
                      {item.period}
                    </p>
                  )}
                </div>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-text-dim transition-transform mt-1 shrink-0",
                    isOpen && "rotate-180"
                  )}
                />
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2 overflow-hidden"
                  >
                    {item.bullets.map((b, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="text-sm text-text-muted pl-5 relative leading-relaxed"
                      >
                        <span className="absolute left-0 top-0 text-primary">▹</span>
                        {b}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
