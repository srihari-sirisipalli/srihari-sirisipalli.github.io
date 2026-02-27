import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Mail, MapPin, Linkedin, Github, Calendar,
  Send, MessageSquare,
} from "lucide-react";
import { personal } from "@/data/personal";
import SectionWrapper from "@/components/layout/SectionWrapper";
import { cn } from "@/lib/utils";

type ContactMode = "form" | "calendly";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [mode, setMode] = useState<ContactMode>("form");
  const [submitted, setSubmitted] = useState(false);

  return (
    <SectionWrapper id="contact">
      <h2 className="text-3xl md:text-4xl font-bold mb-2">
        <span className="gradient-text">Get In Touch</span>
      </h2>
      <div className="w-16 h-1 bg-primary rounded-full mb-4" />
      <p className="text-text-muted max-w-lg mb-6">
        Ready to collaborate on AI/ML projects or discuss opportunities? Let's
        connect.
      </p>

      {/* Quick reference links — email (mailto), LinkedIn, GitHub, location */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <a
          href={`mailto:${personal.email}`}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-text-muted hover:text-primary transition-colors"
        >
          <Mail size={14} />
          Send Email
        </a>
        <a
          href={personal.socialLinks[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-text-muted hover:text-primary transition-colors"
        >
          <Linkedin size={14} />
          LinkedIn
        </a>
        <a
          href={personal.socialLinks[1].url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm text-text-muted hover:text-primary transition-colors"
        >
          <Github size={14} />
          GitHub
        </a>
        <span className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-dim">
          <MapPin size={14} />
          {personal.location}
        </span>
      </div>

      {/* Tabs: Form / Calendly */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setMode("form")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            mode === "form"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "text-text-muted hover:text-text border border-transparent hover:border-surface-border"
          )}
        >
          <MessageSquare size={16} />
          Send Message
        </button>
        <button
          onClick={() => setMode("calendly")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            mode === "calendly"
              ? "bg-primary/15 text-primary border border-primary/30"
              : "text-text-muted hover:text-text border border-transparent hover:border-surface-border"
          )}
        >
          <Calendar size={16} />
          Schedule a Call
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-xl"
          >
            {submitted ? (
              <div className="glass rounded-xl p-8 text-center">
                <div className="text-4xl mb-3">&#10003;</div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  Message Sent!
                </h3>
                <p className="text-text-muted text-sm">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <ContactForm onSuccess={() => setSubmitted(true)} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="calendly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calendar size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">
                    Schedule a Meeting
                  </h3>
                  <p className="text-sm text-text-muted">
                    Pick a time that works for you
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden bg-bg border border-surface-border">
                <iframe
                  src={`${personal.calendlyUrl}?hide_gdpr_banner=1&background_color=0a0a0f&text_color=e2e8f0&primary_color=60a5fa`}
                  width="100%"
                  height="630"
                  frameBorder="0"
                  title="Schedule a meeting"
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}

function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const res = await fetch(personal.formspreeEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) onSuccess();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-bg-card border border-surface-border text-text text-sm placeholder:text-text-dim focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          {...register("name", { required: true })}
          placeholder="Your Name"
          className={cn(inputClass, errors.name && "border-terminal-red/50")}
        />
        <input
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          placeholder="Your Email"
          className={cn(inputClass, errors.email && "border-terminal-red/50")}
        />
      </div>
      <input
        {...register("subject", { required: true })}
        placeholder="Subject"
        className={cn(inputClass, errors.subject && "border-terminal-red/50")}
      />
      <textarea
        {...register("message", { required: true })}
        placeholder="Your Message"
        rows={5}
        className={cn(inputClass, "resize-none", errors.message && "border-terminal-red/50")}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-bg font-semibold text-sm hover:bg-primary-bright disabled:opacity-50 transition-colors"
      >
        <Send size={16} />
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
