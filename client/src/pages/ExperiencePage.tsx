import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  workExperience,
  consultingRole,
  advisoryExperience,
} from "@/data/experience";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function ExperiencePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-16"
      >
        <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
          Experience
        </p>
        <h1 className="font-display text-display-lg text-ink mb-6">
          Roles &amp; <em className="italic text-accent">practice</em>.
        </h1>
        <p className="text-lg text-ink-soft max-w-2xl">
          Current engagements, the shape of my consulting practice, and the
          earlier roles that got me here.
        </p>
      </motion.header>

      <SectionHeading>Current</SectionHeading>
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-12 mb-24"
      >
        {workExperience
          .filter((r) => r.period.includes("Present"))
          .map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
      </motion.ol>

      <SectionHeading>Consulting practice</SectionHeading>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-24"
      >
        <div className="mb-8">
          <h3 className="font-display text-2xl text-ink mb-2">
            {consultingRole.title}
          </h3>
          <p className="text-sm text-ink-soft">
            {consultingRole.company} · {consultingRole.period} ·{" "}
            {consultingRole.location}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
          {consultingRole.projects.map((p) => (
            <div key={p.id}>
              <h4 className="font-display text-lg text-ink mb-2">{p.title}</h4>
              <ul className="text-sm text-ink-soft space-y-1.5 list-inside">
                {p.achievements.map((a, i) => (
                  <li key={i} className="pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-accent before:font-bold">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      {advisoryExperience.length > 0 && (
        <>
          <SectionHeading>Advisory</SectionHeading>
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12 mb-24"
          >
            {advisoryExperience.map((r) => (
              <RoleCard key={r.id} role={r} />
            ))}
          </motion.ol>
        </>
      )}

      <SectionHeading>Earlier</SectionHeading>
      <motion.ol
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {workExperience
          .filter((r) => !r.period.includes("Present"))
          .map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
      </motion.ol>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl text-ink mb-8 pb-3 border-b border-rule">
      {children}
    </h2>
  );
}

function RoleCard({
  role,
}: {
  role: {
    id: string;
    title: string;
    company: string;
    period: string;
    location: string;
    achievements: string[];
  };
}) {
  return (
    <motion.li variants={staggerItem}>
      <div className="grid sm:grid-cols-[180px_1fr] gap-4 sm:gap-8">
        <div>
          <p className="text-sm text-ink-faint">{role.period}</p>
          <p className="text-xs text-ink-faint mt-1">{role.location}</p>
        </div>
        <div>
          <h3 className="font-display text-xl text-ink mb-1">{role.title}</h3>
          <p className="text-sm text-accent mb-4">{role.company}</p>
          <ul className="text-sm text-ink-soft space-y-2 list-inside">
            {role.achievements.map((a, i) => (
              <li key={i} className="pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-accent before:font-bold">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.li>
  );
}
