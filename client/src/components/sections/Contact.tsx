import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Mail, Linkedin, Github, type LucideIcon } from "lucide-react";
import { personal } from "@/data/personal";

const iconMap: Record<string, LucideIcon> = {
  LinkedIn: Linkedin,
  GitHub: Github,
};

export default function Contact() {
  return (
    <section id="contact" className="py-24 sm:py-32 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm text-accent tracking-wide mb-4 uppercase font-medium">
            Get in touch
          </p>
          <h2 className="font-display text-display-lg text-ink mb-8 max-w-3xl">
            Have a project that needs
            <br />
            <em className="italic text-accent">shipping</em>?
          </h2>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl">
            <div>
              <p className="text-sm text-ink-faint mb-3 uppercase tracking-wide">Book a call</p>
              <a
                href={personal.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-ink text-bg px-6 py-3 rounded-full text-sm font-medium hover:bg-accent transition-colors group"
              >
                <Calendar size={16} />
                Schedule a discovery call
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <p className="mt-3 text-sm text-ink-soft">
                Fifteen minutes. We talk scope, timeline, and fit.
              </p>
            </div>

            <div>
              <p className="text-sm text-ink-faint mb-3 uppercase tracking-wide">Or reach out</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${personal.email}`}
                    className="inline-flex items-center gap-2 text-ink hover:text-accent link-underline"
                  >
                    <Mail size={16} />
                    {personal.email}
                  </a>
                </li>
                {personal.socialLinks.map((link) => {
                  const Icon = iconMap[link.platform];
                  return (
                    <li key={link.platform}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-ink hover:text-accent link-underline"
                      >
                        {Icon && <Icon size={16} />}
                        {link.platform}
                      </a>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={personal.resumeUrl}
                    download
                    className="inline-flex items-center gap-2 text-ink hover:text-accent link-underline"
                  >
                    Resume (PDF)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
