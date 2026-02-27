import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, ExternalLink } from "lucide-react";
import { education, certifications, courses } from "@/data/education";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { staggerContainer, fadeUp } from "@/lib/animations";

export default function Education() {
  return (
    <SectionWrapper id="education">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Education</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-10" />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Degree */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GraduationCap size={22} />
            </div>
            <h3 className="text-lg font-semibold">Degree</h3>
          </div>
          <h4 className="text-text font-medium">{education.degree}</h4>
          <p className="text-sm text-text-muted mt-1">
            {education.specialization}
          </p>
          <p className="text-sm text-text-muted">
            {education.university}
          </p>
          <p className="text-xs text-text-dim font-mono mt-2">
            {education.period}
          </p>
        </div>

        {/* Certifications */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <Award size={22} />
            </div>
            <h3 className="text-lg font-semibold">Certifications</h3>
          </div>
          <motion.ul
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {certifications.map((cert) => (
              <motion.li key={cert.name} variants={fadeUp}>
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group text-sm py-2 active:text-primary"
                >
                  <ExternalLink
                    size={14}
                    className="mt-0.5 text-text-dim group-hover:text-primary shrink-0 transition-colors"
                  />
                  <div>
                    <span className="text-text group-hover:text-primary transition-colors">
                      {cert.name}
                    </span>
                    <span className="block text-xs text-text-dim">
                      {cert.issuer}
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Coursework */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-terminal-green/10 text-terminal-green">
              <BookOpen size={22} />
            </div>
            <h3 className="text-lg font-semibold">Coursework</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {courses.map((course) => (
              <span
                key={course}
                className="px-2.5 py-1 text-xs rounded-md bg-surface text-text-muted border border-surface-border"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
