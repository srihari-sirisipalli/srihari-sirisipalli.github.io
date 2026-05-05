import { useEffect } from "react";
import { motion } from "framer-motion";
import Contact from "@/components/sections/Contact";
import { fadeUp } from "@/lib/animations";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 md:pt-28 pb-4">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <p className="text-sm font-mono text-primary mb-3">
            <span className="text-text-dim">$</span> mail / book
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mb-3" />
          <p className="text-text-muted max-w-2xl">
            Two ways to reach out: send a structured message via the form, or
            grab a 30-minute slot directly through the calendar. For quick
            things, the email link below is fastest.
          </p>
        </motion.div>
      </div>

      <Contact />
    </>
  );
}
