import { motion } from "framer-motion";
import {
  Brain, MessageSquare, Cloud, Database, Code, Wrench, Cpu,
  Sparkles, GitBranch, Eye, Zap, TrendingUp,
} from "lucide-react";
import { skillCategories, expertiseAreas } from "@/data/skills";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { staggerContainer, fadeUp } from "@/lib/animations";

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain size={22} />,
  MessageSquare: <MessageSquare size={22} />,
  Cloud: <Cloud size={22} />,
  Database: <Database size={22} />,
  Code: <Code size={22} />,
  Wrench: <Wrench size={22} />,
  Cpu: <Cpu size={22} />,
  Sparkles: <Sparkles size={22} />,
  GitBranch: <GitBranch size={22} />,
  Eye: <Eye size={22} />,
  Zap: <Zap size={22} />,
  TrendingUp: <TrendingUp size={22} />,
};

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Skills & Expertise</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-10" />

      {/* Areas of Expertise — detailed cards */}
      <h3 className="text-xl font-semibold text-text mb-6">Areas of Expertise</h3>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {expertiseAreas.map((area) => (
          <motion.div
            key={area.title}
            variants={fadeUp}
            className="glass rounded-xl p-5 hover:bg-surface-hover transition-colors group"
          >
            <div className="p-2 rounded-lg bg-accent/10 text-accent inline-block mb-3 group-hover:bg-accent/20 transition-colors">
              {iconMap[area.icon] || <Sparkles size={22} />}
            </div>
            <h4 className="text-sm font-semibold text-text mb-2 group-hover:text-accent transition-colors">
              {area.title}
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              {area.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Technical Skills — tag-based */}
      <h3 className="text-xl font-semibold text-text mb-6">Technical Skills</h3>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {skillCategories.map((cat) => (
          <motion.div
            key={cat.id}
            variants={fadeUp}
            className="glass rounded-xl p-5 hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {iconMap[cat.icon]}
              </div>
              <h4 className="text-sm font-semibold text-text">
                {cat.title}
              </h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-2 py-1 text-xs rounded-md bg-surface text-text-muted border border-surface-border"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
