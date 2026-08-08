import { motion } from "framer-motion";

const items = [
  "Flutter", "Python", "React", "TypeScript", "FastAPI", "Django",
  "AWS Lambda", "DigitalOcean", "Terraform", "Docker", "Redis", "PostgreSQL",
  "LangChain", "FAISS", "PyTorch", "Scikit-learn", "ANSYS Fluent", "Bentley MOSES",
  "PyQt5", "Whisper", "Ollama",
];

export default function TechMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="py-16 sm:py-20 border-y border-rule bg-bg-sunk overflow-hidden">
      <p className="text-center text-xs uppercase tracking-wide text-ink-faint mb-8 font-medium">
        Selected stack
      </p>
      <div className="relative">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-2xl sm:text-3xl text-ink-soft flex-shrink-0"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
