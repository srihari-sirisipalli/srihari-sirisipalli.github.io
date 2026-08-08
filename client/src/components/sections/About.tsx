import { motion } from "framer-motion";
import { personal } from "@/data/personal";
import { workExperience, consultingRole } from "@/data/experience";

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-32 px-5 sm:px-8 bg-bg-sunk">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
            About
          </p>
          <p className="font-display text-3xl md:text-4xl text-ink leading-tight max-w-4xl mb-10">
            {personal.bio[0]}
          </p>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl">
            <div>
              <p className="text-sm text-ink-faint mb-2 uppercase tracking-wide">Now</p>
              <p className="text-ink-soft">
                Fractional CTO at Openct. Independent product development
                practice across apps, websites, industry software, AI,
                automation, and core engineering.
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-faint mb-2 uppercase tracking-wide">Where</p>
              <p className="text-ink-soft">
                {personal.location}. Working remote across timezones.
              </p>
            </div>
            <div>
              <p className="text-sm text-ink-faint mb-2 uppercase tracking-wide">Recent roles</p>
              <ul className="text-ink-soft space-y-1">
                <li>{consultingRole.title} &middot; {consultingRole.company}</li>
                {workExperience.slice(0, 2).map((r) => (
                  <li key={r.id}>{r.title} &middot; {r.company}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-ink-faint mb-2 uppercase tracking-wide">Off-work</p>
              <p className="text-ink-soft">
                Mentored 3 teams at CODEIAM hackathon (2 in top 5 of 40).
                Zenith Science Club core member at Mahindra University.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
