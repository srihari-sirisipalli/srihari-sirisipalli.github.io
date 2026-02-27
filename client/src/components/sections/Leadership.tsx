import { motion } from "framer-motion";
import { Users, Shield, FlaskConical } from "lucide-react";
import { activities } from "@/data/leadership";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { staggerContainer, fadeUp } from "@/lib/animations";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users size={22} />,
  Shield: <Shield size={22} />,
  FlaskConical: <FlaskConical size={22} />,
};

export default function Leadership() {
  return (
    <SectionWrapper id="leadership">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Leadership & Activities</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-8" />

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={fadeUp}
            className="glass rounded-xl p-6 hover:bg-surface-hover transition-colors group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {iconMap[activity.icon]}
              </div>
              <div>
                <h3 className="text-base font-semibold text-text group-hover:text-primary transition-colors">
                  {activity.title}
                </h3>
                <p className="text-xs text-text-dim font-mono">
                  {activity.period}
                </p>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              {activity.description}
            </p>
            <div className="px-3 py-1.5 rounded-lg bg-terminal-green/10 text-terminal-green text-xs font-medium inline-block">
              {activity.highlight}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
